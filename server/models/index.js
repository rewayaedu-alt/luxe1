import pool from '../db/connection.js';

export class Gallery {
  static async findAll(page = 1, limit = 24, sort = 'latest') {
    const offset = (page - 1) * limit;
    const orderBy = sort === 'popular' ? 'view_count DESC' : 'created_at DESC';

    const result = await pool.query(
      `SELECT 
        g.id, g.title, g.slug, g.description, g.photographer, 
        g.view_count, g.like_count, g.created_at, g.is_featured,
        c.id as category_id, c.name as category_name, c.slug as category_slug,
        (SELECT json_agg(json_build_object('id', i.id, 'url', i.url, 'thumbnail_url', i.thumbnail_url, 'alt_text', i.alt_text))
         FROM images i WHERE i.gallery_id = g.id ORDER BY i."order") as images,
        (SELECT json_agg(json_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
         FROM gallery_tags gt JOIN tags t ON gt.tag_id = t.id WHERE gt.gallery_id = g.id) as tags
      FROM galleries g
      LEFT JOIN categories c ON g.category_id = c.id
      ORDER BY ${orderBy}
      LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM galleries');
    return {
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      limit,
      hasMore: offset + limit < parseInt(countResult.rows[0].count)
    };
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT 
        g.id, g.title, g.slug, g.description, g.photographer, 
        g.view_count, g.like_count, g.created_at,
        c.id as category_id, c.name as category_name, c.slug as category_slug,
        (SELECT json_agg(json_build_object('id', i.id, 'url', i.url, 'thumbnail_url', i.thumbnail_url, 'alt_text', i.alt_text, 'width', i.width, 'height', i.height))
         FROM images i WHERE i.gallery_id = g.id ORDER BY i."order") as images,
        (SELECT json_agg(json_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
         FROM gallery_tags gt JOIN tags t ON gt.tag_id = t.id WHERE gt.gallery_id = g.id) as tags
      FROM galleries g
      LEFT JOIN categories c ON g.category_id = c.id
      WHERE g.id = $1`,
      [id]
    );

    if (result.rows.length === 0) return null;
    return result.rows[0];
  }

  static async findBySlug(slug) {
    const result = await pool.query(
      `SELECT 
        g.id, g.title, g.slug, g.description, g.photographer, 
        g.view_count, g.like_count, g.created_at,
        c.id as category_id, c.name as category_name, c.slug as category_slug,
        (SELECT json_agg(json_build_object('id', i.id, 'url', i.url, 'thumbnail_url', i.thumbnail_url, 'alt_text', i.alt_text))
         FROM images i WHERE i.gallery_id = g.id ORDER BY i."order") as images,
        (SELECT json_agg(json_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
         FROM gallery_tags gt JOIN tags t ON gt.tag_id = t.id WHERE gt.gallery_id = g.id) as tags
      FROM galleries g
      LEFT JOIN categories c ON g.category_id = c.id
      WHERE g.slug = $1`,
      [slug]
    );

    if (result.rows.length === 0) return null;
    return result.rows[0];
  }

