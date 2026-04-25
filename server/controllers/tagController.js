import { Tag, Gallery } from '../models/index.js';

export const getTags = async (req, res) => {
  try {
    const tags = await Tag.findAll();
    res.json({ tags });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTagBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const tag = await Tag.findBySlug(slug);

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGalleriesByTag = async (req, res) => {
  try {
    const { slug } = req.params;
    const { page, limit } = req.pagination;

    const result = await Tag.findGalleriesByTag(slug, page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
