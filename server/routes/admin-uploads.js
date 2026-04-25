import express from 'express';
import upload from '../middleware/upload.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';
import { uploadFile } from '../controllers/adminUploadController.js';

const router = express.Router();

// Protected upload endpoint (editor+)
router.post('/', authenticateToken, requireRole('editor'), upload.single('file'), uploadFile);

export default router;
