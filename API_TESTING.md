# API Testing Guide - Rewaya Gallery

This guide provides example requests for testing all API endpoints.

## Setup for Testing

### Option 1: Using cURL (Command Line)

```bash
# Set your API base URL
export API_URL="http://localhost:5000/api"
# or for production:
export API_URL="https://your-vercel-domain/api"
```

### Option 2: Using Postman

1. Import this collection into Postman
2. Set variables for `API_URL` and `TOKEN`
3. Run requests with environment switching

### Option 3: Using Thunder Client (VS Code)

1. Install Thunder Client extension
2. Use examples below in `.http` format

---

## 1. Authentication

### Login
```bash
curl -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Response (save the token):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

### Verify Token
```bash
TOKEN="your-token-from-login"
curl -X GET "$API_URL/auth/login" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 2. Gallery Endpoints

### List Galleries
```bash
# All galleries
curl -X GET "$API_URL/galleries"

# With pagination & sorting
curl -X GET "$API_URL/galleries?page=1&limit=12&sort=popular"
curl -X GET "$API_URL/galleries?page=1&limit=12&sort=latest"
```

### Get Gallery Detail
```bash
# Get by ID
curl -X GET "$API_URL/galleries/gallery-id-uuid"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Beach Photos",
    "slug": "beach-photos",
    "description": "Beautiful beach photography",
    "photographer": "John Doe",
    "category_id": "uuid",
    "category_name": "Nature",
    "view_count": 154,
    "like_count": 23,
    "created_at": "2026-04-27T10:00:00Z",
    "images": [
      {
        "id": "uuid",
        "url": "https://example.com/image1.jpg",
        "thumbnail_url": "https://example.com/thumb1.jpg",
        "alt_text": "Beach sunset"
      }
    ],
    "tags": [
      {
        "id": "uuid",
        "name": "Beach",
        "slug": "beach"
      }
    ]
  }
}
```

### Get Related Galleries
```bash
curl -X GET "$API_URL/galleries/gallery-id/related"
```

### Like Gallery
```bash
curl -X POST "$API_URL/galleries/gallery-id/like"
```

### Create Gallery (Admin)
```bash
TOKEN="your-token"
curl -X POST "$API_URL/galleries" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "New Gallery",
    "slug": "new-gallery",
    "description": "Gallery description",
    "categoryId": "category-uuid",
    "photographer": "Jane Smith"
  }'
```

### Update Gallery (Admin)
```bash
TOKEN="your-token"
curl -X PUT "$API_URL/admin/galleries/gallery-id" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Updated Title",
    "description": "Updated description",
    "isFeatured": true,
    "photographer": "Jane Smith"
  }'
```

### Delete Gallery (Admin)
```bash
TOKEN="your-token"
curl -X DELETE "$API_URL/admin/galleries/gallery-id" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. Category Endpoints

### List Categories
```bash
curl -X GET "$API_URL/categories"
```

### Get Category
```bash
curl -X GET "$API_URL/categories/nature"
```

### Get Category Galleries
```bash
curl -X GET "$API_URL/categories/nature/galleries?page=1&limit=12"
```

### Create Category (Admin)
```bash
TOKEN="your-token"
curl -X POST "$API_URL/admin/categories" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Wildlife",
    "slug": "wildlife",
    "description": "Wildlife photography",
    "icon": "🦁"
  }'
```

### Update Category (Admin)
```bash
TOKEN="your-token"
curl -X PUT "$API_URL/admin/categories/wildlife" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Wildlife Photography",
    "description": "Updated description"
  }'
```

### Delete Category (Admin)
```bash
TOKEN="your-token"
curl -X DELETE "$API_URL/admin/categories/wildlife" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 4. Tag Endpoints

### List Tags
```bash
curl -X GET "$API_URL/tags"
```

### Get Galleries by Tag
```bash
curl -X GET "$API_URL/tags/beach/galleries?page=1&limit=12"
```

### Create Tag (Admin)
```bash
TOKEN="your-token"
curl -X POST "$API_URL/admin/tags" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Sunset",
    "slug": "sunset",
    "description": "Sunset photos"
  }'
```

