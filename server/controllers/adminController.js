import { Gallery, Category, Tag, Image, User } from '../models/index.js';

// Gallery Management
export const createGallery = async (req, res) => {
  try {
    const { title, slug, description, categoryId, photographer, tags } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ error: 'Title and slug are required' });
    }

    const gallery = await Gallery.create({
      title,
      slug,
      description,
      categoryId,
      photographer
    });

    // Add tags if provided
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        let tag = await Tag.findByName(tagName);
        if (!tag) {
          tag = await Tag.create({ name: tagName, slug: tagName.toLowerCase().replace(/\s+/g, '-') });
        }
        await Tag.addToGallery(gallery.id, tag.id);
      }
    }

    res.status(201).json({ success: true, gallery });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, categoryId, photographer, isFeatured } = req.body;

    const result = await Gallery.update(id, {
      title,
      description,
      categoryId,
      photographer,
      isFeatured
    });

    if (!result) {
      return res.status(404).json({ error: 'Gallery not found' });
    }

    res.json({ success: true, gallery: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    await Gallery.delete(id);
    res.json({ success: true, message: 'Gallery deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Category Management
export const createCategory = async (req, res) => {
  try {
    const { name, slug, description, icon } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required' });
    }

    const category = await Category.create({ name, slug, description, icon });
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon } = req.body;

    const result = await Category.update(id, { name, description, icon });

    if (!result) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ success: true, category: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.delete(id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tag Management
export const createTag = async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required' });
    }

    const tag = await Tag.create({ name, slug, description });
    res.status(201).json({ success: true, tag });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    await Tag.delete(id);
    res.json({ success: true, message: 'Tag deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Image Management
export const addImage = async (req, res) => {
  try {
    const { galleryId, url, thumbnailUrl, altText, order, width, height } = req.body;

    if (!galleryId || !url) {
      return res.status(400).json({ error: 'Gallery ID and image URL are required' });
    }

    const image = await Image.create({
      galleryId,
      url,
      thumbnailUrl,
      altText,
      order,
      width,
      height
    });

    res.status(201).json({ success: true, image });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    await Image.delete(id);
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User Management
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, password } = req.body;

    const user = await User.update(id, { username, email, role, password });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.delete(id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
