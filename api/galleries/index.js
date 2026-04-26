import { query } from '../lib/db';
import { successResponse, errorResponse, validateMethod, validateRequired } from '../lib/response';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  try {
    if (req.method === 'GET') {
      const { page = 1, limit = 24, sort = 'latest' } = req.query;
      const offset = (page - 1) * limit;
      const orderBy = sort === 'popular' ? 'view_count DESC' : 'created_at DESC';

      const result = await query(
        `SELECT 
          g.id, g.title, g.slug, g.description, g.photographer, 
          g.view_count, g.like_count, g.created_at, g.is_featured,
          c.id as category_id, c.name as category_name, c.slug as category_slug,
          (SELECT json_agg(json_build_object('id', i.id, 'url', i.url, 'thumbnail_url', i.thumbnail_url, 'alt_text', i.alt_text))
           FROM images i WHERE i.gallery_id = g.id ORDER BY i."order") as images,
          (SELECT json_agg(json_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
           FROM gallery_tags gt JOIN tags t ON gt.tag_id = t.id WHERE gt.gallery_id = g.id) as tags
        FROM galleries g
        LEFT JOIN categories c ON g.category_id = c.id
        ORDER BY ${orderBy}
        LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      const countResult = await query('SELECT COUNT(*) FROM galleries');
      const total = parseInt(countResult.rows[0].count);

      return successResponse(res, {
        galleries: result.rows,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: offset + parseInt(limit) < total
      });
    }

    if (req.method === 'POST') {
      // Protected endpoint - requires auth
      const { title, slug, description, categoryId, photographer } = req.body;
      const validation = validateRequired({ title, slug }, ['title', 'slug']);
      
      if (!validation.valid) {
        return errorResponse(res, `Missing required field: ${validation.missing}`, 400);
      }

      const result = await query(
        'INSERT INTO galleries (title, slug, description, category_id, photographer) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [title, slug, description, categoryId || null, photographer]
      );

      return successResponse(res, result.rows[0], 201);
    }

    return errorResponse(res, 'Method not allowed', 405);
  } catch (error) {
    console.error('Gallery error:', error);
    return errorResponse(res, error.message, 500, error);
  }
}
