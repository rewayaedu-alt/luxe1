import { query } from '../../../lib/db';
import { successResponse, errorResponse, validateRequired } from '../../../lib/response';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  try {
    if (req.method === 'POST') {
      const { galleryId, url, thumbnailUrl, altText, order, width, height } = req.body;
      const validation = validateRequired({ galleryId, url }, ['galleryId', 'url']);
      
      if (!validation.valid) {
        return errorResponse(res, `Missing required field: ${validation.missing}`, 400);
      }

      const result = await query(
        'INSERT INTO images (gallery_id, url, thumbnail_url, alt_text, "order", width, height) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [galleryId, url, thumbnailUrl || url, altText, order || 0, width, height]
      );

      return successResponse(res, result.rows[0], 201);
    }

    return errorResponse(res, 'Method not allowed', 405);
  } catch (error) {
    console.error('Admin images error:', error);
    return errorResponse(res, error.message, 500, error);
  }
}
