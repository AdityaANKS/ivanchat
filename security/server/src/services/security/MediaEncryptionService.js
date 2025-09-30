const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const stream = require('stream');
const util = require('util');
const pipeline = util.promisify(stream.pipeline);

class MediaEncryptionService {
  constructor(config) {
    this.config = config;
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32;
    this.ivLength = 16;
    this.tagLength = 16;
    this.saltLength = 64;
  }

  async encryptFile(inputPath, outputPath, password) {
    const salt = crypto.randomBytes(this.saltLength);
    const key = await this.deriveKey(password, salt);
    const iv = crypto.randomBytes(this.ivLength);
    
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    const input = fs.createReadStream(inputPath);
    const output = fs.createWriteStream(outputPath);

    // Write header: salt + iv
    output.write(salt);
    output.write(iv);

    await pipeline(input, cipher, output);
    
    const tag = cipher.getAuthTag();
    await fs.appendFile(outputPath, tag);

    return {
      encrypted: true,
      algorithm: this.algorithm,
      size: (await fs.stat(outputPath)).size
    };
  }

  async decryptFile(inputPath, outputPath, password) {
    const fileBuffer = await fs.readFile(inputPath);
    
    // Extract components
    const salt = fileBuffer.slice(0, this.saltLength);
    const iv = fileBuffer.slice(this.saltLength, this.saltLength + this.ivLength);
    const tag = fileBuffer.slice(-this.tagLength);
    const encrypted = fileBuffer.slice(
      this.saltLength + this.ivLength,
      -this.tagLength
    );

    const key = await this.deriveKey(password, salt);
    const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);

    await fs.writeFile(outputPath, decrypted);

    return {
      decrypted: true,
      size: decrypted.length
    };
  }

  encryptStream(password) {
    const salt = crypto.randomBytes(this.saltLength);
    const iv = crypto.randomBytes(this.ivLength);
    
    const transform = new stream.Transform({
      async transform(chunk, encoding, callback) {
        if (!this.cipher) {
          const key = await this.deriveKey(password, salt);
          this.cipher = crypto.createCipheriv(this.algorithm, key, iv);
          
          // Send header
          this.push(salt);
          this.push(iv);
        }
        
        const encrypted = this.cipher.update(chunk);
        callback(null, encrypted);
      },
      
      flush(callback) {
        if (this.cipher) {
          const final = this.cipher.final();
          const tag = this.cipher.getAuthTag();
          this.push(final);
          this.push(tag);
        }
        callback();
      }
    });

    return transform;
  }

  decryptStream(password) {
    let header = Buffer.alloc(0);
    let salt, iv, key, decipher;
    let initialized = false;

    const transform = new stream.Transform({
      async transform(chunk, encoding, callback) {
        let data = chunk;

        if (!initialized) {
          header = Buffer.concat([header, chunk]);
          
          if (header.length >= this.saltLength + this.ivLength) {
            salt = header.slice(0, this.saltLength);
            iv = header.slice(this.saltLength, this.saltLength + this.ivLength);
            key = await this.deriveKey(password, salt);
            decipher = crypto.createDecipheriv(this.algorithm, key, iv);
            
            data = header.slice(this.saltLength + this.ivLength);
            initialized = true;
          } else {
            return callback();
          }
        }

        if (decipher && data.length > 0) {
          const decrypted = decipher.update(data);
          callback(null, decrypted);
        } else {
          callback();
        }
      },

      flush(callback) {
        if (decipher) {
          try {
            const final = decipher.final();
            this.push(final);
          } catch (error) {
            return callback(error);
          }
        }
        callback();
      }
    });

    return transform;
  }

  async encryptBuffer(buffer, password) {
    const salt = crypto.randomBytes(this.saltLength);
    const key = await this.deriveKey(password, salt);
    const iv = crypto.randomBytes(this.ivLength);
    
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    
    const encrypted = Buffer.concat([
      salt,
      iv,
      cipher.update(buffer),
      cipher.final(),
      cipher.getAuthTag()
    ]);

    return encrypted;
  }

  async decryptBuffer(encryptedBuffer, password) {
    const salt = encryptedBuffer.slice(0, this.saltLength);
    const iv = encryptedBuffer.slice(this.saltLength, this.saltLength + this.ivLength);
    const tag = encryptedBuffer.slice(-this.tagLength);
    const encrypted = encryptedBuffer.slice(
      this.saltLength + this.ivLength,
      -this.tagLength
    );

    const key = await this.deriveKey(password, salt);
    const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);

    return decrypted;
  }

  async deriveKey(password, salt) {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 100000, this.keyLength, 'sha256', (err, key) => {
        if (err) reject(err);
        else resolve(key);
      });
    });
  }

  generateMediaKey() {
    return crypto.randomBytes(32).toString('base64');
  }

  async encryptThumbnail(imageBuffer, key) {
    return this.encryptBuffer(imageBuffer, key);
  }

  async decryptThumbnail(encryptedBuffer, key) {
    return this.decryptBuffer(encryptedBuffer, key);
  }

  calculateChecksum(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  async verifyIntegrity(filePath, expectedChecksum) {
    const buffer = await fs.readFile(filePath);
    const checksum = this.calculateChecksum(buffer);
    return checksum === expectedChecksum;
  }
}

module.exports = MediaEncryptionService;