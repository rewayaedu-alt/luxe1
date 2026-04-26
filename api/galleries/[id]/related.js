import { query } from '../../../lib/db';
import { successResponse, errorResponse } from '../../../lib/response';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  const { id } = req.query;

  try {
    if (req.method !== 'GET') {
      return errorResponse(res, 'Method not allowed', 405);
    }

    const result = await query(
      `SELECT 
        g.id, g.title, g.slug, g.description, g.photographer, 
        g.view_count, g.like_count, g.created_at,
        (SELECT json_agg(json_build_object('id', i.id, 'url', i.url, 'thumbnail_url', i.thumbnail_url, 'alt_text', i.alt_text))
         FROM images i WHERE i.gallery_id = g.id ORDER BY i."order" LIMIT 1) as images,
        COUNT(gt2.tag_id) as shared_tags
      FROM galleries g
      LEFT JOIN gallery_tags gt2 ON g.id = gt2.gallery_id
      WHERE g.id IN (
        SELECT DISTINCT g2.id FROM galleries g2
        INNER JOIN gallery_tags gt1 ON g2.id = gt1.gallery_id
        WHERE gt1.tag_id IN (
          SELECT tag_id FROM gallery_tags WHERE gallery_id = $1
        ) AND g2.id != $1
      )
      GROUP BY g.id
      ORDER BY shared_tags DESC, g.view_count DESC
      LIMIT 6`,
      [id]
    );

    return successResponse(res, { galleries: result.rows });
  } catch (error) {
    console.error('Related galleries error:', error);
    return errorResponse(res, error.message, 500, error);
  }
}
