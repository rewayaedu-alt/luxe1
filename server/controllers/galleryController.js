import { Gallery, Tag, Category, Image } from '../models/index.js';

export const getGalleries = async (req, res) => {
  try {
    const { page, limit } = req.pagination;
    const { sort } = req.query;

    const result = await Gallery.findAll(page, limit, sort);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }

    // Increment view count
    await Gallery.incrementViews(id);

    res.json(gallery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGalleryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const gallery = await Gallery.findBySlug(slug);

    if (!gallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }

    // Increment view count
    await Gallery.incrementViews(gallery.id);

    res.json(gallery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRelatedGalleries = async (req, res) => {
  try {
    const { id } = req.params;
    const related = await Gallery.findRelated(id, 6);
    res.json({ galleries: related });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const likeGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }

    await Gallery.incrementLikes(id);
    const updated = await Gallery.findById(id);

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
