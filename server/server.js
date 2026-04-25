import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import galleriesRouter from './routes/galleries.js';
import categoriesRouter from './routes/categories.js';
import tagsRouter from './routes/search.js';
import searchRouter from './routes/search-routes.js';
import authRouter from './routes/auth.js';
import adminUploadsRouter from './routes/admin-uploads.js';
import adminGalleriesRouter from './routes/admin-galleries.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.resolve(process.env.UPLOAD_DIR || './uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API Routes
app.use('/api/galleries', galleriesRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/search', searchRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin/uploads', adminUploadsRouter);
app.use('/api/admin/galleries', adminGalleriesRouter);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Gallery API Server running at http://localhost:${PORT}`);
  console.log(`✅ CORS enabled for ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
});

export default server;
