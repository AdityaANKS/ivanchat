/**
 * Storage Service
 * Handles file uploads, storage, and retrieval with multiple provider support
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import AWS from 'aws-sdk';
import cloudinary from 'cloudinary';
import multer from 'multer';
import { promisify } from 'util';
import mime from 'mime-types';

const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);
const existsAsync = promisify(fs.exists);

class StorageService {
  constructor() {
    this.provider = process.env.STORAGE_PROVIDER || 'local'; // local, s3, cloudinary
    this.baseUrl = process.env.STORAGE_BASE_URL || 'http://localhost:5000';
    this.uploadDir = process.env.UPLOAD_DIR || 'uploads';
    
    this.initializeProvider();
    this.setupMulter();
  }

  /**
   * Initialize storage provider
   */
  initializeProvider() {
    switch (this.provider) {
      case 's3':
        this.s3 = new AWS.S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION || 'us-east-1',
        });
        this.bucket = process.env.AWS_S3_BUCKET || 'ivan-chat-uploads';
        break;
      
      case 'cloudinary':
        cloudinary.v2.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        break;
      
      case 'local':
      default:
        this.ensureUploadDirectory();
        break;
    }
  }

  /**
   * Setup Multer for handling multipart uploads
   */
  setupMulter() {
    const storage = multer.memoryStorage();
    
    this.upload = multer({
      storage,
      limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800'), // 50MB default
        files: parseInt(process.env.MAX_FILES || '10'),
      },
      fileFilter: this.fileFilter.bind(this),
    });
  }

  /**
   * File filter for upload validation
   */
  fileFilter(req, file, cb) {
    // Allowed file types
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'application/pdf',
      'application/zip',
      'text/plain',
      'application/json',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`), false);
    }
  }

  /**
   * Ensure upload directory exists
   */
  async ensureUploadDirectory() {
    const dirs = [
      this.uploadDir,
      path.join(this.uploadDir, 'avatars'),
      path.join(this.uploadDir, 'attachments'),
      path.join(this.uploadDir, 'thumbnails'),
      path.join(this.uploadDir, 'temp'),
    ];

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        await mkdirAsync(dir, { recursive: true });
      }
    }
  }

  /**
   * Generate unique filename
   */
  generateFilename(originalName) {
    const ext = path.extname(originalName);
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    return `${timestamp}-${random}${ext}`;
  }

  /**
   * Upload file to storage
   */
  async uploadFile(file, options = {}) {
    const {
      folder = 'attachments',
      userId = null,
      serverId = null,
      channelId = null,
      generateThumbnail = false,
      resize = null,
      quality = 85,
      metadata = {},
    } = options;

    try {
      const filename = this.generateFilename(file.originalname);
      const filepath = `${folder}/${filename}`;
      
      let uploadResult;
      
      switch (this.provider) {
        case 's3':
          uploadResult = await this.uploadToS3(file, filepath, metadata);
          break;
        
        case 'cloudinary':
          uploadResult = await this.uploadToCloudinary(file, folder, metadata);
          break;
        
        case 'local':
        default:
          uploadResult = await this.uploadToLocal(file, filepath, options);
          break;
      }

      // Generate thumbnail if needed
      if (generateThumbnail && this.isImage(file.mimetype)) {
        await this.generateThumbnail(uploadResult.path || uploadResult.url, filename);
      }

      // Store file metadata in database
      const fileRecord = {
        filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: uploadResult.path,
        url: uploadResult.url,
        thumbnailUrl: uploadResult.thumbnailUrl,
        provider: this.provider,
        userId,
        serverId,
        channelId,
        metadata,
        uploadedAt: new Date(),
      };

      return fileRecord;
    } catch (error) {
      console.error('Upload failed:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  /**
   * Upload to local storage
   */
  async uploadToLocal(file, filepath, options = {}) {
    const fullPath = path.join(this.uploadDir, filepath);
    const dir = path.dirname(fullPath);

    // Ensure directory exists
    if (!fs.existsSync(dir)) {
      await mkdirAsync(dir, { recursive: true });
    }

    let buffer = file.buffer;

    // Process image if needed
    if (this.isImage(file.mimetype) && options.resize) {
      buffer = await this.processImage(buffer, options);
    }

    // Write file
    fs.writeFileSync(fullPath, buffer);

    return {
      path: filepath,
      url: `${this.baseUrl}/${filepath}`,
      size: buffer.length,
    };
  }

  /**
   * Upload to AWS S3
   */
  async uploadToS3(file, filepath, metadata = {}) {
    const params = {
      Bucket: this.bucket,
      Key: filepath,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: metadata,
      ACL: 'public-read',
    };

    const result = await this.s3.upload(params).promise();

    return {
      path: filepath,
      url: result.Location,
      etag: result.ETag,
      bucket: result.Bucket,
      key: result.Key,
    };
  }

  /**
   * Upload to Cloudinary
   */
  async uploadToCloudinary(file, folder, metadata = {}) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          tags: metadata.tags || [],
          context: metadata,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              path: result.public_id,
              url: result.secure_url,
              thumbnailUrl: result.eager?.[0]?.secure_url,
              format: result.format,
              width: result.width,
              height: result.height,
              cloudinaryId: result.public_id,
            });
          }
        }
      );

      uploadStream.end(file.buffer);
    });
  }

  /**
   * Process image (resize, compress, etc.)
   */
  async processImage(buffer, options = {}) {
    const {
      width = null,
      height = null,
      quality = 85,
      format = null,
      fit = 'cover',
    } = options.resize || {};

    let image = sharp(buffer);

    // Resize if dimensions provided
    if (width || height) {
      image = image.resize(width, height, { fit });
    }

    // Convert format if specified
    if (format) {
      image = image.toFormat(format, { quality });
    } else {
      // Optimize based on original format
      image = image.jpeg({ quality });
    }

    return await image.toBuffer();
  }

  /**
   * Generate thumbnail
   */
  async generateThumbnail(sourcePath, filename) {
    const thumbnailSize = { width: 200, height: 200 };
    const thumbnailPath = path.join(this.uploadDir, 'thumbnails', filename);

    try {
      if (this.provider === 'local') {
        const sourceFullPath = path.join(this.uploadDir, sourcePath);
        await sharp(sourceFullPath)
          .resize(thumbnailSize.width, thumbnailSize.height, { fit: 'cover' })
          .toFile(thumbnailPath);
      } else if (this.provider === 's3') {
        // Download from S3, process, and re-upload
        const object = await this.s3.getObject({
          Bucket: this.bucket,
          Key: sourcePath,
        }).promise();

        const thumbnail = await sharp(object.Body)
          .resize(thumbnailSize.width, thumbnailSize.height, { fit: 'cover' })
          .toBuffer();

        await this.s3.upload({
          Bucket: this.bucket,
          Key: `thumbnails/${filename}`,
          Body: thumbnail,
          ContentType: 'image/jpeg',
          ACL: 'public-read',
        }).promise();
      }
      // Cloudinary handles thumbnails automatically
    } catch (error) {
      console.error('Thumbnail generation failed:', error);
    }
  }

  /**
   * Delete file from storage
   */
  async deleteFile(filepath) {
    try {
      switch (this.provider) {
        case 's3':
          await this.s3.deleteObject({
            Bucket: this.bucket,
            Key: filepath,
          }).promise();
          break;
        
        case 'cloudinary':
          await cloudinary.v2.uploader.destroy(filepath);
          break;
        
        case 'local':
        default:
          const fullPath = path.join(this.uploadDir, filepath);
          if (fs.existsSync(fullPath)) {
            await unlinkAsync(fullPath);
          }
          
          // Also delete thumbnail if exists
          const thumbnailPath = path.join(this.uploadDir, 'thumbnails', path.basename(filepath));
          if (fs.existsSync(thumbnailPath)) {
            await unlinkAsync(thumbnailPath);
          }
          break;
      }
      
      return true;
    } catch (error) {
      console.error('Delete failed:', error);
      return false;
    }
  }

  /**
   * Delete multiple files
   */
  async deleteFiles(filepaths) {
    const results = await Promise.allSettled(
      filepaths.map(filepath => this.deleteFile(filepath))
    );

    return {
      succeeded: results.filter(r => r.status === 'fulfilled').length,
      failed: results.filter(r => r.status === 'rejected').length,
    };
  }

  /**
   * Get file URL
   */
  getFileUrl(filepath) {
    switch (this.provider) {
      case 's3':
        return `https://${this.bucket}.s3.amazonaws.com/${filepath}`;
      
      case 'cloudinary':
        return cloudinary.v2.url(filepath);
      
      case 'local':
      default:
        return `${this.baseUrl}/${filepath}`;
    }
  }

  /**
   * Get signed URL for private files (S3)
   */
  async getSignedUrl(filepath, expiresIn = 3600) {
    if (this.provider !== 's3') {
      return this.getFileUrl(filepath);
    }

    const params = {
      Bucket: this.bucket,
      Key: filepath,
      Expires: expiresIn,
    };

    return await this.s3.getSignedUrlPromise('getObject', params);
  }

  /**
   * Upload avatar with processing
   */
  async uploadAvatar(file, userId) {
    const options = {
      folder: 'avatars',
      userId,
      resize: {
        width: 256,
        height: 256,
        quality: 90,
      },
      generateThumbnail: true,
    };

    return await this.uploadFile(file, options);
  }

  /**
   * Upload server icon
   */
  async uploadServerIcon(file, serverId) {
    const options = {
      folder: 'servers',
      serverId,
      resize: {
        width: 512,
        height: 512,
        quality: 90,
      },
    };

    return await this.uploadFile(file, options);
  }

  /**
   * Upload message attachment
   */
  async uploadAttachment(file, messageData) {
    const options = {
      folder: 'attachments',
      userId: messageData.userId,
      channelId: messageData.channelId,
      generateThumbnail: this.isImage(file.mimetype),
    };

    return await this.uploadFile(file, options);
  }

  /**
   * Clean up old temporary files
   */
  async cleanupTempFiles(olderThanHours = 24) {
    const tempDir = path.join(this.uploadDir, 'temp');
    const now = Date.now();
    const maxAge = olderThanHours * 60 * 60 * 1000;

    if (!fs.existsSync(tempDir)) return;

    const files = fs.readdirSync(tempDir);
    let deletedCount = 0;

    for (const file of files) {
      const filepath = path.join(tempDir, file);
      const stats = fs.statSync(filepath);
      
      if (now - stats.mtimeMs > maxAge) {
        await unlinkAsync(filepath);
        deletedCount++;
      }
    }

    return deletedCount;
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(userId = null) {
    // This would typically query a database
    // For now, return mock stats
    return {
      totalFiles: 0,
      totalSize: 0,
      filesByType: {},
      storageUsed: 0,
      storageLimit: 5368709120, // 5GB
    };
  }

  /**
   * Validate file size
   */
  validateFileSize(size, maxSize = null) {
    const limit = maxSize || parseInt(process.env.MAX_FILE_SIZE || '52428800');
    return size <= limit;
  }

  /**
   * Check if file is an image
   */
  isImage(mimetype) {
    return mimetype.startsWith('image/');
  }

  /**
   * Check if file is a video
   */
  isVideo(mimetype) {
    return mimetype.startsWith('video/');
  }

  /**
   * Check if file is audio
   */
  isAudio(mimetype) {
    return mimetype.startsWith('audio/');
  }

  /**
   * Get file type category
   */
  getFileCategory(mimetype) {
    if (this.isImage(mimetype)) return 'image';
    if (this.isVideo(mimetype)) return 'video';
    if (this.isAudio(mimetype)) return 'audio';
    if (mimetype.includes('pdf')) return 'document';
    if (mimetype.includes('zip') || mimetype.includes('rar')) return 'archive';
    return 'other';
  }

  /**
   * Create ZIP archive of files
   */
  async createArchive(filepaths, outputName) {
    const archiver = require('archiver');
    const output = fs.createWriteStream(
      path.join(this.uploadDir, 'temp', outputName)
    );
    
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(output);

    for (const filepath of filepaths) {
      const fullPath = path.join(this.uploadDir, filepath);
      if (fs.existsSync(fullPath)) {
        archive.file(fullPath, { name: path.basename(filepath) });
      }
    }

    await archive.finalize();
    
    return {
      path: `temp/${outputName}`,
      url: `${this.baseUrl}/temp/${outputName}`,
      size: archive.pointer(),
    };
  }

  /**
   * Move file to different folder
   */
  async moveFile(oldPath, newFolder) {
    const filename = path.basename(oldPath);
    const newPath = `${newFolder}/${filename}`;

    if (this.provider === 'local') {
      const oldFullPath = path.join(this.uploadDir, oldPath);
      const newFullPath = path.join(this.uploadDir, newPath);
      
      // Ensure new directory exists
      const newDir = path.dirname(newFullPath);
      if (!fs.existsSync(newDir)) {
        await mkdirAsync(newDir, { recursive: true });
      }
      
      fs.renameSync(oldFullPath, newFullPath);
    } else if (this.provider === 's3') {
      // Copy and delete for S3
      await this.s3.copyObject({
        Bucket: this.bucket,
        CopySource: `${this.bucket}/${oldPath}`,
        Key: newPath,
        ACL: 'public-read',
      }).promise();
      
      await this.s3.deleteObject({
        Bucket: this.bucket,
        Key: oldPath,
      }).promise();
    }

    return newPath;
  }

  /**
   * Get mime type from filename
   */
  getMimeType(filename) {
    return mime.lookup(filename) || 'application/octet-stream';
  }

  /**
   * Sanitize filename
   */
  sanitizeFilename(filename) {
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .toLowerCase();
  }
}

// Create singleton instance
const storageService = new StorageService();

export default storageService;