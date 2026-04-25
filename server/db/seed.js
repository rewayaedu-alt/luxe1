import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'gallery_db'
});

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');

    // Clear existing data (in reverse order of foreign keys)
    await pool.query('DELETE FROM gallery_tags');
    await pool.query('DELETE FROM images');
    await pool.query('DELETE FROM galleries');
    await pool.query('DELETE FROM tags');
    await pool.query('DELETE FROM categories');

    // Insert categories
    console.log('Adding categories...');
    const categories = [
      { name: 'Nature', slug: 'nature', icon: '🌿' },
      { name: 'Urban', slug: 'urban', icon: '🏙️' },
      { name: 'People', slug: 'people', icon: '👥' },
      { name: 'Architecture', slug: 'architecture', icon: '🏛️' },
      { name: 'Food', slug: 'food', icon: '🍽️' },
      { name: 'Travel', slug: 'travel', icon: '✈️' }
    ];

    const categoryIds = {};
    for (const cat of categories) {
      const result = await pool.query(
        'INSERT INTO categories (name, slug, icon) VALUES ($1, $2, $3) RETURNING id',
        [cat.name, cat.slug, cat.icon]
      );
      categoryIds[cat.slug] = result.rows[0].id;
    }

    // Insert tags
    console.log('Adding tags...');
    const tags = [
      'landscape', 'sunset', 'mountains', 'water', 'forest', 'ocean', 'beach',
      'street', 'buildings', 'night', 'light', 'colors', 'minimalist',
      'portrait', 'wildlife', 'flowers', 'seasons', 'travel', 'adventure'
    ];

    const tagIds = {};
    for (const tag of tags) {
      const result = await pool.query(
        'INSERT INTO tags (name, slug) VALUES ($1, $2) RETURNING id',
        [tag, tag]
      );
      tagIds[tag] = result.rows[0].id;
    }

    // Insert sample galleries
    console.log('Adding galleries...');
    const sampleGalleries = [
      {
        title: 'Alpine Wilderness',
        description: 'Stunning mountain landscapes captured during summer season',
        category_slug: 'nature',
        photographer: 'Alex Mountain',
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'
        ],
        tags: ['landscape', 'mountains', 'seasons']
      },
      {
        title: 'Urban Perspectives',
        description: 'Modern city architecture and street photography',
        category_slug: 'urban',
        photographer: 'Chris Urban',
        images: [
          'https://images.unsplash.com/photo-1449824913935-59a10b8d2000',
          'https://images.unsplash.com/photo-1449824913935-59a10b8d2000'
        ],
        tags: ['buildings', 'street', 'night', 'light']
      },
      {
        title: 'Ocean Dreams',
        description: 'Beautiful seascapes and coastal photography',
        category_slug: 'travel',
        photographer: 'Marina Sea',
        images: [
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
        ],
        tags: ['ocean', 'beach', 'water', 'sunset']
      },
      {
        title: 'Forest Serenity',
        description: 'Peaceful woodland and nature photography',
        category_slug: 'nature',
        photographer: 'Forest Ben',
        images: [
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e'
        ],
        tags: ['forest', 'landscape', 'flowers', 'minimalist']
      },
      {
        title: 'City Lights',
        description: 'Night photography and urban beauty',
        category_slug: 'urban',
        photographer: 'Night Owl',
        images: [
          'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b',
          'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b'
        ],
        tags: ['night', 'light', 'buildings', 'colors']
      },
      {
        title: 'Wildlife Wonders',
        description: 'Capturing nature\'s most amazing creatures',
        category_slug: 'nature',
        photographer: 'Wildlife Sam',
        images: [
          'https://images.unsplash.com/photo-1484406566174-9da000fda645',
          'https://images.unsplash.com/photo-1484406566174-9da000fda645'
        ],
        tags: ['wildlife', 'adventure', 'landscape']
      }
    ];

    for (const gallery of sampleGalleries) {
      const gallerySlug = gallery.title.toLowerCase().replace(/\s+/g, '-');
      const result = await pool.query(
        'INSERT INTO galleries (title, slug, description, category_id, photographer) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [gallery.title, gallerySlug, gallery.description, categoryIds[gallery.category_slug], gallery.photographer]
      );

      const galleryId = result.rows[0].id;

      // Insert images
      for (let i = 0; i < gallery.images.length; i++) {
        await pool.query(
          'INSERT INTO images (gallery_id, url, thumbnail_url, alt_text, "order") VALUES ($1, $2, $3, $4, $5)',
          [galleryId, gallery.images[i], gallery.images[i], `Image ${i + 1}`, i]
        );
      }

      // Link tags
      for (const tagName of gallery.tags) {
        await pool.query(
          'INSERT INTO gallery_tags (gallery_id, tag_id) VALUES ($1, $2)',
          [galleryId, tagIds[tagName]]
        );
      }
    }

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedDatabase();
