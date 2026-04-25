export function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function createCustomError(message, status = 500, name = 'Error') {
  const error = new Error(message);
  error.status = status;
  error.name = name;
  return error;
}
