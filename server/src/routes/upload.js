const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

// Middleware
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { rateLimiter } = require('../middleware/rateLimiter');
const { validateUpload } = require('../middleware/uploadValidator');

// Services
const S3Service = require('../services/storage/S3Service');
const FileService = require('../services/FileService');
const ImageProcessor = require('../services/ImageProcessor');
const VideoProcessor = require('../services/VideoProcessor');
const VirusScanService = require('../services/security/VirusScanService');
const ContentModerationService = require('../services/moderation/ContentModerationService');

// Models
const Upload = require('../models/Upload');
const User = require('../models/User');
const Message = require('../models/Message');
const Server = require('../models/Server');

// Utils
const { logger } = require('../utils/logger');
const { AppError } = require('../utils/errors');

// Configuration
const MAX_FILE_SIZE = {
  free: 8 * 1024 * 1024,        // 8MB for free users
  monthly: 100 * 1024 * 1024,   // 100MB for monthly
  yearly: 500 * 1024 * 1024,    // 500MB for yearly
  lifetime: 1024 * 1024 * 1024   // 1GB for lifetime
};

const ALLOWED_MIME_TYPES = {
  image: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp'
  ],
  video: [
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
    'video/webm'
  ],
  audio: [
    'audio/mpeg',
    'audio/wav',
    'audio/webm',
    'audio/ogg',
    'audio/opus'
  ],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/markdown',
    'application/json',
    'application/zip',
    'application/x-rar-compressed'
  ]
};

// Configure multer storage
const storage = multer.memoryStorage();

// Configure multer
const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE.lifetime, // Max possible size
    files: 10 // Max 10 files at once
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = Object.values(ALLOWED_MIME_TYPES).flat();
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new AppError('Invalid file type', 400));
    }
    
    // Check file extension
    const ext = path.extname(file.originalname).toLowerCase();
    const dangerousExtensions = ['.exe', '.bat', '.sh', '.cmd', '.com', '.scr'];
    if (dangerousExtensions.includes(ext)) {
      return cb(new AppError('Dangerous file type not allowed', 400));
    }
    
    cb(null, true);
  }
});

// Initialize services
const s3Service = new S3Service();
const fileService = new FileService();
const imageProcessor = new ImageProcessor();
const videoProcessor = new VideoProcessor();
const virusScanService = new VirusScanService();
const contentModerationService = new ContentModerationService();

/**
 * @route   POST /api/upload/avatar
 * @desc    Upload user avatar
 * @access  Private
 */
router.post('/avatar',
  authenticate,
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 5 }), // 5 uploads per 15 minutes
  upload.single('avatar'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const userId = req.user.id;
      const file = req.file;

      // Validate image file
      if (!ALLOWED_MIME_TYPES.image.includes(file.mimetype)) {
        return res.status(400).json({ error: 'Only image files allowed for avatar' });
      }

      // Process image (resize, optimize)
      const processedImages = await imageProcessor.processAvatar(file.buffer, {
        sizes: [
          { width: 32, height: 32, suffix: 'small' },
          { width: 128, height: 128, suffix: 'medium' },
          { width: 256, height: 256, suffix: 'large' }
        ],
        format: 'webp',
        quality: 85
      });

      // Upload to S3
      const uploadPromises = processedImages.map(async (img) => {
        const key = `avatars/${userId}/${uuidv4()}_${img.suffix}.webp`;
        return s3Service.uploadFile({
          Key: key,
          Body: img.buffer,
          ContentType: 'image/webp',
          Metadata: {
            userId,
            type: 'avatar',
            size: img.suffix
          }
        });
      });

      const uploadedFiles = await Promise.all(uploadPromises);

      // Update user profile
      const user = await User.findByIdAndUpdate(
        userId,
        {
          avatar: {
            small: uploadedFiles[0].url,
            medium: uploadedFiles[1].url,
            large: uploadedFiles[2].url,
            updatedAt: new Date()
          }
        },
        { new: true }
      );

      // Create upload record
      await Upload.create({
        userId,
        type: 'avatar',
        files: uploadedFiles.map(f => ({
          url: f.url,
          key: f.key,
          size: f.size,
          mimetype: 'image/webp'
        })),
        metadata: {
          originalName: file.originalname,
          processedSizes: ['small', 'medium', 'large']
        }
      });

      logger.info('Avatar uploaded successfully', { userId });

      res.json({
        success: true,
        avatar: user.avatar,
        message: 'Avatar uploaded successfully'
      });
    } catch (error) {
      logger.error('Avatar upload error:', error);
      res.status(500).json({ error: 'Failed to upload avatar' });
    }
  }
);