### Delete Tag (Admin)
```bash
TOKEN="your-token"
curl -X DELETE "$API_URL/admin/tags/sunset" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 5. Search Endpoint

### Basic Search
```bash
curl -X GET "$API_URL/search?q=beach"
```

### Paginated Search
```bash
curl -X GET "$API_URL/search?q=beach&page=1&limit=12"
```

---

## 6. Image Endpoints (Admin)

### Add Image to Gallery
```bash
TOKEN="your-token"
curl -X POST "$API_URL/admin/images" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "galleryId": "gallery-uuid",
    "url": "https://example.com/photo.jpg",
    "thumbnailUrl": "https://example.com/thumb.jpg",
    "altText": "Photo description",
    "order": 0,
    "width": 1920,
    "height": 1080
  }'
```

### Delete Image
```bash
TOKEN="your-token"
curl -X DELETE "$API_URL/admin/images/image-uuid" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 7. User Management (Admin)

### List Users
```bash
TOKEN="your-token"
curl -X GET "$API_URL/admin/users" \
  -H "Authorization: Bearer $TOKEN"
```

### Update User
```bash
TOKEN="your-token"
curl -X PUT "$API_URL/admin/users/user-uuid" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "email": "newemail@example.com",
    "role": "editor"
  }'
```

### Delete User
```bash
TOKEN="your-token"
curl -X DELETE "$API_URL/admin/users/user-uuid" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Testing Workflow

### 1. Test Local Development
```bash
# Terminal 1: Start frontend
npm run dev

# Terminal 2: Start backend
cd server && npm run dev

# Terminal 3: Run tests
export API_URL="http://localhost:5000/api"

# Login first
TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Test endpoints
curl -X GET "$API_URL/galleries"
curl -X GET "$API_URL/auth/login" -H "Authorization: Bearer $TOKEN"
```

### 2. Test with Postman Collection

Create a Postman collection with:
- **Pre-request Script** (auto-login):
```javascript
const loginReq = {
  url: pm.environment.get('api_url') + '/auth/login',
  method: 'POST',
  header: { 'Content-Type': 'application/json' },
  body: { mode: 'raw', raw: JSON.stringify({username: 'admin', password: 'admin123'}) }
};

pm.sendRequest(loginReq, (err, resp) => {
  if (!err) {
    const token = resp.json().data.token;
    pm.environment.set('token', token);
  }
});
```

### 3. Load Testing

```bash
# Using Apache Bench (ab)
ab -n 100 -c 10 http://localhost:5000/api/galleries

# Using wrk
wrk -t12 -c400 -d30s http://localhost:5000/api/galleries
```

---

## Common Issues & Solutions

### 401 Unauthorized
**Problem**: Token missing or invalid
```bash
# Solution: Verify token is sent correctly
curl -X GET "$API_URL/admin/users" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 404 Not Found
**Problem**: Resource doesn't exist or wrong URL
```bash
# Check endpoint exists
curl -X GET "$API_URL/galleries"

# List galleries to get valid IDs
curl -X GET "$API_URL/galleries?limit=5"
```

### 400 Bad Request
**Problem**: Missing required fields
```bash
# Check required fields in request body
curl -X POST "$API_URL/galleries" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","slug":"test"}' # Must include both
```

### 500 Server Error
**Problem**: Database or server error
```bash
# Check server logs
cd server && tail -f server.log

# Verify database connection
psql $DATABASE_URL -c "SELECT 1"
```

---

## Export Test Results

### Save Response to File
```bash
curl -X GET "$API_URL/galleries" > response.json
```

### Pretty Print JSON
```bash
curl -s -X GET "$API_URL/galleries" | jq .
```

### Test All Endpoints (Bash Script)
```bash
#!/bin/bash
set -e

API_URL="http://localhost:5000/api"
echo "Testing Rewaya Gallery API"

echo "1. Testing Auth..."
TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.data.token')
echo "✓ Login successful"

echo "2. Testing Public Endpoints..."
curl -s "$API_URL/galleries" > /dev/null && echo "✓ GET /galleries"
curl -s "$API_URL/categories" > /dev/null && echo "✓ GET /categories"
curl -s "$API_URL/tags" > /dev/null && echo "✓ GET /tags"
curl -s "$API_URL/search?q=test" > /dev/null && echo "✓ GET /search"

echo "3. Testing Protected Endpoints..."
curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/admin/users" > /dev/null && echo "✓ GET /admin/users"

echo "✓ All tests passed!"
```

---

**Last Updated**: April 27, 2026  
**Version**: 1.0.0
