// server/src/controllers/chunkUploadController.js
import chunkUploadService from '../services/chunkUploadService.js';

export const startUpload = async (req, res) => {
  try {
    const { fileName, totalChunks } = req.body;
    const uploadId = await chunkUploadService.initUpload(fileName, totalChunks);
    res.json({ uploadId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const uploadChunk = async (req, res) => {
  try {
    const { uploadId, chunkIndex } = req.body;
    const chunkFile = req.file;
    await chunkUploadService.saveChunk(uploadId, chunkIndex, chunkFile);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const completeUpload = async (req, res) => {
  try {
    const { uploadId } = req.body;
    const finalPath = await chunkUploadService.combineChunks(uploadId);
    res.json({ success: true, filePath: finalPath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getUploadStatus = async (req, res) => {
  try {
    const { uploadId } = req.params;
    const session = await UploadSession.findOne({ where: { uploadId } });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    res.json({
      uploadId: session.uploadId,
      receivedChunks: session.receivedChunks,
      totalChunks: session.totalChunks,
      status: session.status,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