/**
 * @route   POST /api/upload/message
 * @desc    Upload message attachments
 * @access  Private
 */
router.post('/message',
  authenticate,
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 10 }), // 10 uploads per minute
  upload.array('attachments', 5), // Max 5 files
  validateUpload,
  async (req, res) => {
    try {
      const { channelId, messageId, serverId } = req.body;
      const userId = req.user.id;
      const files = req.files;

      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      // Check user's upload limit based on membership
      const user = await User.findById(userId);
      const maxSize = MAX_FILE_SIZE[user.membership?.planId || 'free'];

      // Process and upload files
      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          // Check file size against user's limit
          if (file.size > maxSize) {
            throw new AppError(`File ${file.originalname} exceeds size limit`, 400);
          }

          // Scan for viruses
          const isSafe = await virusScanService.scanBuffer(file.buffer);
          if (!isSafe) {
            throw new AppError(`File ${file.originalname} failed security scan`, 400);
          }

          // Determine file type
          const fileType = Object.keys(ALLOWED_MIME_TYPES).find(type =>
            ALLOWED_MIME_TYPES[type].includes(file.mimetype)
          );

          let processedFile = file;
          let thumbnailUrl = null;

          // Process based on file type
          if (fileType === 'image') {
            // Moderate image content
            const isAppropriate = await contentModerationService.moderateImage(file.buffer);
            if (!isAppropriate) {
              throw new AppError('Image contains inappropriate content', 400);
            }

            // Optimize image
            processedFile = await imageProcessor.optimizeImage(file.buffer, {
              maxWidth: 1920,
              maxHeight: 1080,
              quality: 85
            });

            // Generate thumbnail
            const thumbnail = await imageProcessor.generateThumbnail(file.buffer, {
              width: 150,
              height: 150
            });

            const thumbKey = `thumbnails/${channelId}/${uuidv4()}_thumb.webp`;
            const thumbUpload = await s3Service.uploadFile({
              Key: thumbKey,
              Body: thumbnail,
              ContentType: 'image/webp'
            });
            thumbnailUrl = thumbUpload.url;
          } else if (fileType === 'video') {
            // Generate video thumbnail
            const videoThumb = await videoProcessor.generateThumbnail(file.buffer);
            const thumbKey = `thumbnails/${channelId}/${uuidv4()}_video_thumb.jpg`;
            const thumbUpload = await s3Service.uploadFile({
              Key: thumbKey,
              Body: videoThumb,
              ContentType: 'image/jpeg'
            });
            thumbnailUrl = thumbUpload.url;
          }

          // Upload main file
          const fileKey = `attachments/${channelId}/${uuidv4()}_${file.originalname}`;
          const uploadResult = await s3Service.uploadFile({
            Key: fileKey,
            Body: processedFile.buffer || processedFile,
            ContentType: file.mimetype,
            Metadata: {
              userId,
              channelId,
              messageId: messageId || '',
              originalName: file.originalname
            }
          });

          return {
            url: uploadResult.url,
            thumbnailUrl,
            key: uploadResult.key,
            filename: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            type: fileType
          };
        })
      );

      // Create upload record
      const uploadRecord = await Upload.create({
        userId,
        channelId,
        messageId,
        serverId,
        type: 'message_attachment',
        files: uploadedFiles,
        metadata: {
          uploadedAt: new Date(),
          ipAddress: req.ip
        }
      });

      // Update message if messageId provided
      if (messageId) {
        await Message.findByIdAndUpdate(
          messageId,
          {
            $push: { attachments: { $each: uploadedFiles } }
          }
        );
      }

      logger.info('Message attachments uploaded', {
        userId,
        channelId,
        fileCount: uploadedFiles.length
      });

      res.json({
        success: true,
        files: uploadedFiles,
        uploadId: uploadRecord._id
      });
    } catch (error) {
      logger.error('Message attachment upload error:', error);
      res.status(error.statusCode || 500).json({
        error: error.message || 'Failed to upload attachments'
      });
    }
  }
);

/**
 * @route   POST /api/upload/voice
 * @desc    Upload voice message
 * @access  Private
 */
