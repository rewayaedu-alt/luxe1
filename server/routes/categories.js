import express from 'express';
import { validatePagination, validateSlug } from '../middleware/validation.js';
import {
  getCategories,
  getCategoryBySlug,
  getGalleriesByCategory
} from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/:slug', validateSlug, getCategoryBySlug);
router.get('/:slug/galleries', validateSlug, validatePagination, getGalleriesByCategory);

export default router;
