import { query } from '../../../lib/db';
import { successResponse, errorResponse } from '../../../lib/response';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  try {
    if (req.method === 'GET') {
      const result = await query(
        'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
      );
      return successResponse(res, { users: result.rows });
    }

    return errorResponse(res, 'Method not allowed', 405);
  } catch (error) {
    console.error('Admin users error:', error);
    return errorResponse(res, error.message, 500, error);
  }
}
