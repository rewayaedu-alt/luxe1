import express from 'express';
import { validatePagination, validateSearch } from '../middleware/validation.js';
import { searchGalleries } from '../controllers/searchController.js';

const router = express.Router();

router.get('/', validateSearch, validatePagination, searchGalleries);

export default router;
