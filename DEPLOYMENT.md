# Vercel Environment Variables

Add these to your Vercel project settings:

```
DATABASE_URL=postgresql://user:password@host:5432/rewaya_gallery
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRY=7d
NODE_ENV=production
VITE_API_URL=/api
```

## Database Setup

1. Create a PostgreSQL database on:
   - Vercel Postgres (recommended)
   - AWS RDS
   - Heroku Postgres
   - Any PostgreSQL provider

2. Run migrations:
   ```bash
   # Locally first
   psql $DATABASE_URL < server/db/schema.sql
   psql $DATABASE_URL < server/db/seed.js
   ```

## API Routes Structure

For Vercel deployment, API routes are in `/api` directory:

- `GET /api/galleries` - List galleries
- `POST /api/galleries` - Create gallery (admin)
- `GET /api/galleries/[id]` - Get gallery detail
- `GET /api/galleries/[id]/related` - Get related galleries
- `POST /api/galleries/[id]/like` - Like gallery
- `GET /api/categories` - List categories
- `GET /api/categories/[slug]` - Get category
- `GET /api/categories/[slug]/galleries` - Get category galleries
- `GET /api/search` - Search galleries
- `GET /api/tags` - List tags
- `GET /api/tags/[slug]/galleries` - Get galleries by tag
- `POST /api/auth/login` - Login

## Deployment

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables
4. Deploy

The frontend will be built and served from Vercel.
API functions will be serverless on Vercel Functions (Edge Functions).