router.post('/voice',
  authenticate,
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 20 }),
  upload.single('voice'),
  async (req, res) => {
    try {
      const { channelId, duration } = req.body;
      const userId = req.user.id;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'No voice file uploaded' });
      }

      // Validate audio file
      if (!ALLOWED_MIME_TYPES.audio.includes(file.mimetype)) {
        return res.status(400).json({ error: 'Invalid audio format' });
      }

      // Process audio (compress, normalize)
      const processedAudio = await fileService.processAudio(file.buffer, {
        format: 'opus',
        bitrate: '32k',
        normalize: true
      });

      // Generate waveform data
      const waveform = await fileService.generateWaveform(file.buffer);

      // Upload to S3
      const fileKey = `voice/${channelId}/${uuidv4()}.opus`;
      const uploadResult = await s3Service.uploadFile({
        Key: fileKey,
        Body: processedAudio,
        ContentType: 'audio/opus',
        Metadata: {
          userId,
          channelId,
          duration: duration || '0',
          originalFormat: file.mimetype
        }
      });

      // Create voice message record
      const voiceMessage = await Message.create({
        userId,
        channelId,
        type: 'voice',
        content: '',
        voiceMessage: {
          url: uploadResult.url,
          duration: parseInt(duration) || 0,
          waveform,
          size: processedAudio.length
        }
      });

      logger.info('Voice message uploaded', {
        userId,
        channelId,
        messageId: voiceMessage._id
      });

      res.json({
        success: true,
        message: voiceMessage,
        upload: {
          url: uploadResult.url,
          duration: parseInt(duration) || 0,
          waveform
        }
      });
    } catch (error) {
      logger.error('Voice upload error:', error);
      res.status(500).json({ error: 'Failed to upload voice message' });
    }
  }
);

/**
 * @route   POST /api/upload/server-icon
 * @desc    Upload server icon
 * @access  Private (Server Admin)
 */
router.post('/server-icon',
  authenticate,
  upload.single('icon'),
  async (req, res) => {
    try {
      const { serverId } = req.body;
      const userId = req.user.id;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Check if user is server admin
      const server = await Server.findById(serverId);
      if (!server) {
        return res.status(404).json({ error: 'Server not found' });
      }

      if (server.ownerId.toString() !== userId && 
          !server.admins.includes(userId)) {
        return res.status(403).json({ error: 'Not authorized to update server icon' });
      }

      // Process icon
      const processedIcon = await imageProcessor.processServerIcon(file.buffer, {
        sizes: [
          { width: 64, height: 64, suffix: 'small' },
          { width: 128, height: 128, suffix: 'medium' },
          { width: 512, height: 512, suffix: 'large' }
        ],
        format: 'webp'
      });

      // Upload to S3
      const uploadPromises = processedIcon.map(async (img) => {
        const key = `servers/${serverId}/icon_${img.suffix}.webp`;
        return s3Service.uploadFile({
          Key: key,
          Body: img.buffer,
          ContentType: 'image/webp'
        });
      });

      const uploadedFiles = await Promise.all(uploadPromises);

      // Update server
      server.icon = {
        small: uploadedFiles[0].url,
        medium: uploadedFiles[1].url,
        large: uploadedFiles[2].url
      };
      await server.save();

      logger.info('Server icon uploaded', { serverId, userId });

      res.json({
        success: true,
        icon: server.icon
      });
    } catch (error) {
      logger.error('Server icon upload error:', error);
      res.status(500).json({ error: 'Failed to upload server icon' });
    }
  }
);

/**
 * @route   POST /api/upload/emoji
 * @desc    Upload custom emoji
 * @access  Private (Premium users)
 */
