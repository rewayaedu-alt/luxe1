import { Gallery, Tag, Category } from '../models/index.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findBySlug(slug);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGalleriesByCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const { page, limit } = req.pagination;

    const result = await Gallery.findByCategory(slug, page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
