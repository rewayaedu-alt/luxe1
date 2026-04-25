import pool from '../db/connection.js';

export const searchGalleries = async (req, res) => {
  try {
    const { q, tags } = req.query;
    const { page, limit } = req.pagination;
    const offset = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    let query = `
      SELECT DISTINCT
        g.id, g.title, g.slug, g.description, g.photographer, 
        g.view_count, g.like_count, g.created_at,
        (SELECT json_agg(json_build_object('id', i.id, 'url', i.url, 'thumbnail_url', i.thumbnail_url, 'alt_text', i.alt_text))
         FROM images i WHERE i.gallery_id = g.id ORDER BY i."order" LIMIT 1) as images
      FROM galleries g
      LEFT JOIN gallery_tags gt ON g.id = gt.gallery_id
      LEFT JOIN tags t ON gt.tag_id = t.id
      WHERE (
        to_tsvector('english', g.title) @@ plainto_tsquery('english', $1)
        OR to_tsvector('english', g.description) @@ plainto_tsquery('english', $1)
        OR g.title ILIKE $2
      )
    `;

    const queryParams = [q, `%${q}%`];

    if (tags) {
      const tagArray = tags.split(',').map(t => t.trim());
      query += ` AND t.slug = ANY($${queryParams.length + 1}::text[])`;
      queryParams.push(tagArray);
    }

    query += ` ORDER BY g.created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);

    const result = await pool.query(query, queryParams);

    // Get total count
    let countQuery = `
      SELECT COUNT(DISTINCT g.id) FROM galleries g
      LEFT JOIN gallery_tags gt ON g.id = gt.gallery_id
      LEFT JOIN tags t ON gt.tag_id = t.id
      WHERE (
        to_tsvector('english', g.title) @@ plainto_tsquery('english', $1)
        OR to_tsvector('english', g.description) @@ plainto_tsquery('english', $1)
        OR g.title ILIKE $2
      )
    `;

    const countParams = [q, `%${q}%`];

    if (tags) {
      const tagArray = tags.split(',').map(t => t.trim());
      countQuery += ` AND t.slug = ANY($${countParams.length + 1}::text[])`;
      countParams.push(tagArray);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      data: result.rows,
      total,
      page,
      limit,
      hasMore: offset + limit < total,
      query: q
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
