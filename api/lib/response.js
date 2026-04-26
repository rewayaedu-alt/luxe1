export function successResponse(res, data, status = 200) {
  res.status(status).json({ success: true, data });
}

export function errorResponse(res, message, status = 500, error = null) {
  res.status(status).json({ 
    success: false, 
    error: message,
    ...(error && process.env.NODE_ENV === 'development' && { details: error.message })
  });
}

export function validateMethod(req, res, allowedMethods) {
  if (!allowedMethods.includes(req.method)) {
    res.status(405).json({ 
      error: 'Method not allowed',
      allowed: allowedMethods 
    });
    return false;
  }
  return true;
}

export function validateRequired(obj, fields) {
  for (const field of fields) {
    if (!obj[field]) {
      return { valid: false, missing: field };
    }
  }
  return { valid: true };
}