  static async findByCategory(categorySlug, page = 1, limit = 24) {
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT 
        g.id, g.title, g.slug, g.description, g.photographer, 
        g.view_count, g.like_count, g.created_at,
        c.id as category_id, c.name as category_name, c.slug as category_slug,
        (SELECT json_agg(json_build_object('id', i.id, 'url', i.url, 'thumbnail_url', i.thumbnail_url, 'alt_text', i.alt_text))
         FROM images i WHERE i.gallery_id = g.id ORDER BY i."order") as images,
        (SELECT json_agg(json_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
         FROM gallery_tags gt JOIN tags t ON gt.tag_id = t.id WHERE gt.gallery_id = g.id) as tags
      FROM galleries g
      LEFT JOIN categories c ON g.category_id = c.id
      WHERE c.slug = $1
      ORDER BY g.created_at DESC
      LIMIT $2 OFFSET $3`,
      [categorySlug, limit, offset]
    );

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM galleries g LEFT JOIN categories c ON g.category_id = c.id WHERE c.slug = $1',
      [categorySlug]
    );

    return {
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      limit,
      hasMore: offset + limit < parseInt(countResult.rows[0].count)
    };
  }

  static async findRelated(galleryId, limit = 6) {
    const result = await pool.query(
      `SELECT 
        g.id, g.title, g.slug, g.description, g.photographer, 
        g.view_count, g.like_count, g.created_at,
        (SELECT json_agg(json_build_object('id', i.id, 'url', i.url, 'thumbnail_url', i.thumbnail_url, 'alt_text', i.alt_text))
         FROM images i WHERE i.gallery_id = g.id ORDER BY i."order" LIMIT 1) as images,
        COUNT(gt2.tag_id) as shared_tags
      FROM galleries g
      LEFT JOIN gallery_tags gt2 ON g.id = gt2.gallery_id
      WHERE g.id IN (
        SELECT DISTINCT g2.id FROM galleries g2
        INNER JOIN gallery_tags gt1 ON g2.id = gt1.gallery_id
        WHERE gt1.tag_id IN (
          SELECT tag_id FROM gallery_tags WHERE gallery_id = $1
        ) AND g2.id != $1
      )
      GROUP BY g.id
      ORDER BY shared_tags DESC, g.view_count DESC
      LIMIT $2`,
      [galleryId, limit]
    );

    return result.rows;
  }

  static async create(data) {
    const { title, slug, description, categoryId, photographer } = data;
    const result = await pool.query(
      'INSERT INTO galleries (title, slug, description, category_id, photographer) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [title, slug, description, categoryId || null, photographer]
    );
    return result.rows[0];
  }

  static async incrementViews(id) {
    await pool.query('UPDATE galleries SET view_count = view_count + 1 WHERE id = $1', [id]);
  }

  static async incrementLikes(id) {
    await pool.query('UPDATE galleries SET like_count = like_count + 1 WHERE id = $1', [id]);
  }
}

export class Tag {
  static async findAll() {
    const result = await pool.query(
      `SELECT t.id, t.name, t.slug, COUNT(gt.gallery_id) as gallery_count
       FROM tags t
       LEFT JOIN gallery_tags gt ON t.id = gt.tag_id
       GROUP BY t.id, t.name, t.slug
       ORDER BY gallery_count DESC`
    );
    return result.rows;
  }

  static async findBySlug(slug) {
    const result = await pool.query(
      `SELECT t.id, t.name, t.slug, COUNT(gt.gallery_id) as gallery_count
       FROM tags t
       LEFT JOIN gallery_tags gt ON t.id = gt.tag_id
       WHERE t.slug = $1
       GROUP BY t.id, t.name, t.slug`,
      [slug]
    );
    return result.rows[0] || null;
  }

  static async findGalleriesByTag(tagSlug, page = 1, limit = 24) {
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT 
        g.id, g.title, g.slug, g.description, g.photographer, 
        g.view_count, g.like_count, g.created_at,
        (SELECT json_agg(json_build_object('id', i.id, 'url', i.url, 'thumbnail_url', i.thumbnail_url, 'alt_text', i.alt_text))
         FROM images i WHERE i.gallery_id = g.id ORDER BY i."order" LIMIT 1) as images
      FROM galleries g
      INNER JOIN gallery_tags gt ON g.id = gt.gallery_id
      INNER JOIN tags t ON gt.tag_id = t.id
      WHERE t.slug = $1
      ORDER BY g.created_at DESC
      LIMIT $2 OFFSET $3`,
      [tagSlug, limit, offset]
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM galleries g
       INNER JOIN gallery_tags gt ON g.id = gt.gallery_id
       INNER JOIN tags t ON gt.tag_id = t.id
       WHERE t.slug = $1`,
      [tagSlug]
    );

    return {
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      limit,
      hasMore: offset + limit < parseInt(countResult.rows[0].count)
    };
  }

  static async create(name, slug) {
    const result = await pool.query(
      'INSERT INTO tags (name, slug) VALUES ($1, $2) ON CONFLICT (slug) DO UPDATE SET name = $1 RETURNING id',
      [name, slug]
    );
    return result.rows[0];
  }
}

export class Category {
  static async findAll() {
    const result = await pool.query(
      'SELECT * FROM categories ORDER BY name'
    );
    return result.rows;
  }

  static async findBySlug(slug) {
    const result = await pool.query(
      'SELECT * FROM categories WHERE slug = $1',
      [slug]
    );
    return result.rows[0] || null;
  }

  static async create(name, slug, icon = null) {
    const result = await pool.query(
      'INSERT INTO categories (name, slug, icon) VALUES ($1, $2, $3) RETURNING *',
      [name, slug, icon]
    );
    return result.rows[0];
  }
}

export class Image {
  static async create(galleryId, imageData) {
    const { url, thumbnailUrl, altText, order = 0, width, height } = imageData;
    const result = await pool.query(
      'INSERT INTO images (gallery_id, url, thumbnail_url, alt_text, "order", width, height) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [galleryId, url, thumbnailUrl || url, altText || '', order, width, height]
    );
    return result.rows[0];
  }

  static async findByGalleryId(galleryId) {
    const result = await pool.query(
      'SELECT * FROM images WHERE gallery_id = $1 ORDER BY "order"',
      [galleryId]
    );
    return result.rows;
  }
}
