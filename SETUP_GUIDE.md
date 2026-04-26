# Rewaya Gallery - Complete Implementation Guide

This guide covers the full implementation of the Rewaya adult gallery platform with Vercel deployment.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Git
- Vercel account (for deployment)

### 1. Local Setup

#### Clone & Install Dependencies
```bash
cd "c:\Users\athar\rewaya edu\Project_test"
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

#### Configure Database

Create a `.env` file in the project root:
```env
# Frontend
VITE_API_URL=http://localhost:5000/api

# Backend (server/.env)
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/rewaya_gallery
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRY=7d
```

#### Initialize Database
```bash
cd server
npm run db:init      # Create schema
npm run db:seed      # Populate sample data
cd ..
```

### 2. Development Workflow

#### Terminal 1 - Frontend (Vite dev server)
```bash
npm run dev
# Runs on http://localhost:5173
```

#### Terminal 2 - Backend (Express server)
```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

The frontend will automatically proxy API calls to the backend.

## 📁 Project Structure

```
rewaya-gallery/
├── src/                              # Frontend (React)
│   ├── pages/                        # Page components
│   ├── components/                   # Reusable components
│   ├── lib/                          # Utilities & context
│   ├── services/                     # API client
│   └── App.jsx                       # Main app
│
├── api/                              # Vercel Serverless Functions
│   ├── lib/                          # Shared utilities
│   ├── galleries/                    # Gallery endpoints
│   ├── categories/                   # Category endpoints
│   ├── tags/                         # Tag endpoints
│   ├── search.js                     # Search endpoint
│   ├── auth/login.js                 # Authentication
│   └── admin/                        # Admin CRUD routes
│
├── server/                           # Backend (Express) - For local dev
│   ├── routes/                       # API route definitions
│   ├── controllers/                  # Business logic
│   ├── db/                           # Database setup & seed
│   ├── middleware/                   # Express middleware
│   ├── models/                       # Database models
│   └── server.js                     # Entry point
│
├── public/                           # Static assets
├── vite.config.js                    # Vite configuration
├── vercel.json                       # Vercel deployment config
├── DEPLOYMENT.md                     # Deployment guide
└── README.md                         # This file
```

## 🔌 API Endpoints

### Public Endpoints

#### Galleries
- `GET /api/galleries?page=1&limit=24&sort=latest` - List galleries
- `GET /api/galleries/[id]` - Get gallery detail
- `GET /api/galleries/[id]/related` - Get related galleries
- `POST /api/galleries/[id]/like` - Like a gallery

#### Categories
- `GET /api/categories` - List categories
- `GET /api/categories/[slug]` - Get category
- `GET /api/categories/[slug]/galleries` - Get category galleries

#### Search & Tags
- `GET /api/search?q=query` - Search galleries
- `GET /api/tags` - List all tags
- `GET /api/tags/[slug]/galleries` - Get galleries by tag

### Admin Endpoints (Protected)

Require JWT token in `Authorization: Bearer <token>` header

#### Categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/[slug]` - Update category
- `DELETE /api/admin/categories/[slug]` - Delete category

#### Galleries
- `PUT /api/admin/galleries/[id]` - Update gallery
- `DELETE /api/admin/galleries/[id]` - Delete gallery

#### Tags
- `POST /api/admin/tags` - Create tag
- `DELETE /api/admin/tags/[slug]` - Delete tag

#### Images
- `POST /api/admin/images` - Add image to gallery
- `DELETE /api/admin/images/[id]` - Delete image

#### Users
- `GET /api/admin/users` - List users
- `PUT /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user

### Authentication

#### Login
```
POST /api/auth/login
Body: { "username": "admin", "password": "admin123" }
Response: { "token": "...", "user": {...} }
```

#### Verify Token
```
GET /api/auth/login
Headers: { "Authorization": "Bearer <token>" }
Response: { "user": {...} }
```

## 🔐 Authentication

### Default Admin Credentials (Change in Production!)
- Username: `admin`
- Password: `admin123`

### Login Flow
1. User submits credentials to `/api/auth/login`
2. Backend verifies and returns JWT token
3. Token stored in `localStorage` as `adminToken`
4. Token included in `Authorization` header for protected routes
5. Frontend AuthContext manages authentication state

## 🗄️ Database Schema

### Categories Table
```sql
id (UUID) | name | slug | description | icon | created_at | updated_at
```

### Galleries Table
```sql
id (UUID) | title | slug | description | category_id | photographer
view_count | like_count | is_featured | created_at | updated_at
```

### Images Table
```sql
id (UUID) | gallery_id | url | thumbnail_url | alt_text
"order" | width | height | created_at
```

### Tags Table
```sql
id (UUID) | name | slug | description | created_at | updated_at
```

### Gallery_Tags Table (Junction)
```sql
gallery_id (FK) | tag_id (FK)
```

### Users Table
```sql
id (UUID) | username | email | password_hash | role
created_at | updated_at
```

## 🚢 Deployment to Vercel

### 1. Prepare Repository

Ensure your GitHub repo includes all necessary files:
- `vercel.json` - Deployment configuration
- `api/` - Serverless functions
- `src/` - Frontend code
- `package.json` - Dependencies
- `.env.example` - Environment variables template

### 2. Set Up Vercel Project

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (first time)
vercel

# For subsequent deployments
git push  # Vercel auto-deploys on push
```

