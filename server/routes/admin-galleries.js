import express from 'express';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';
import { createGallery, updateGallery, deleteGallery } from '../controllers/adminGalleryController.js';

const router = express.Router();

router.post('/', authenticateToken, requireRole('editor'), createGallery);
router.put('/:id', authenticateToken, requireRole('editor'), updateGallery);
router.delete('/:id', authenticateToken, requireRole('editor'), deleteGallery);

export default router;
