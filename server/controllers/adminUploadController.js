import path from 'path';

export async function uploadFile(req, res) {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const urlPath = path.join('/uploads', req.file.filename).replace(/\\/g, '/');
  res.json({
    url: urlPath,
    filename: req.file.filename,
    originalname: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
}
