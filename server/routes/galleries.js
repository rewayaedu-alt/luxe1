import express from 'express';
import { validatePagination } from '../middleware/validation.js';
import {
  getGalleries,
  getGalleryById,
  getGalleryBySlug,
  getRelatedGalleries,
  likeGallery
} from '../controllers/galleryController.js';

const router = express.Router();

router.get('/', validatePagination, getGalleries);
router.get('/:id/related', getRelatedGalleries);
router.get('/:id/like', likeGallery);
router.get('/:id', getGalleryById);
router.get('/slug/:slug', getGalleryBySlug);

export default router;
