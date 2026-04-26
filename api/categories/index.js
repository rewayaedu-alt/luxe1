import { query } from '../lib/db';
import { successResponse, errorResponse, validateRequired } from '../lib/response';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  try {
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM categories ORDER BY name ASC');
      return successResponse(res, { categories: result.rows });
    }

    if (req.method === 'POST') {
      const { name, slug, description, icon } = req.body;
      const validation = validateRequired({ name, slug }, ['name', 'slug']);
      
      if (!validation.valid) {
        return errorResponse(res, `Missing required field: ${validation.missing}`, 400);
      }

      const result = await query(
        'INSERT INTO categories (name, slug, description, icon) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, slug, description, icon]
      );

      return successResponse(res, result.rows[0], 201);
    }

    return errorResponse(res, 'Method not allowed', 405);
  } catch (error) {
    console.error('Categories error:', error);
    return errorResponse(res, error.message, 500, error);
  }
}
