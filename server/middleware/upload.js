import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const resolvedDir = path.resolve(UPLOAD_DIR);
if (!fs.existsSync(resolvedDir)) {
  fs.mkdirSync(resolvedDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resolvedDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '';
    const name = `${uuidv4()}${ext}`;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_UPLOAD_BYTES || '0') || Infinity }
});

export default upload;
