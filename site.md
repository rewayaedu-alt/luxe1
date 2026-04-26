# Rewaya - Photography Gallery Platform

## 📋 Project Overview

**Luxious** is a modern, adult(18+) gallery/albums platform designed for browsing, discovering, and managing adult photos. It combines a beautiful React frontend with a robust Node.js/PostgreSQL backend to provide a seamless experience for viewing, filtering, and uploading photography content.

The platform serves as a adult gallery showcasing adult photos with organized categories, galleries, creators, and advanced search/filtering capabilities.

---

## 🎯 Core Idea & Purpose

The platform aims to:
1. **Browse Photography**: Discover adult(18+) photos through various browsing methods (categories, galleries, trending, search)
2. **Organize Content**: Categorize photos by tags (Amateur, Lifestyle, Couples, Nature, etc.)
3. **Social Features**: Showcase "stars" (featured adult models)
4. **User Contribution**: nothing.
5. **Admin Management**: Provide admin panel for content management and moderation
6. **Discoverability**: Enable search for content discovery

---

## 🏗️ Architecture Overview

### Three-Tier Architecture
```
Frontend (React/Vite)
    ↓ (HTTP/REST API)
Backend (Node.js/Express)
    ↓ (Database)
Database (PostgreSQL)
```

---

## 💻 Frontend Stack

### Core Technologies
- **React 18**: Component-based UI framework
- **Vite**: Lightning-fast build tool and dev server
- **React Router**: Client-side routing and navigation
- **TypeScript/JSConfig**: Type safety across the codebase

### UI & Styling
- **Radix UI**: Accessible, headless component library
- **TailwindCSS**: Utility-first CSS framework
- **PostCSS**: CSS processing and optimization
- **Dark Mode Support**: Built-in dark/light theme switching

### State Management & Data
- **TanStack React Query**: Server state management and data fetching
- **React Context API**: Local state management (AuthContext)
- **localStorage**: Client-side persistence for custom content

### Forms & Validation
- **React Hook Form**: Efficient form state management
- **@hookform/resolvers**: Integration with validation libraries

### Additional Libraries
- **Stripe Integration**: `@stripe/react-stripe-js`, `@stripe/stripe-js` (payment processing)
- **Drag & Drop**: `@hello-pangea/dnd` (reorderable lists/galleries)
- **Command Palette**: `cmdk` (keyboard command interface)
- **Utilities**: `clsx`, `class-variance-authority` (styling utilities)
- **Animations**: `canvas-confetti` (celebration effects)

### Build & Quality
- **ESLint**: Code linting and quality checks
- **TypeScript Type Checking**: JSConfig-based type validation
- **Vite Config**: Optimized build settings with path aliases (@/)

---

## 🖥️ Frontend Structure

### Pages (`src/pages/`)
The application includes the following main pages:

| Page | Purpose |
|------|---------|
| **Home** | Landing page with featured content, categories, channels, and masonry Albums |
| **Categories** | Browse all photography categories (Amateur, Lifestyle, Couples, Nature, etc.) |
| **CategoryPage** | Detail view for a specific category with related galleries |
| **Channels** | Browse content organized by channel/creator collections |
| **ChannelDetail** | View galleries within a specific channel |
| **Stars** | Discover stars |
| **StarDetail** | View all galleries from a specific star |
| **Search** | Full-text search across galleries and photos |
| **Tags** | Filter and browse content by tags |
| **PhotoDetail** | Detailed view of a single photo with metadata |
| **Upload** | Non-persistent demo for uploading new photos |
| **UploadedPhotoDetail** | Preview of uploaded photos before "saving" |
| **AdminLogin** | Authentication for admin users |
| **AdminPanel** | Admin dashboard for content management |
| **PageNotFound** | 404 error page |

### Components (`src/components/`)

#### Layout Components
- **Layout**: Main wrapper with navigation and footer
- **Navbar**: Top navigation bar with branding and menu
- **Footer**: Site footer with links and info
- **DirectoryHeader**: Page header with title and description

#### Feature Components
- **DiscoveryGrid**: Grid layout for galleries/content
- **DiscoveryCard**: Individual card for gallery/creator preview
- **GalleryGrid**: Specialized grid for gallery collections
- **MediaMasonry**: Masonry layout for photos
- **PhotoGrid**: Grid display for photo collections
- **CategoryPills**: Horizontal scrollable category selector
- **FilterChips**: Multi-select filter chips
- **SortTabs**: Tab-based sorting options

#### UI Components (`src/components/ui/`)
Comprehensive Radix UI component library including:
- `accordion`, `alert`, `alert-dialog`, `avatar`, `badge`
- `breadcrumb`, `button`, `calendar`, `card`, `carousel`
- `checkbox`, `collapsible`, `command`, `context-menu`, `dialog`
- `drawer`, `dropdown-menu`, `form`, `hover-card`, `input`
- `label`, `menubar`, `navigation-menu`, `pagination`, `popover`
- `progress`, `radio-group`, `scroll-area`, `select`, `separator`
- `sheet`, `sidebar`, `skeleton`, `slider`, `tabs`, `toast`, `toggle`
- And many more...