### 3. Configure Environment Variables

In Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add:
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=production-secret-key
   JWT_EXPIRY=7d
   VITE_API_URL=https://your-vercel-domain/api
   NODE_ENV=production
   ```

### 4. Database Setup

Create PostgreSQL database on:
- Vercel Postgres (recommended, integrated)
- AWS RDS
- Heroku Postgres
- Railway
- Supabase

### 5. Initialize Database on Vercel

Run migrations once after deployment:
```bash
# Using Vercel CLI
vercel env pull

# Connect to database and run schema
psql $DATABASE_URL < server/db/schema.sql
```

## 🛠️ Development Scripts

### Frontend
```bash
npm run dev          # Start dev server (port 5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code quality
npm run lint:fix     # Fix linting issues
npm run typecheck    # Type validation
```

### Backend (Server Directory)
```bash
npm run dev          # Start with auto-reload
npm run start        # Start production
npm run db:init      # Initialize database
npm run db:seed      # Seed sample data
```

## 🔄 Adding Gallery Content

### Via Admin Panel
1. Login at `/admin/login` with default credentials
2. Navigate to admin panel
3. Add categories, galleries, images through UI

### Via API (Curl Examples)

#### Create Gallery
```bash
curl -X POST http://localhost:5000/api/galleries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Beach Photos",
    "slug": "beach-photos",
    "description": "Beautiful beach photography",
    "categoryId": "uuid",
    "photographer": "John Doe"
  }'
```

#### Add Images to Gallery
```bash
curl -X POST http://localhost:5000/api/admin/images \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "galleryId": "uuid",
    "url": "https://example.com/image.jpg",
    "altText": "Beach sunset",
    "order": 0
  }'
```

## 📊 Vercel Features Used

### Serverless Functions
- Edge runtime for low latency
- Auto-scaling for traffic spikes
- PostgreSQL connection pooling

### Deployments
- Automatic on git push
- Preview deployments for PRs
- Instant rollbacks

### Environment Variables
- Encrypted secrets
- Preview/Production distinction
- Easy secret rotation

## 🔒 Security Best Practices

1. **Never commit secrets**: Use `.env.local` and Vercel env variables
2. **Use HTTPS**: Vercel provides free SSL/TLS
3. **Validate input**: All API routes validate required fields
4. **CORS configured**: Limited to your domain
5. **SQL injection prevention**: Use parameterized queries
6. **Password hashing**: bcrypt for user passwords (implement in production)
7. **JWT expiry**: Tokens expire after 7 days (configurable)

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check environment variable
echo $DATABASE_URL
```

### API Not Found (404)
- Verify API routes match file structure
- Check CORS origin matches frontend domain
- Ensure `vercel.json` is in root

### Authentication Failing
- Clear localStorage: `localStorage.clear()`
- Check token format in Authorization header
- Verify JWT_SECRET matches between dev and production

### Build Failures
- Check Node version: `node --version` (need 18+)
- Clear cache: `npm cache clean --force`
- Rebuild: `npm install && npm run build`

## 📚 Additional Resources

- [Vercel Docs](https://vercel.com/docs)
- [PostgreSQL Guide](https://www.postgresql.org/docs/)
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Express.js Guide](https://expressjs.com/)

## 📝 Next Steps

1. ✅ Set up PostgreSQL database
2. ✅ Initialize schema and seed data
3. ✅ Test local development
4. ✅ Set up Vercel project
5. ✅ Deploy to production
6. ⏳ Configure custom domain
7. ⏳ Set up monitoring/logging
8. ⏳ Implement file uploads (if needed)
9. ⏳ Add payment processing (Stripe integration ready)
10. ⏳ Set up CDN for images

## 💬 Support

For issues or questions:
1. Check troubleshooting section
2. Review API error responses
3. Check Vercel logs: `vercel logs`
4. Check local server console for errors

---

**Version**: 1.0.0  
**Last Updated**: April 27, 2026  
**Status**: Ready for Vercel Deployment
