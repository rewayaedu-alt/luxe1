import { query } from '../../../../lib/db';
import { successResponse, errorResponse } from '../../../../lib/response';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  const { id } = req.query;

  try {
    if (req.method === 'DELETE') {
      await query('DELETE FROM images WHERE id = $1', [id]);
      return successResponse(res, { message: 'Image deleted' });
    }

    return errorResponse(res, 'Method not allowed', 405);
  } catch (error) {
    console.error('Admin image detail error:', error);
    return errorResponse(res, error.message, 500, error);
  }
}