router.post('/emoji',
  authenticate,
  authorize(['premium', 'admin']),
  upload.single('emoji'),
  async (req, res) => {
    try {
      const { serverId, name } = req.body;
      const userId = req.user.id;
      const file = req.file;

      if (!file || !name) {
        return res.status(400).json({ error: 'Emoji file and name required' });
      }

      // Validate emoji name
      if (!/^[a-zA-Z0-9_]+$/.test(name)) {
        return res.status(400).json({ error: 'Invalid emoji name' });
      }

      // Process emoji (resize to standard size)
      const processedEmoji = await imageProcessor.processEmoji(file.buffer, {
        width: 128,
        height: 128,
        animated: file.mimetype === 'image/gif'
      });

      // Upload to S3
      const emojiKey = `emojis/${serverId}/${name}.${processedEmoji.format}`;
      const uploadResult = await s3Service.uploadFile({
        Key: emojiKey,
        Body: processedEmoji.buffer,
        ContentType: `image/${processedEmoji.format}`
      });

      // Add emoji to server
      await Server.findByIdAndUpdate(
        serverId,
        {
          $push: {
            customEmojis: {
              name,
              url: uploadResult.url,
              animated: processedEmoji.animated,
              createdBy: userId,
              createdAt: new Date()
            }
          }
        }
      );

      logger.info('Custom emoji uploaded', { serverId, emojiName: name });

      res.json({
        success: true,
        emoji: {
          name,
          url: uploadResult.url,
          animated: processedEmoji.animated
        }
      });
    } catch (error) {
      logger.error('Emoji upload error:', error);
      res.status(500).json({ error: 'Failed to upload emoji' });
    }
  }
);

/**
 * @route   POST /api/upload/chunk
 * @desc    Handle chunked file upload
 * @access  Private
 */
router.post('/chunk',
  authenticate,
  upload.single('chunk'),
  async (req, res) => {
    try {
      const {
        uploadId,
        chunkIndex,
        totalChunks,
        filename,
        fileType,
        totalSize
      } = req.body;

      const userId = req.user.id;
      const chunk = req.file;

      if (!chunk) {
        return res.status(400).json({ error: 'No chunk uploaded' });
      }

      // Store chunk temporarily
      const chunkPath = path.join(
        process.env.TEMP_DIR || '/tmp',
        `${uploadId}_${chunkIndex}`
      );

      await fs.writeFile(chunkPath, chunk.buffer);

      // Check if all chunks received
      if (parseInt(chunkIndex) === parseInt(totalChunks) - 1) {
        // Combine chunks
        const chunks = [];
        for (let i = 0; i < totalChunks; i++) {
          const chunkFile = path.join(
            process.env.TEMP_DIR || '/tmp',
            `${uploadId}_${i}`
          );
          const chunkData = await fs.readFile(chunkFile);
          chunks.push(chunkData);
          await fs.unlink(chunkFile); // Clean up chunk
        }

        const completeFile = Buffer.concat(chunks);

        // Verify file size
        if (completeFile.length !== parseInt(totalSize)) {
          throw new AppError('File size mismatch', 400);
        }

        // Process complete file
        const fileKey = `uploads/${userId}/${uuidv4()}_${filename}`;
        const uploadResult = await s3Service.uploadFile({
          Key: fileKey,
          Body: completeFile,
          ContentType: fileType
        });

        // Create upload record
        await Upload.create({
          userId,
          type: 'chunked',
          files: [{
            url: uploadResult.url,
            key: uploadResult.key,
            filename,
            size: completeFile.length,
            mimetype: fileType
          }]
        });

        res.json({
          success: true,
          complete: true,
          file: {
            url: uploadResult.url,
            filename,
            size: completeFile.length
          }
        });
      } else {
        // Acknowledge chunk received
        res.json({
          success: true,
          complete: false,
          chunkIndex,
          message: `Chunk ${parseInt(chunkIndex) + 1}/${totalChunks} received`
        });
      }
    } catch (error) {
      logger.error('Chunked upload error:', error);
      res.status(500).json({ error: 'Failed to process chunk' });
    }
  }
);

/**
 * @route   GET /api/upload/progress/:uploadId
 * @desc    Get upload progress
 * @access  Private
 */
