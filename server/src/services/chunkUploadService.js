// server/src/services/chunkUploadService.js
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import UploadSession from '../models/UploadSession.js';

const tempDir = path.join(process.cwd(), 'uploads', 'tmp');
const finalDir = path.join(process.cwd(), 'uploads', 'final');

if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
if (!fs.existsSync(finalDir)) fs.mkdirSync(finalDir, { recursive: true });

async function initUpload(fileName, totalChunks) {
  const uploadId = uuidv4();
  await UploadSession.create({
    uploadId,
    fileName,
    totalChunks,
  });
  return uploadId;
}

async function saveChunk(uploadId, chunkIndex, chunkFile) {
  const session = await UploadSession.findOne({ where: { uploadId } });
  if (!session) throw new Error('Upload session not found');

  const chunkPath = path.join(tempDir, `${uploadId}_${chunkIndex}`);
  await fs.promises.rename(chunkFile.path, chunkPath);

  session.receivedChunks += 1;
  await session.save();
}

async function combineChunks(uploadId) {
  const session = await UploadSession.findOne({ where: { uploadId } });
  if (!session) throw new Error('Upload session not found');

  const finalFilePath = path.join(finalDir, session.fileName);
  const writeStream = fs.createWriteStream(finalFilePath);

  for (let i = 0; i < session.totalChunks; i++) {
    const chunkPath = path.join(tempDir, `${uploadId}_${i}`);
    const data = await fs.promises.readFile(chunkPath);
    writeStream.write(data);
    await fs.promises.unlink(chunkPath);
  }
  writeStream.end();

  session.status = 'completed';
  session.finalPath = finalFilePath;
  await session.save();

  return finalFilePath;
}

export default {
  initUpload,
  saveChunk,
  combineChunks,
};
