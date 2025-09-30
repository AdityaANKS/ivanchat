// server/src/routes/chunkUploadRoutes.js
import express from 'express';
import multer from 'multer';
import { startUpload, uploadChunk, completeUpload } from '../controllers/chunkUploadController.js';
import { getUploadStatus } from '../controllers/chunkUploadController.js';
router.get('/status/:uploadId', getUploadStatus);

const router = express.Router();
const upload = multer({ dest: 'uploads/tmp' });

router.post('/start', startUpload);
router.post('/chunk', upload.single('chunk'), uploadChunk);
router.post('/complete', completeUpload);

export default router;
