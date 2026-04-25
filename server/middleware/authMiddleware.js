import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Missing Authorization header' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Invalid Authorization format' });

  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_jwt_secret');
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function requireRole(minRole = 'editor') {
  const roles = ['viewer', 'editor', 'admin'];
  return (req, res, next) => {
    if (!req.user || !req.user.role) return res.status(403).json({ message: 'Forbidden' });
    const userIndex = roles.indexOf(req.user.role);
    const minIndex = roles.indexOf(minRole);
    if (userIndex === -1 || userIndex < minIndex) return res.status(403).json({ message: 'Insufficient privileges' });
    next();
  };
}
