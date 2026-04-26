import { query } from '../../../../lib/db';
import { successResponse, errorResponse } from '../../../../lib/response';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  const { slug } = req.query;
  const { page = 1, limit = 24 } = req.query;
  const offset = (page - 1) * limit;

  try {
    if (req.method !== 'GET') {
      return errorResponse(res, 'Method not allowed', 405);
    }

    const result = await query(
      `SELECT 
        g.id, g.title, g.slug, g.description, g.photographer, 
        g.view_count, g.like_count, g.created_at,
        c.id as category_id, c.name as category_name, c.slug as category_slug,
        (SELECT json_agg(json_build_object('id', i.id, 'url', i.url, 'thumbnail_url', i.thumbnail_url, 'alt_text', i.alt_text))
         FROM images i WHERE i.gallery_id = g.id ORDER BY i."order") as images,
        (SELECT json_agg(json_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
         FROM gallery_tags gt JOIN tags t ON gt.tag_id = t.id WHERE gt.gallery_id = g.id) as tags
      FROM galleries g
      LEFT JOIN categories c ON g.category_id = c.id
      WHERE c.slug = $1
      ORDER BY g.created_at DESC
      LIMIT $2 OFFSET $3`,
      [slug, limit, offset]
    );

    const countResult = await query(
      'SELECT COUNT(*) FROM galleries g LEFT JOIN categories c ON g.category_id = c.id WHERE c.slug = $1',
      [slug]
    );

    const total = parseInt(countResult.rows[0].count);

    return successResponse(res, {
      galleries: result.rows,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      hasMore: offset + parseInt(limit) < total
    });
  } catch (error) {
    console.error('Category galleries error:', error);
    return errorResponse(res, error.message, 500, error);
  }
}
