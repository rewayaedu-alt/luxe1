import { Gallery } from '../models/index.js';

export async function createGallery(req, res) {
  const { title, slug, description, categoryId, photographer } = req.body;
  if (!title || !slug) return res.status(400).json({ message: 'Title and slug are required' });
  const created = await Gallery.create({ title, slug, description, categoryId, photographer });
  res.status(201).json({ id: created.id });
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
