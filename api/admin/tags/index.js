import { query } from '../../../lib/db';
import { successResponse, errorResponse, validateRequired } from '../../../lib/response';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  try {
    if (req.method === 'POST') {
      const { name, slug, description } = req.body;
      const validation = validateRequired({ name }, ['name']);
      
      if (!validation.valid) {
        return errorResponse(res, `Missing required field: ${validation.missing}`, 400);
      }

      const tagSlug = slug || name.toLowerCase().replace(/\s+/g, '-');

      const result = await query(
        'INSERT INTO tags (name, slug, description) VALUES ($1, $2, $3) RETURNING *',
        [name, tagSlug, description]
      );

      return successResponse(res, result.rows[0], 201);
    }

    return errorResponse(res, 'Method not allowed', 405);
  } catch (error) {
    console.error('Admin tags error:', error);
    return errorResponse(res, error.message, 500, error);
  }
}
