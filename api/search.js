import { query } from '../lib/db';
import { successResponse, errorResponse } from '../lib/response';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  try {
    if (req.method !== 'GET') {
      return errorResponse(res, 'Method not allowed', 405);
    }

    const { q, page = 1, limit = 24 } = req.query;

    if (!q) {
      return errorResponse(res, 'Search query required', 400);
    }

    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT DISTINCT
        g.id, g.title, g.slug, g.description, g.photographer, 
        g.view_count, g.like_count, g.created_at,
        (SELECT json_agg(json_build_object('id', i.id, 'url', i.url, 'thumbnail_url', i.thumbnail_url, 'alt_text', i.alt_text))
         FROM images i WHERE i.gallery_id = g.id ORDER BY i."order" LIMIT 1) as images
      FROM galleries g
      LEFT JOIN gallery_tags gt ON g.id = gt.gallery_id
      LEFT JOIN tags t ON gt.tag_id = t.id
      WHERE (
        g.title ILIKE $1 OR 
        g.description ILIKE $1 OR 
        t.name ILIKE $1
      )
      ORDER BY g.view_count DESC, g.created_at DESC
      LIMIT $2 OFFSET $3`,
      [`%${q}%`, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(DISTINCT g.id) FROM galleries g
       LEFT JOIN gallery_tags gt ON g.id = gt.gallery_id
       LEFT JOIN tags t ON gt.tag_id = t.id
       WHERE (g.title ILIKE $1 OR g.description ILIKE $1 OR t.name ILIKE $1)`,
      [`%${q}%`]
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
    console.error('Search error:', error);
    return errorResponse(res, error.message, 500, error);
  }
}