#### Utility Components
- **ProtectedRoute**: Route protection for authenticated pages
- **UserNotRegisteredError**: Error message for unauthorized access

### Hooks (`src/hooks/`)
- **use-mobile**: Hook for detecting mobile viewport

### Utilities & Libraries (`src/lib/`)
- **AuthContext**: Authentication state and user management
- **content.js**: Seeded data (categories, galleries, photos, channels, stars)
- **galleryUtils.js**: Gallery manipulation utilities
- **imageUtils.js**: Image processing and handling
- **photoData.js**: Photo data structures and helpers
- **app-params.js**: Application configuration
- **utils.js**: General utility functions
- **query-client.js**: React Query configuration

---

## 🔧 Backend Stack

### Core Technologies
- **Node.js**: JavaScript runtime
- **Express.js**: Minimal web framework
- **PostgreSQL**: Production-grade relational database
- **UUID**: Unique identifier generation
- **CORS**: Cross-origin resource sharing

### Middleware & Tools
- **dotenv**: Environment variable management
- **express-async-errors**: Async error handling
- **multer**: File upload handling
- **slug**: URL-friendly slug generation
- **pg**: PostgreSQL client for Node.js

### Development Tools
- **Nodemon**: Auto-reload during development

---

## 🔌 Backend Structure

### Routes (`server/routes/`)
- **galleries.js**: Gallery CRUD and listing endpoints
- **categories.js**: Category listing and filtering
- **search.js**: Tag-based search
- **search-routes.js**: Full-text search functionality

### Controllers (`server/controllers/`)
- **galleryController.js**: Gallery business logic
- **categoryController.js**: Category operations
- **searchController.js**: Search functionality
- **tagController.js**: Tag operations

### Database (`server/db/`)

#### Schema
PostgreSQL database with the following tables:

| Table | Purpose |
|-------|---------|
| **categories** | Photography categories (Amateur, Lifestyle, Couples, etc.) |
| **galleries** | Collection of photos with metadata and statistics |
| **images** | Individual photos within galleries |
| **tags** | Searchable tags for filtering |
| **gallery_tags** | Many-to-many relationship between galleries and tags |
| **users** | Admin user accounts with roles (viewer, editor, admin) |

#### Key Features
- UUID primary keys with auto-generation
- Automatic timestamps (`created_at`, `updated_at`)
- Full-text search indexes on gallery titles and descriptions
- Performance indexes on frequently queried columns
- Trigger functions for automatic timestamp updates
- Foreign key constraints for data integrity
- Cascade delete for orphaned records

#### Initialization
- **connection.js**: Database connection pooling
- **init.js**: Schema creation
- **seed.js**: Sample data population

### Middleware (`server/middleware/`)
- **errorHandler.js**: Global error handling
- **validation.js**: Request validation

### Utilities (`server/utils/`)
- **helpers.js**: Common server-side helpers

### Configuration
- **.env**: Environment variables (PORT, CORS_ORIGIN, DATABASE_URL, etc.)

---

## 📊 Database Schema

### Categories Table
```sql
id (UUID) | name | slug | description | icon | created_at | updated_at
```
Stores photography category definitions with unique names and URL slugs.

### Galleries Table
```sql
id (UUID) | title | slug | description | category_id | photographer
view_count | like_count | is_featured | created_at | updated_at
```
Represents collections of photos with engagement metrics and status flags.

### Images Table
```sql
id (UUID) | gallery_id | url | thumbnail_url | alt_text
order | width | height | created_at
```
Individual photos within galleries with metadata and ordering.

### Tags Table
```sql
id (UUID) | name | slug | description | created_at | updated_at
```
Searchable tags for content filtering and discovery.

### Gallery_Tags Table
```sql
gallery_id (FK) | tag_id (FK)
```
Many-to-many junction table linking galleries to multiple tags.

### Users Table
```sql
id (UUID) | username | email | password_hash | role
created_at | updated_at
```
Admin user accounts with role-based access control.

---

## 🎨 UI/UX Design System

### Color Scheme
- **Primary Colors**: Customizable via CSS variables (HSL format)
- **Dark Mode**: Full dark mode support via CSS classes
- **Theme Variables**:
  - `--background`, `--foreground`
  - `--primary`, `--primary-foreground`
  - `--secondary`, `--secondary-foreground`
  - `--card`, `--card-foreground`
  - `--popover`, `--popover-foreground`
  - `--muted`, `--muted-foreground`
  - `--accent`, `--destructive`, etc.

