import { query } from '../../../../lib/db';
import { successResponse, errorResponse } from '../../../../lib/response';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  const { id } = req.query;

  try {
    if (req.method === 'PUT') {
      const { username, email, role, password } = req.body;
      
      let updateQuery = 'UPDATE users SET ';
      let params = [];
      let paramIndex = 1;

      if (username !== undefined) {
        updateQuery += `username = $${paramIndex++}, `;
        params.push(username);
      }
      if (email !== undefined) {
        updateQuery += `email = $${paramIndex++}, `;
        params.push(email);
      }
      if (role !== undefined) {
        updateQuery += `role = $${paramIndex++}, `;
        params.push(role);
      }
      if (password !== undefined) {
        updateQuery += `password_hash = $${paramIndex++}, `;
        params.push(password);
      }

      updateQuery += `updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING id, username, email, role`;
      params.push(id);

      const result = await query(updateQuery, params);

      if (result.rows.length === 0) {
        return errorResponse(res, 'User not found', 404);
      }

      return successResponse(res, result.rows[0]);
    }

    if (req.method === 'DELETE') {
      await query('DELETE FROM users WHERE id = $1', [id]);
      return successResponse(res, { message: 'User deleted' });
    }

    return errorResponse(res, 'Method not allowed', 405);
  } catch (error) {
    console.error('Admin user detail error:', error);
    return errorResponse(res, error.message, 500, error);
  }
}
