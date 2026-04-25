import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const user = await User.validatePassword(email, password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user.id, role: user.role, username: user.username, email: user.email },
    process.env.JWT_SECRET || 'dev_jwt_secret',
    { expiresIn: '7d' }
  );

  res.json({ token, user });
}

export async function me(req, res) {
  if (!req.user || !req.user.id) return res.status(401).json({ message: 'Unauthorized' });
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
}
