import { query } from '../../../lib/db';
import { successResponse, errorResponse } from '../../../lib/response';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  const { slug } = req.query;

  try {
    if (req.method === 'GET') {
      const result = await query(
        'SELECT * FROM categories WHERE slug = $1',
        [slug]
      );

      if (result.rows.length === 0) {
        return errorResponse(res, 'Category not found', 404);
      }

      return successResponse(res, result.rows[0]);
    }

    if (req.method === 'PUT') {
      const { name, description, icon } = req.body;

      const result = await query(
        'UPDATE categories SET name = $1, description = $2, icon = $3, updated_at = CURRENT_TIMESTAMP WHERE slug = $4 RETURNING *',
        [name, description, icon, slug]
      );

      if (result.rows.length === 0) {
        return errorResponse(res, 'Category not found', 404);
      }

      return successResponse(res, result.rows[0]);
    }

    if (req.method === 'DELETE') {
      await query('DELETE FROM categories WHERE slug = $1', [slug]);
      return successResponse(res, { message: 'Category deleted' });
    }

    return errorResponse(res, 'Method not allowed', 405);
  } catch (error) {
    console.error('Category detail error:', error);
    return errorResponse(res, error.message, 500, error);
  }
}