### Typography
- **Font Family**: Inter (system font)
- **Responsive text scaling**: TailwindCSS breakpoints

### Responsive Design
- **Mobile-first approach** with Tailwind breakpoints
- **Mobile detection hook** (`use-mobile`) for adaptive layouts
- **Masonry and grid layouts** that adapt to screen size

### Component Library
- **60+ UI components** from Radix UI
- **Accessible by default** (ARIA attributes, keyboard navigation)
- **Customizable styling** via TailwindCSS utilities

---

## 🔑 Key Features

### 1. Content Browsing
- **Category Browsing**: Organized photography categories
- **Gallery Browsing**: Collections of related photos
- **Masonry Layout**: Pinterest-style photo grid
- **Detailed Views**: Individual photo details with metadata

### 2. Discovery & Search
- **Full-Text Search**: Search by gallery titles and descriptions
- **Tag Filtering**: Filter galleries by multiple tags
- **Trending Section**: Popular and trending photos
- **Category Filters**: Filter by photography categories

### 3. User Features
- **Photo Upload**: Non-persistent demo upload interface
- **Upload Preview**: Preview uploaded photos before "saving"
- **User Authentication**: Admin login system

### 4. Creator/Photographer Features
- **Creator Profiles**: Browse photographers and their work
- **Channel/Collections**: Organized content by creator
- **Featured Stars**: Showcase top photographers
- **View Metrics**: Track view counts and likes

### 5. Admin Features
- **Admin Dashboard**: Content management interface
- **Role-Based Access**: User roles (viewer, editor, admin)
- **Admin Authentication**: Secure login with password hashing
- **Content Moderation**: Manage galleries, categories, and tags

### 6. Data Management
- **Seeded Content**: Pre-populated sample data
- **Local Storage**: Client-side persistence of custom content
- **Database Queries**: Advanced search and filtering via PostgreSQL

---

## 🚀 Development & Build

### Development Workflow
```bash
# Frontend development
npm run dev          # Start Vite dev server (port 5173)
npm run build        # Build for production
npm run preview      # Preview built app
npm run lint         # Check code quality
npm run lint:fix     # Fix linting issues
npm run typecheck    # Type validation

# Backend development
npm run dev          # Start backend with auto-reload (port 5000)
npm run start        # Start backend
npm run db:init      # Initialize database schema
npm run db:seed      # Populate sample data
npm run migrate      # Run data migrations
```

### Environment Setup
**Frontend**: Vite dev server runs on `http://localhost:5173`
**Backend**: Express server runs on `http://localhost:5000` (configurable)
**Database**: PostgreSQL connection via `DATABASE_URL` env variable
**CORS**: Configured for development (`http://localhost:5173` → `http://localhost:5000`)

---

## 📁 Directory Structure

```
project-root/
├── src/                           # Frontend React app
│   ├── pages/                     # Page components
│   ├── components/                # Reusable components
│   │   └── ui/                    # Radix UI components
│   ├── hooks/                     # Custom React hooks
│   ├── lib/                       # Utilities and context
│   ├── services/                  # API service clients
│   ├── utils/                     # Helper functions
│   ├── App.jsx                    # Main app component
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles
│
├── server/                        # Backend Node.js/Express app
│   ├── routes/                    # API route definitions
│   ├── controllers/               # Route handlers and business logic
│   ├── db/                        # Database setup and seed data
│   ├── middleware/                # Express middleware
│   ├── models/                    # Data models
│   ├── utils/                     # Helper functions
│   ├── server.js                  # Express app entry point
│   └── package.json               # Backend dependencies
│
├── public/                        # Static assets
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # TailwindCSS configuration
├── postcss.config.js              # PostCSS configuration
├── eslint.config.js               # ESLint configuration
├── jsconfig.json                  # JavaScript/TypeScript config
├── index.html                     # HTML entry point
├── package.json                   # Frontend dependencies
└── README.md                      # Project documentation
```

---

## 🔐 Authentication & Authorization

### Admin Authentication
- **Login Page**: `/admin/login` for admin credential entry
- **Protected Routes**: Admin panel protected via `ProtectedRoute` component
- **Password Security**: Server-side password hashing (PostgreSQL)
- **Role-Based Access**: Three roles in database (viewer, editor, admin)
- **Session Management**: Context-based authentication state

### Security Features
- **CORS Protection**: Configurable cross-origin requests
- **Password Hashing**: Secure password storage in PostgreSQL
- **Protected Endpoints**: Backend route protection
- **Error Handling**: Global error handler middleware

---

## 🔄 Data Flow

### Client-Server Communication
1. **Frontend** sends HTTP requests to backend API
2. **Backend** (Express) routes requests to controllers
3. **Controllers** query PostgreSQL database
4. **Database** returns results
5. **Backend** sends JSON responses
6. **Frontend** (React Query) caches and displays data

