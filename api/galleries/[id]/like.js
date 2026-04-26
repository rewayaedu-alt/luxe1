import { query } from '../../../lib/db';
import { successResponse, errorResponse } from '../../../lib/response';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  const { id } = req.query;

  try {
    if (req.method !== 'POST') {
      return errorResponse(res, 'Method not allowed', 405);
    }

    // Increment likes
    await query('UPDATE galleries SET like_count = like_count + 1 WHERE id = $1', [id]);

    // Return updated gallery
    const result = await query(
      'SELECT id, title, slug, like_count, view_count FROM galleries WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Gallery not found', 404);
    }

    return successResponse(res, result.rows[0]);
  } catch (error) {
    console.error('Like gallery error:', error);
    return errorResponse(res, error.message, 500, error);
  }
}
