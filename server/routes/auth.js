import express from 'express';
import { login, register, verifyToken, logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/verify', verifyToken);
router.post('/logout', logout);

export default router;
