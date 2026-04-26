import { query } from '../../../../lib/db';
import { successResponse, errorResponse } from '../../../../lib/response';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  const { slug } = req.query;

  try {
    if (req.method === 'DELETE') {
      const result = await query(
        'DELETE FROM tags WHERE slug = $1 RETURNING id',
        [slug]
      );

      if (result.rows.length === 0) {
        return errorResponse(res, 'Tag not found', 404);
      }

      return successResponse(res, { message: 'Tag deleted' });
    }

    return errorResponse(res, 'Method not allowed', 405);
  } catch (error) {
    console.error('Admin tag detail error:', error);
    return errorResponse(res, error.message, 500, error);
  }
}
