# StockPics

StockPics is a local-first demo gallery for browsing modern stock photography. The app uses seeded in-repo content for categories, channels, and photos, with no Base44, auth, or backend dependency.

## Run locally

1. Install dependencies with `npm install`
2. Start development with `npm run dev`
3. Build the app with `npm run build`
4. Lint the project with `npm run lint`

## What is in the app

- A browsing-first home page with featured creators, channels, category strips, and masonry galleries
- Local category and channel detail pages with deterministic seeded content
- Search and trending views powered by local selectors
- A non-persistent upload demo that previews submissions without saving data

## Data source

The seeded catalog lives in `src/lib/content.js` and is the single source of truth for:

- `categories`
- `channels`
- `photos`
- featured, latest, trending, related, and search selectors
