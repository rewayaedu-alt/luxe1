import { query } from '../lib/db';
import { successResponse, errorResponse, validateRequired } from '../lib/response';
import { requireAuth, requireRole } from '../lib/auth';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  try {
    if (req.method === 'POST') {
      // User login
      const { username, password } = req.body;
      const validation = validateRequired({ username, password }, ['username', 'password']);
      
      if (!validation.valid) {
        return errorResponse(res, `Missing required field: ${validation.missing}`, 400);
      }

      const result = await query(
        'SELECT id, username, email, password_hash, role FROM users WHERE username = $1',
        [username]
      );

      if (result.rows.length === 0) {
        return errorResponse(res, 'Invalid credentials', 401);
      }

      const user = result.rows[0];
      
      // Simple password check (in production, use bcrypt)
      if (user.password_hash !== password) {
        return errorResponse(res, 'Invalid credentials', 401);
      }

      // Generate token (simplified - use JWT in production)
      const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

      return successResponse(res, {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    }

    if (req.method === 'GET') {
      // Verify token
      try {
        const user = requireAuth(req);
        return successResponse(res, { user });
      } catch (error) {
        return errorResponse(res, error.message, 401);
      }
    }

    return errorResponse(res, 'Method not allowed', 405);
  } catch (error) {
    console.error('Auth error:', error);
    return errorResponse(res, error.message, 500, error);
  }
}
