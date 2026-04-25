const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const galleryApi = {
  // Galleries
  async getGalleries(page = 1, limit = 24, sort = 'latest') {
    const response = await fetch(
      `${API_BASE_URL}/galleries?page=${page}&limit=${limit}&sort=${sort}`
    );
    if (!response.ok) throw new Error('Failed to fetch galleries');
    return response.json();
  },

  async createGallery(payload) {
    const token = localStorage.getItem('app_access_token');
    const res = await fetch(`${API_BASE_URL}/admin/galleries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Create gallery failed: ${res.status} ${text}`);
    }
    return res.json();
  },

  async getGalleryById(id) {
    const response = await fetch(`${API_BASE_URL}/galleries/${id}`);
    if (!response.ok) throw new Error('Gallery not found');
    return response.json();
  },

  async getGalleryBySlug(slug) {
    const response = await fetch(`${API_BASE_URL}/galleries/slug/${slug}`);
    if (!response.ok) throw new Error('Gallery not found');
    return response.json();
  },

  async getRelatedGalleries(galleryId) {
    const response = await fetch(`${API_BASE_URL}/galleries/${galleryId}/related`);
    if (!response.ok) throw new Error('Failed to fetch related galleries');
    return response.json();
  },

  async likeGallery(galleryId) {
    const response = await fetch(`${API_BASE_URL}/galleries/${galleryId}/like`);
    if (!response.ok) throw new Error('Failed to like gallery');
    return response.json();
  },

  // Categories
  async getCategories() {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  async getCategoryBySlug(slug) {
    const response = await fetch(`${API_BASE_URL}/categories/${slug}`);
    if (!response.ok) throw new Error('Category not found');
    return response.json();
  },

  async getGalleriesByCategory(categorySlug, page = 1, limit = 24) {
    const response = await fetch(
      `${API_BASE_URL}/categories/${categorySlug}/galleries?page=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error('Failed to fetch galleries');
    return response.json();
  },

  // Tags
  async getTags() {
    const response = await fetch(`${API_BASE_URL}/tags`);
    if (!response.ok) throw new Error('Failed to fetch tags');
    return response.json();
  },

  async getTagBySlug(slug) {
    const response = await fetch(`${API_BASE_URL}/tags/${slug}`);
    if (!response.ok) throw new Error('Tag not found');
    return response.json();
  },

  async getGalleriesByTag(tagSlug, page = 1, limit = 24) {
    const response = await fetch(
      `${API_BASE_URL}/tags/${tagSlug}/galleries?page=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error('Failed to fetch galleries');
    return response.json();
  },

  // Search
  async search(query, tags = null, page = 1, limit = 24) {
    let url = `${API_BASE_URL}/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
    if (tags) {
      url += `&tags=${encodeURIComponent(tags)}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Search failed');
    return response.json();
  }
};
