import { Gallery, Tag, Image } from '../models/index.js';
import pool from '../db/connection.js';
import slugify from 'slug';

export async function createGallery(req, res) {
  const { title, slug, description, categoryId, photographer, images = [], tags = [] } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });
  const finalSlug = slug || slugify(title, { lower: true });

  // Create gallery
  const created = await Gallery.create({ title, slug: finalSlug, description, categoryId, photographer });
  const galleryId = created.id;

  // Create tags and link
  for (const t of tags) {
    const name = typeof t === 'string' ? t : t.name;
    const tagSlug = slugify(name, { lower: true });
    const tagRow = await Tag.create(name, tagSlug);
    await pool.query('INSERT INTO gallery_tags (gallery_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [galleryId, tagRow.id]);
  }

  // Create images
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    await Image.create(galleryId, {
      url: img.url,
      thumbnailUrl: img.thumbnailUrl || img.url,
      altText: img.altText || '',
      order: img.order ?? i,
      width: img.width || null,
      height: img.height || null,
    });
  }

  const full = await Gallery.findById(galleryId);
  res.status(201).json({ gallery: full });
}

export async function updateGallery(req, res) {
  const { id } = req.params;
  const data = req.body;
  const updated = await Gallery.update(id, data);
  if (!updated) return res.status(404).json({ message: 'Gallery not found' });
  res.json({ gallery: updated });
}

export async function deleteGallery(req, res) {
  const { id } = req.params;
  await Gallery.delete(id);
  res.status(204).send();
}
