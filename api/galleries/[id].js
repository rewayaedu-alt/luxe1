import { query } from '../../lib/db';
import { successResponse, errorResponse } from '../../lib/response';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const result = await query(
        `SELECT 
          g.id, g.title, g.slug, g.description, g.photographer, 
          g.view_count, g.like_count, g.created_at,
          c.id as category_id, c.name as category_name, c.slug as category_slug,
          (SELECT json_agg(json_build_object('id', i.id, 'url', i.url, 'thumbnail_url', i.thumbnail_url, 'alt_text', i.alt_text, 'width', i.width, 'height', i.height))
           FROM images i WHERE i.gallery_id = g.id ORDER BY i."order") as images,
          (SELECT json_agg(json_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
           FROM gallery_tags gt JOIN tags t ON gt.tag_id = t.id WHERE gt.gallery_id = g.id) as tags
        FROM galleries g
        LEFT JOIN categories c ON g.category_id = c.id
        WHERE g.id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return errorResponse(res, 'Gallery not found', 404);
      }

      // Increment view count
      await query('UPDATE galleries SET view_count = view_count + 1 WHERE id = $1', [id]);

      return successResponse(res, result.rows[0]);
    }

    if (req.method === 'PUT') {
      const { title, description, categoryId, photographer, isFeatured } = req.body;

      const result = await query(
        'UPDATE galleries SET title = $1, description = $2, category_id = $3, photographer = $4, is_featured = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
        [title, description, categoryId, photographer, isFeatured || false, id]
      );

      if (result.rows.length === 0) {
        return errorResponse(res, 'Gallery not found', 404);
      }

      return successResponse(res, result.rows[0]);
    }

    if (req.method === 'DELETE') {
      await query('DELETE FROM galleries WHERE id = $1', [id]);
      return successResponse(res, { message: 'Gallery deleted' });
    }

    return errorResponse(res, 'Method not allowed', 405);
  } catch (error) {
    console.error('Gallery detail error:', error);
    return errorResponse(res, error.message, 500, error);
  }
}
