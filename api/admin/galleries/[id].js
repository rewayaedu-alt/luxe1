import { query } from '../../../lib/db';
import { successResponse, errorResponse, validateRequired } from '../../../lib/response';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  const { id } = req.query;

  try {
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
    console.error('Admin gallery error:', error);
    return errorResponse(res, error.message, 500, error);
  }
}