### Local Data Management
- **localStorage**: Persists custom categories, galleries, photos
- **Storage Keys**: Namespaced keys for different data types
- **Sync Mechanism**: Ability to read/write to localStorage

---

## 📦 Dependencies Summary

### Frontend (18 Radix UI + Supporting Libraries)
- React Query for server state
- React Hook Form for form management
- Stripe for payments
- Hello Pangea for drag-and-drop
- TailwindCSS for styling

### Backend (Express + Database Stack)
- Express for routing
- PostgreSQL for persistence
- UUID for unique identifiers
- Multer for file uploads
- Dotenv for configuration

---

## 🎯 Seeded Data

The application comes with pre-populated content for demonstration:

### Categories
- Amateur, Lifestyle, Couples, Nature, Urban, Events, Products, etc.

### Galleries
- Multiple galleries per category with rich metadata
- Sample photographers and descriptions
- View counts, like counts, featured status

### Photos
- High-quality unsplash URLs
- Metadata (dimensions, alt text, ordering)
- Organized within gallery collections

### Tags & Creators
- Searchable tags for filtering
- Creator/photographer information
- Featured "stars" showcase

---

## 🛠️ Configuration

### Vite
- React plugin for JSX/TSX
- Path alias `@/` for `src/` directory
- Error-only logging

### TailwindCSS
- Dark mode support via `class` strategy
- Content scanning for `src/**/*.{ts,tsx,js,jsx}`
- Extended color system with CSS variables

### ESLint
- Code quality and consistency checks
- Auto-fixable formatting issues

### TypeScript/JSConfig
- Type safety across JavaScript files
- Path resolution for imports

### Express Server
- CORS enabled for frontend domain
- JSON/URL-encoded body parsing
- Health check endpoint
- Global error handling

---

## 🌐 API Endpoints

### Gallery Endpoints
- `GET /api/galleries` - List all galleries
- `GET /api/galleries/:id` - Get single gallery
- `POST /api/galleries` - Create gallery (admin)
- `PUT /api/galleries/:id` - Update gallery (admin)
- `DELETE /api/galleries/:id` - Delete gallery (admin)

### Category Endpoints
- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get single category

### Search Endpoints
- `GET /api/search` - Full-text search galleries
- `GET /api/tags` - List or search by tags

### System Endpoints
- `GET /health` - Health check

---

## 📈 Performance Optimizations

### Frontend
- **Code Splitting**: Vite handles automatic code splitting
- **Image Optimization**: Responsive images with proper formats
- **Lazy Loading**: React Router enables route-based code splitting
- **Caching**: React Query manages server data cache
- **Dark Mode**: CSS-based theme switching (no re-renders)

### Backend
- **Database Indexes**: Strategic indexes on frequently queried columns
- **Full-Text Search**: PostgreSQL GIN indexes for search performance
- **Connection Pooling**: Efficient database connection management
- **Error Handling**: Prevents unhandled crashes

### Database
- **Query Optimization**: Proper indexes and relationships
- **Cascading Deletes**: Prevents orphaned records
- **UUID Generation**: Server-side during creation

---

## 🚀 Deployment Considerations

### Frontend
- Build with `npm run build`
- Deploy to static hosting (Vercel, Netlify, AWS S3)
- Environment: Update API endpoint for production

### Backend
- Deploy Node.js server to cloud provider (Heroku, AWS, DigitalOcean)
- PostgreSQL hosted on managed service (AWS RDS, Heroku Postgres)
- Environment variables for production secrets
- CORS origin updated to frontend domain

---

## 📝 Future Enhancement Ideas

1. **Authentication Features**
   - Social login (OAuth)
   - User profiles and favorites
   - Photo ownership and permissions

2. **Advanced Search**
   - AI-powered image recognition
   - Similar image search
   - Advanced filtering UI

3. **Creator Tools**
   - Portfolio building
   - Analytics dashboard
   - Monetization options (licensing)

4. **Community Features**
   - Comments and ratings
   - Collections/pinboards
   - Sharing and social integration

5. **Performance**
   - Image CDN integration
   - Caching strategies
   - Database query optimization

6. **Admin Features**
   - Bulk import/export
   - Analytics dashboard
   - Content moderation tools

---

## 📞 Support & Maintenance

### Code Quality
- ESLint for code consistency
- TypeScript type checking
- Automated build process

### Development Commands
- Development: `npm run dev` (frontend), `npm run dev` (backend)
- Testing: `npm run lint`, `npm run typecheck`
- Building: `npm run build`

### Troubleshooting
- Clear browser cache for frontend changes
- Restart backend server for API changes
- Check database connection in `.env`
- Verify CORS settings for cross-origin issues

---

**Last Updated**: April 2026
**Version**: 0.0.0 (Development)
**License**: MIT
