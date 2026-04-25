export const validatePagination = (req, res, next) => {
  let { page = 1, limit = 24 } = req.query;
  
  page = Math.max(1, parseInt(page) || 1);
  limit = Math.min(Math.max(1, parseInt(limit) || 24), 100);

  req.pagination = { page, limit };
  next();
};

export const validateSlug = (req, res, next) => {
  const { slug } = req.params;
  if (!slug || slug.trim() === '') {
    return res.status(400).json({ error: 'Invalid slug' });
  }
  next();
};

export const validateSearch = (req, res, next) => {
  const { q } = req.query;
  if (q && q.trim().length > 500) {
    return res.status(400).json({ error: 'Search query too long (max 500 characters)' });
  }
  next();
};