router.get('/progress/:uploadId',
  authenticate,
  async (req, res) => {
    try {
      const { uploadId } = req.params;
      const userId = req.user.id;

      // Get upload progress from Redis
      const progress = await req.app.get('redis').get(`upload:${uploadId}:progress`);

      if (!progress) {
        return res.status(404).json({ error: 'Upload not found' });
      }

      const progressData = JSON.parse(progress);

      // Verify user owns this upload
      if (progressData.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      res.json({
        uploadId,
        progress: progressData.progress,
        status: progressData.status,
        bytesUploaded: progressData.bytesUploaded,
        totalBytes: progressData.totalBytes
      });
    } catch (error) {
      logger.error('Get upload progress error:', error);
      res.status(500).json({ error: 'Failed to get upload progress' });
    }
  }
);

/**
 * @route   DELETE /api/upload/:uploadId
 * @desc    Delete uploaded file
 * @access  Private
 */
router.delete('/:uploadId',
  authenticate,
  async (req, res) => {
    try {
      const { uploadId } = req.params;
      const userId = req.user.id;

      // Find upload record
      const upload = await Upload.findById(uploadId);

      if (!upload) {
        return res.status(404).json({ error: 'Upload not found' });
      }

      // Check ownership
      if (upload.userId.toString() !== userId) {
        return res.status(403).json({ error: 'Not authorized to delete this file' });
      }

      // Delete files from S3
      const deletePromises = upload.files.map(file =>
        s3Service.deleteFile(file.key)
      );

      await Promise.all(deletePromises);

      // Delete upload record
      await upload.remove();

      logger.info('Upload deleted', { uploadId, userId });

      res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } catch (error) {
      logger.error('Delete upload error:', error);
      res.status(500).json({ error: 'Failed to delete file' });
    }
  }
);

/**
 * @route   GET /api/upload/signed-url
 * @desc    Get pre-signed upload URL for direct S3 upload
 * @access  Private
 */
router.get('/signed-url',
  authenticate,
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 10 }),
  async (req, res) => {
    try {
      const { filename, fileType, fileSize } = req.query;
      const userId = req.user.id;

      if (!filename || !fileType) {
        return res.status(400).json({ error: 'Filename and file type required' });
      }

      // Check user's upload limit
      const user = await User.findById(userId);
      const maxSize = MAX_FILE_SIZE[user.membership?.planId || 'free'];

      if (parseInt(fileSize) > maxSize) {
        return res.status(400).json({
          error: `File size exceeds limit of ${maxSize / (1024 * 1024)}MB`
        });
      }

      // Generate pre-signed URL
      const key = `direct-uploads/${userId}/${uuidv4()}_${filename}`;
      const signedUrl = await s3Service.getSignedUploadUrl({
        Key: key,
        ContentType: fileType,
        Expires: 3600, // 1 hour
        Metadata: {
          userId,
          originalName: filename
        }
      });

      // Store upload intent in Redis
      await req.app.get('redis').setex(
        `upload:intent:${key}`,
        3600,
        JSON.stringify({
          userId,
          filename,
          fileType,
          fileSize,
          createdAt: new Date()
        })
      );

      res.json({
        success: true,
        uploadUrl: signedUrl,
        key,
        expires: new Date(Date.now() + 3600 * 1000)
      });
    } catch (error) {
      logger.error('Signed URL generation error:', error);
      res.status(500).json({ error: 'Failed to generate upload URL' });
    }
  }
);

/**
 * @route   POST /api/upload/confirm
 * @desc    Confirm direct S3 upload completion
 * @access  Private
 */
router.post('/confirm',
  authenticate,
  async (req, res) => {
    try {
      const { key } = req.body;
      const userId = req.user.id;

      // Verify upload intent
      const intentKey = `upload:intent:${key}`;
      const intent = await req.app.get('redis').get(intentKey);

      if (!intent) {
        return res.status(400).json({ error: 'Upload intent not found or expired' });
      }

      const intentData = JSON.parse(intent);

      if (intentData.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      // Verify file exists in S3
      const fileExists = await s3Service.fileExists(key);

      if (!fileExists) {
        return res.status(400).json({ error: 'File not found in storage' });
      }

      // Get file metadata
      const metadata = await s3Service.getFileMetadata(key);

      // Create upload record
      const upload = await Upload.create({
        userId,
        type: 'direct',
        files: [{
          key,
          url: s3Service.getFileUrl(key),
          filename: intentData.filename,
          size: metadata.ContentLength,
          mimetype: intentData.fileType
        }],
        metadata: {
          uploadMethod: 'direct-s3'
        }
      });

      // Clean up Redis
      await req.app.get('redis').del(intentKey);

      logger.info('Direct upload confirmed', { userId, key });

      res.json({
        success: true,
        upload: {
          id: upload._id,
          url: s3Service.getFileUrl(key),
          filename: intentData.filename
        }
      });
    } catch (error) {
      logger.error('Upload confirmation error:', error);
      res.status(500).json({ error: 'Failed to confirm upload' });
    }
  }
);

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({
        error: 'File too large',
        maxSize: `${MAX_FILE_SIZE.lifetime / (1024 * 1024)}MB`
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too many files',
        maxFiles: 10
      });
    }
    return res.status(400).json({ error: error.message });
  }
  next(error);
});

module.exports = router;