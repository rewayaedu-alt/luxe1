import { query } from '../lib/db';
import { successResponse, errorResponse } from '../lib/response';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  try {
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM tags ORDER BY name ASC');
      return successResponse(res, { tags: result.rows });
    }

    return errorResponse(res, 'Method not allowed', 405);
  } catch (error) {
    console.error('Tags error:', error);
    return errorResponse(res, error.message, 500, error);
  }
}
