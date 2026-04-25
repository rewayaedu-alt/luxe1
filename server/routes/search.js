import express from 'express';
import { validatePagination, validateSlug } from '../middleware/validation.js';
import {
  getTags,
  getTagBySlug,
  getGalleriesByTag
} from '../controllers/tagController.js';

const router = express.Router();

router.get('/', getTags);
router.get('/:slug', validateSlug, getTagBySlug);
router.get('/:slug/galleries', validateSlug, validatePagination, getGalleriesByTag);

export default router;
