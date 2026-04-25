const STORAGE_KEYS = {
  categories: "stockpics.custom.categories",
  channels: "stockpics.custom.channels",
  albums: "stockpics.custom.albums",
  stars: "stockpics.custom.stars",
  photos: "stockpics.custom.photos",
};

function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function titleize(value = "") {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function makeId(prefix, seed = "") {
  return `${prefix}-${slugify(seed || Math.random().toString(36).slice(2))}-${Math.random().toString(36).slice(2, 8)}`;
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readStoredArray(key) {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStoredArray(key, value) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

const seededCategories = [
  {
    id: "amateur",
    name: "Amateur",
    icon: "Sparkles",
    description: "Loose, documentary-style gallery drops with an intimate behind-the-scenes feel.",
    coverImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    icon: "SunMedium",
    description: "Daily moments, travel snapshots, and premium slice-of-life sets.",
    coverImage: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "couples",
    name: "Couples",
    icon: "HeartHandshake",
    description: "Soft chemistry, shared spaces, and relationship-led gallery stories.",
    coverImage: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: "Shirt",
    description: "Editorial styling, polished looks, and camera-aware pose direction.",
    coverImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "asian",
    name: "Asian",
    icon: "Globe2",
    description: "A regional discovery lane for creator-led portrait and lifestyle collections.",
    coverImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "mature",
    name: "Mature",
    icon: "Gem",
    description: "Elegant sets with calm pacing, richer styling, and premium framing.",
    coverImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "art",
    name: "Art",
    icon: "Palette",
    description: "Concept-led galleries with texture, abstraction, and mood-first composition.",
    coverImage: "https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "portraits",
    name: "Portraits",
    icon: "Camera",
    description: "Face-forward sets for covers, creator cards, and soft-studio profiles.",
    coverImage: "https://images.unsplash.com/photo-1526481280695-3c4691d1f038?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "fitness",
    name: "Fitness",
    icon: "Dumbbell",
    description: "Body-led motion, recovery rooms, and late-night training visuals.",
    coverImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
  },
];

const seededChannels = [
  {
    id: "midnight-club",
    slug: "midnight-club",
    name: "Midnight Club",
    description: "Nightlife-led galleries, reflective city scenes, and midnight editorial styling.",
    logoUrl: "https://images.unsplash.com/photo-1526481280695-3c4691d1f038?auto=format&fit=crop&w=300&q=80",
    website: "https://midnightclub.example.com",
    tags: ["nightlife", "neon", "portraits"],
  },
  {
    id: "suite-service",
    slug: "suite-service",
    name: "Suite Service",
    description: "Private suite shoots, mood lighting, and polished hotel interiors.",
    logoUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=300&q=80",
    website: "https://suiteservice.example.com",
    tags: ["lifestyle", "luxury", "mature"],
  },
  {
    id: "soft-focus",
    slug: "soft-focus",
    name: "Soft Focus",
    description: "Creator portrait galleries with beauty-led lighting and close framing.",
    logoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    website: "https://softfocus.example.com",
    tags: ["portrait", "fashion", "beauty"],
  },
  {
    id: "velvet-body",
    slug: "velvet-body",
    name: "Velvet Body",
    description: "Fitness and body-study channels with dramatic lighting and premium art direction.",
    logoUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=300&q=80",
    website: "https://velvetbody.example.com",
    tags: ["fitness", "art", "night"],
  },
  {
    id: "gold-room",
    slug: "gold-room",
    name: "Gold Room",
    description: "Luxury details, close-up beauty frames, and artful premium stills.",
    logoUrl: "https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&w=300&q=80",
    website: "https://goldroom.example.com",
    tags: ["art", "details", "premium"],
  },
  {
    id: "coastline-private",
    slug: "coastline-private",
    name: "Coastline Private",
    description: "Travel and resort channels with warm leisure energy and airy compositions.",
    logoUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80",
    website: "https://coastlineprivate.example.com",
    tags: ["travel", "lifestyle", "poolside"],
  },
];

const seededStars = [
  {
    id: "aria-vale",
    slug: "aria-vale",
    name: "Aria Vale",
    bio: "A neon-forward portrait lead with a polished city-night visual identity.",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    tags: ["fashion", "portrait", "nightlife"],
  },
  {
    id: "noah-luxe",
    slug: "noah-luxe",
    name: "Noah Luxe",
    bio: "Luxury suite and travel talent with a calm editorial rhythm.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    tags: ["mature", "lifestyle", "travel"],
  },
  {
    id: "mia-sol",
    slug: "mia-sol",
    name: "Mia Sol",
    bio: "Poolside, portrait, and wellness sets with bright premium energy.",
    avatarUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80",
    tags: ["asian", "portraits", "fitness"],
  },
];

const seededAlbums = [
  {
    id: "album-neon-checkin",
    slug: "neon-checkin",
    name: "Neon Check-In",
    description: "Late-night city portraits and high-gloss after-hours street style.",
    coverImage: "https://images.unsplash.com/photo-1526481280695-3c4691d1f038?auto=format&fit=crop&w=1200&q=80",
    channel: "midnight-club",
    star: "aria-vale",
  },
  {
    id: "album-suite-heat",
    slug: "suite-heat",
    name: "Suite Heat",
    description: "Private suite light, slow pacing, and a luxury lifestyle atmosphere.",
    coverImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    channel: "suite-service",
    star: "noah-luxe",
  },
  {
    id: "album-golden-hour-water",
    slug: "golden-hour-water",
    name: "Golden Hour Water",
    description: "Resort warmth, pool reflections, and premium getaway textures.",
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    channel: "coastline-private",
    star: "mia-sol",
  },
  {
    id: "album-soft-chemistry",
    slug: "soft-chemistry",
    name: "Soft Chemistry",
    description: "Couples-focused portrait sets with close framing and warm interior light.",
    coverImage: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80",
    channel: "soft-focus",
    star: "aria-vale",
  },
];

const seededPhotos = [
  {
    id: "photo-neon-arrival",
    title: "Neon Arrival",
    url: "https://images.unsplash.com/photo-1526481280695-3c4691d1f038?auto=format&fit=crop&w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1526481280695-3c4691d1f038?auto=format&fit=crop&w=480&q=70",
    category: "portraits",
    channel: "midnight-club",
    album: "neon-checkin",
    star: "aria-vale",
    photographer: "Selma Ortiz",
    tags: ["neon", "nightlife", "asian", "trending"],
    description: "A glossy city frame tuned for high-traffic portrait and nightlife discovery.",
    views: 27800,
    likes: 2240,
    featured: true,
    publishedAt: "2026-04-25",
  },
  {
    id: "photo-city-red",
    title: "City Red",
    url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=480&q=70",
    category: "fashion",
    channel: "midnight-club",
    album: "neon-checkin",
    star: "aria-vale",
    photographer: "Dion Price",
    tags: ["fashion", "night", "trending", "editorial"],
    description: "Fast-moving city fashion built for the top of the feed.",
    views: 18950,
    likes: 1452,
    publishedAt: "2026-04-17",
  },
  {
    id: "photo-window-glam",
    title: "Window Glam",
    url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=480&q=70",
    category: "asian",
    channel: "soft-focus",
    album: "soft-chemistry",
    star: "mia-sol",
    photographer: "Rafi Khan",
    tags: ["asian", "glam", "portraits", "featured"],
    description: "Soft studio glam with enough polish for hero placements and creator spotlights.",
    views: 22110,
    likes: 1768,
    featured: true,
    publishedAt: "2026-04-23",
  },
  {
    id: "photo-soft-profile",
    title: "Soft Profile",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=480&q=70",
    category: "amateur",
    channel: "soft-focus",
    album: "soft-chemistry",
    star: "mia-sol",
    photographer: "Hiba Cole",
    tags: ["amateur", "portrait", "creator", "recent"],
    description: "A close portrait set for creator archives and profile-led search results.",
    views: 15760,
    likes: 1208,
    publishedAt: "2026-04-16",
  },
  {
    id: "photo-couple-lounge",
    title: "Couple Lounge",
    url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=480&q=70",
    category: "couples",
    channel: "soft-focus",
    album: "soft-chemistry",
    star: "aria-vale",
    photographer: "Hiba Cole",
    tags: ["couples", "lifestyle", "warm", "featured"],
    description: "An intimate lounge set that gives the couples lane a richer emotional beat.",
    views: 19810,
    likes: 1688,
    featured: true,
    publishedAt: "2026-04-24",
  },
  {
    id: "photo-suite-silence",
    title: "Suite Silence",
    url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=480&q=70",
    category: "mature",
    channel: "suite-service",
    album: "suite-heat",
    star: "noah-luxe",
    photographer: "Noor Han",
    tags: ["mature", "luxury", "suite", "popular"],
    description: "A quiet luxury set designed for premium members-only and resort discovery pages.",
    views: 24320,
    likes: 1920,
    featured: true,
    publishedAt: "2026-04-24",
  },
  {
    id: "photo-candle-corner",
    title: "Candle Corner",
    url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80&sat=-10",
    thumbnailUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=480&q=70&sat=-10",
    category: "art",
    channel: "suite-service",
    album: "suite-heat",
    star: "aria-vale",
    photographer: "Noor Han",
    tags: ["art", "mood", "suite", "interior"],
    description: "Low-lit interior framing for artful suite and members-lounge narratives.",
    views: 13480,
    likes: 956,
    publishedAt: "2026-04-18",
  },
  {
    id: "photo-mirror-room",
    title: "Mirror Room",
    url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=480&q=70",
    category: "lifestyle",
    channel: "soft-focus",
    album: "suite-heat",
    star: "aria-vale",
    photographer: "Hiba Cole",
    tags: ["lifestyle", "creator", "studio", "popular"],
    description: "A creator-room setup for profile pages, behind-the-scenes archives, and search hits.",
    views: 19830,
    likes: 1488,
    featured: true,
    publishedAt: "2026-04-21",
  },
  {
    id: "photo-pool-heat",
    title: "Pool Heat",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=480&q=70",
    category: "lifestyle",
    channel: "coastline-private",
    album: "golden-hour-water",
    star: "mia-sol",
    photographer: "Jon Reyes",
    tags: ["lifestyle", "travel", "poolside", "trending"],
    description: "Resort-light leisure imagery with a polished premium-members tone.",
    views: 20540,
    likes: 1612,
    featured: true,
    publishedAt: "2026-04-22",
  },
  {
    id: "photo-balcony-weekend",
    title: "Balcony Weekend",
    url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=480&q=70",
    category: "lifestyle",
    channel: "coastline-private",
    album: "golden-hour-water",
    star: "noah-luxe",
    photographer: "Lina Sayegh",
    tags: ["lifestyle", "escape", "travel", "recent"],
    description: "Calm coastal light and premium pacing shaped for newest galleries rows.",
    views: 17220,
    likes: 1324,
    publishedAt: "2026-04-19",
  },
  {
    id: "photo-after-hours-run",
    title: "After Hours Run",
    url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=480&q=70",
    category: "fitness",
    channel: "velvet-body",
    album: "golden-hour-water",
    star: "noah-luxe",
    photographer: "Tariq Vale",
    tags: ["fitness", "night", "body", "trending"],
    description: "Body-led motion with a dramatic palette and strong performance metrics.",
    views: 26010,
    likes: 2124,
    featured: true,
    publishedAt: "2026-04-25",
  },
  {
    id: "photo-gold-bottle",
    title: "Gold Bottle",
    url: "https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&w=480&q=70",
    category: "art",
    channel: "gold-room",
    album: "suite-heat",
    star: "mia-sol",
    photographer: "Claire Yoon",
    tags: ["art", "beauty", "detail", "premium"],
    description: "Close-up styling for beauty and art lanes with a premium finish.",
    views: 14910,
    likes: 1088,
    publishedAt: "2026-04-20",
  },
];

export const DEMO_UPLOAD_PREVIEW_ID = "demo-preview";

function mergeById(base, extra, idField = "id") {
  const seen = new Set(base.map((item) => item[idField]));
  return [...base, ...extra.filter((item) => !seen.has(item[idField]))];
}

function sortByDateDesc(items, dateField = "publishedAt") {
  return [...items].sort((a, b) => new Date(b[dateField]).getTime() - new Date(a[dateField]).getTime());
}

function scoreGallery(item) {
  return Number(item.views || 0) + Number(item.likes || 0) * 10;
}

export function getCategories() {
  return mergeById(seededCategories, readStoredArray(STORAGE_KEYS.categories));
}

export function getChannels() {
  return mergeById(seededChannels, readStoredArray(STORAGE_KEYS.channels), "slug");
}

export function getStars() {
  return mergeById(seededStars, readStoredArray(STORAGE_KEYS.stars), "slug");
}

export function getAlbums() {
  return mergeById(seededAlbums, readStoredArray(STORAGE_KEYS.albums), "slug");
}

export function getPhotos() {
  return mergeById(seededPhotos, readStoredArray(STORAGE_KEYS.photos));
}

export function getCategoryById(categoryId) {
  return getCategories().find((category) => category.id === categoryId) ?? null;
}

export function getChannelBySlug(slug) {
  return getChannels().find((channel) => channel.slug === slug) ?? null;
}

export function getStarBySlug(slug) {
  return getStars().find((star) => star.slug === slug) ?? null;
}

export function getAlbumBySlug(slug) {
  return getAlbums().find((album) => album.slug === slug) ?? null;
}

export function getPhotoById(photoId) {
  return getPhotos().find((photo) => photo.id === photoId) ?? null;
}

export function getPhotosByCategory(categoryId) {
  return getPhotos().filter((photo) => photo.category === categoryId);
}

export function getPhotosByChannel(channelSlug) {
  return getPhotos().filter((photo) => photo.channel === channelSlug);
}

export function getPhotosByAlbum(albumSlug) {
  return getPhotos().filter((photo) => photo.album === albumSlug);
}

export function getPhotosByStar(starSlug) {
  return getPhotos().filter((photo) => photo.star === starSlug);
}

export function getFeaturedPhotos(limit = 8) {
  return getPhotos().filter((photo) => photo.featured).slice(0, limit);
}

export function getLatestPhotos(limit = 16) {
  return sortByDateDesc(getPhotos()).slice(0, limit);
}

export function getTrendingPhotos(limit = 16) {
  return [...getPhotos()].sort((a, b) => scoreGallery(b) - scoreGallery(a)).slice(0, limit);
}

export function getRelatedPhotos(photo, limit = 8) {
  if (!photo) return [];
  const tagSet = new Set(photo.tags || []);
  return getPhotos()
    .filter((candidate) => candidate.id !== photo.id)
    .map((candidate) => {
      let score = 0;
      if (candidate.category === photo.category) score += 3;
      if (candidate.channel === photo.channel) score += 2;
      if (candidate.album && candidate.album === photo.album) score += 2;
      if (candidate.star && candidate.star === photo.star) score += 2;
      score += (candidate.tags || []).filter((tag) => tagSet.has(tag)).length;
      return { candidate, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || scoreGallery(b.candidate) - scoreGallery(a.candidate))
    .slice(0, limit)
    .map((entry) => entry.candidate);
}

function buildTagEntries() {
  const tagMap = new Map();
  for (const photo of getPhotos()) {
    for (const rawTag of photo.tags || []) {
      const slug = slugify(rawTag);
      const current = tagMap.get(slug) ?? {
        slug,
        id: slug,
        name: titleize(slug),
        count: 0,
        galleryCount: 0,
        views: 0,
        likes: 0,
        coverImage: photo.url,
      };
      current.count += 1;
      current.galleryCount += 1;
      current.views += Number(photo.views || 0);
      current.likes += Number(photo.likes || 0);
      if (!current.coverImage) current.coverImage = photo.url;
      tagMap.set(slug, current);
    }
  }
  return [...tagMap.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function getTags() {
  return buildTagEntries();
}

export function getTagBySlug(tagSlug) {
  return getTags().find((tag) => tag.slug === tagSlug) ?? null;
}

export function getPhotosByTag(tagSlug) {
  return getPhotos().filter((photo) => (photo.tags || []).some((tag) => slugify(tag) === tagSlug));
}

export function searchPhotos(query) {
  const value = query.trim().toLowerCase();
  if (!value) return [];

  return getPhotos().filter((photo) => {
    const category = getCategoryById(photo.category);
    const channel = getChannelBySlug(photo.channel);
    const album = getAlbumBySlug(photo.album);
    const star = getStarBySlug(photo.star);

    return [
      photo.title,
      photo.photographer,
      photo.description,
      category?.name ?? "",
      channel?.name ?? "",
      album?.name ?? "",
      star?.name ?? "",
      ...(photo.tags ?? []),
      ...(channel?.tags ?? []),
      ...(star?.tags ?? []),
    ]
      .join(" ")
      .toLowerCase()
      .includes(value);
  });
}

export function getFeaturedChannels(limit = 4) {
  return getChannels()
    .map((channel) => ({
      ...channel,
      count: getPhotosByChannel(channel.slug).length,
      preview: getPhotosByChannel(channel.slug)[0] ?? null,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function getFeaturedCreators(limit = 6) {
  return getCreatorSummaries().slice(0, limit);
}

export function getFeaturedStars(limit = 5) {
  return getStars()
    .map((star) => ({
      ...star,
      count: getPhotosByStar(star.slug).length,
      preview: getPhotosByStar(star.slug)[0] ?? null,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function getFeaturedAlbums(limit = 5) {
  return getAlbums()
    .map((album) => ({
      ...album,
      count: getPhotosByAlbum(album.slug).length,
      preview: getPhotosByAlbum(album.slug)[0] ?? null,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function getPrimaryNicheLabel(...values) {
  for (const value of values) {
    if (Array.isArray(value) && value.length) {
      return titleize(slugify(value[0])) || value[0];
    }

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "Featured";
}

export function getCategoryRepresentativeImage(category) {
  return category?.thumbnailUrl || category?.coverImage || category?.preview?.thumbnailUrl || category?.preview?.url || "";
}

export function getChannelRepresentativeImage(channel) {
  return channel?.thumbnailUrl || channel?.logoUrl || channel?.preview?.thumbnailUrl || channel?.preview?.url || "";
}

export function getStarRepresentativeImage(star) {
  return star?.thumbnailUrl || star?.avatarUrl || star?.preview?.thumbnailUrl || star?.preview?.url || "";
}

export function getAlbumRepresentativeImage(album) {
  return album?.thumbnailUrl || album?.coverImage || album?.preview?.thumbnailUrl || album?.preview?.url || "";
}

export function getCategorySummaries() {
  return getCategories()
    .map((category) => {
      const categoryPhotos = getPhotosByCategory(category.id);
      return {
        ...category,
        count: categoryPhotos.length,
        views: categoryPhotos.reduce((sum, photo) => sum + Number(photo.views || 0), 0),
        preview: categoryPhotos[0] ?? null,
      };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getChannelSummaries() {
  return getChannels()
    .map((channel) => {
      const channelPhotos = getPhotosByChannel(channel.slug);
      return {
        ...channel,
        count: channelPhotos.length,
        views: channelPhotos.reduce((sum, photo) => sum + Number(photo.views || 0), 0),
        preview: channelPhotos[0] ?? null,
      };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getStarSummaries() {
  return getStars()
    .map((star) => {
      const starPhotos = getPhotosByStar(star.slug);
      return {
        ...star,
        count: starPhotos.length,
        views: starPhotos.reduce((sum, photo) => sum + Number(photo.views || 0), 0),
        preview: starPhotos[0] ?? null,
      };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getAlbumSummaries() {
  return getAlbums()
    .map((album) => {
      const albumPhotos = getPhotosByAlbum(album.slug);
      return {
        ...album,
        count: albumPhotos.length,
        views: albumPhotos.reduce((sum, photo) => sum + Number(photo.views || 0), 0),
        preview: albumPhotos[0] ?? null,
      };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getCreatorSummaries() {
  const entries = new Map();

  for (const photo of getPhotos()) {
    const slug = slugify(photo.photographer);
    const current = entries.get(slug) ?? {
      id: slug,
      slug,
      name: photo.photographer,
      count: 0,
      likes: 0,
      views: 0,
      heroPhoto: photo,
      tags: new Set(),
    };
    current.count += 1;
    current.likes += Number(photo.likes || 0);
    current.views += Number(photo.views || 0);
    if (photo.featured || scoreGallery(photo) > scoreGallery(current.heroPhoto || {})) {
      current.heroPhoto = photo;
    }
    for (const tag of photo.tags || []) current.tags.add(tag);
    entries.set(slug, current);
  }

  return [...entries.values()]
    .map((creator) => ({
      ...creator,
      tags: [...creator.tags].slice(0, 4),
    }))
    .sort((a, b) => b.count - a.count || b.views + b.likes - (a.views + a.likes));
}

export function getGalleryById(photoId) {
  const photo = getPhotoById(photoId);
  if (!photo) return null;

  const album = getAlbumBySlug(photo.album);
  const channel = getChannelBySlug(photo.channel);
  const star = getStarBySlug(photo.star);
  const category = getCategoryById(photo.category);
  const images = getPhotosByAlbum(photo.album);

  return {
    ...photo,
    album,
    channelMeta: channel,
    starMeta: star,
    categoryMeta: category,
    images: images.length ? images : [photo],
  };
}

export function getHeroGalleries(limit = 4) {
  return getTrendingPhotos(limit);
}

export function getPopularGalleries(limit = 12) {
  return getTrendingPhotos(limit);
}

export function getNewestGalleries(limit = 12) {
  return getLatestPhotos(limit);
}

export function getTrendingGalleries(limit = 12) {
  return getTrendingPhotos(limit);
}

export function getTopCategoryTiles(limit = 9) {
  return getCategorySummaries().slice(0, limit);
}

export function getMixedDiscoveryFeed() {
  const galleryCards = getPhotos()
    .map((photo) => ({
      id: `gallery-${photo.id}`,
      entityId: photo.id,
      type: "gallery",
      href: `/photo/${photo.id}`,
      title: photo.title,
      subtitle: photo.photographer || "Gallery",
      image: photo.thumbnailUrl || photo.url,
      count: null,
      niche: getPrimaryNicheLabel(photo.tags, getCategoryById(photo.category)?.name),
      meta: `${photo.views || 0} views`,
      score: scoreGallery(photo) + 100,
    }))
    .filter((item) => item.image);

  const starCards = getStarSummaries()
    .map((star) => ({
      id: `star-${star.slug}`,
      entityId: star.slug,
      type: "star",
      href: `/search?q=${encodeURIComponent(star.name)}`,
      title: star.name,
      subtitle: `${star.count} galleries`,
      image: getStarRepresentativeImage(star),
      count: star.count,
      niche: getPrimaryNicheLabel(star.tags, star.preview?.tags, "Star"),
      meta: `${star.views || 0} views`,
      score: Number(star.views || 0) + Number(star.count || 0) * 40,
    }))
    .filter((item) => item.image);

  const channelCards = getChannelSummaries()
    .map((channel) => ({
      id: `channel-${channel.slug}`,
      entityId: channel.slug,
      type: "channel",
      href: `/channels/${channel.slug}`,
      title: channel.name,
      subtitle: channel.description,
      image: getChannelRepresentativeImage(channel),
      count: channel.count,
      niche: getPrimaryNicheLabel(channel.tags, channel.preview?.tags, "Channel"),
      meta: `${channel.count} galleries`,
      score: Number(channel.views || 0) + Number(channel.count || 0) * 50,
    }))
    .filter((item) => item.image);

  const categoryCards = getCategorySummaries()
    .map((category) => ({
      id: `category-${category.id}`,
      entityId: category.id,
      type: "category",
      href: `/category/${category.id}`,
      title: category.name,
      subtitle: category.description,
      image: getCategoryRepresentativeImage(category),
      count: category.count,
      niche: getPrimaryNicheLabel(category.preview?.tags, category.name),
      meta: `${category.count} galleries`,
      score: Number(category.views || 0) + Number(category.count || 0) * 50,
    }))
    .filter((item) => item.image);

  const buckets = [
    [...galleryCards].sort((a, b) => b.score - a.score),
    [...starCards].sort((a, b) => b.score - a.score),
    [...channelCards].sort((a, b) => b.score - a.score),
    [...categoryCards].sort((a, b) => b.score - a.score),
  ];
  const mixed = [];
  let hasItems = true;

  while (hasItems) {
    hasItems = false;

    for (const bucket of buckets) {
      if (bucket.length) {
        mixed.push(bucket.shift());
        hasItems = true;
      }
    }
  }

  return mixed;
}

export function searchCatalog(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return { galleries: [], tags: [], creators: [], channels: [] };
  }

  const includes = (value) => value.toLowerCase().includes(normalized);

  const galleries = searchPhotos(query).sort((a, b) => scoreGallery(b) - scoreGallery(a));
  const tags = getTags()
    .filter((tag) => includes(tag.name))
    .sort((a, b) => b.galleryCount - a.galleryCount)
    .slice(0, 18);
  const creators = getCreatorSummaries()
    .filter((creator) => includes(creator.name) || creator.tags.some((tag) => includes(tag)))
    .slice(0, 18);
  const channels = getChannelSummaries()
    .filter((channel) => includes(channel.name) || includes(channel.description) || channel.tags.some((tag) => includes(tag)))
    .slice(0, 18);

  return { galleries, tags, creators, channels };
}

export function createCategory(input) {
  const next = {
    id: input.id || slugify(input.name),
    name: input.name,
    icon: input.icon || "Dot",
    description: input.description || "Custom category",
    coverImage: input.coverImage || input.logoUrl || seededCategories[0].coverImage,
    thumbnailUrl: input.thumbnailUrl || input.coverImage || input.logoUrl || seededCategories[0].coverImage,
    custom: true,
  };
  const items = readStoredArray(STORAGE_KEYS.categories);
  writeStoredArray(STORAGE_KEYS.categories, mergeById(items, [next]));
  return next;
}

export function createChannel(input) {
  const next = {
    id: input.id || makeId("channel", input.name),
    slug: input.slug || slugify(input.name),
    name: input.name,
    description: input.description || "Custom channel",
    logoUrl: input.logoUrl || seededChannels[0].logoUrl,
    thumbnailUrl: input.thumbnailUrl || input.logoUrl || seededChannels[0].logoUrl,
    website: input.website || "",
    tags: input.tags || [],
    custom: true,
  };
  const items = readStoredArray(STORAGE_KEYS.channels);
  writeStoredArray(STORAGE_KEYS.channels, mergeById(items, [next], "slug"));
  return next;
}

export function createAlbum(input) {
  const next = {
    id: input.id || makeId("album", input.name),
    slug: input.slug || slugify(input.name),
    name: input.name,
    description: input.description || "Custom album",
    coverImage: input.coverImage || seededAlbums[0].coverImage,
    thumbnailUrl: input.thumbnailUrl || input.coverImage || seededAlbums[0].coverImage,
    channel: input.channel || "",
    star: input.star || "",
    custom: true,
  };
  const items = readStoredArray(STORAGE_KEYS.albums);
  writeStoredArray(STORAGE_KEYS.albums, mergeById(items, [next], "slug"));
  return next;
}

export function createStar(input) {
  const next = {
    id: input.id || makeId("star", input.name),
    slug: input.slug || slugify(input.name),
    name: input.name,
    bio: input.bio || "Custom star profile",
    avatarUrl: input.avatarUrl || seededStars[0].avatarUrl,
    thumbnailUrl: input.thumbnailUrl || input.avatarUrl || seededStars[0].avatarUrl,
    tags: input.tags || [],
    custom: true,
  };
  const items = readStoredArray(STORAGE_KEYS.stars);
  writeStoredArray(STORAGE_KEYS.stars, mergeById(items, [next], "slug"));
  return next;
}

export function createPhotoEntry(input) {
  const next = {
    id: input.id || makeId("photo", input.title || "custom"),
    title: input.title || "Untitled",
    url: input.url,
    thumbnailUrl: input.thumbnailUrl || input.url,
    category: input.category,
    channel: input.channel,
    album: input.album || "",
    star: input.star || "",
    photographer: input.photographer || "Guest creator",
    tags: input.tags || [],
    description: input.description || "",
    views: input.views ?? 0,
    likes: input.likes ?? 0,
    featured: !!input.featured,
    publishedAt: input.publishedAt || new Date().toISOString().slice(0, 10),
    sourceType: input.sourceType || "embed",
    custom: true,
  };
  const items = readStoredArray(STORAGE_KEYS.photos);
  writeStoredArray(STORAGE_KEYS.photos, mergeById(items, [next]));
  return next;
}

export function createBulkEmbeddedPhotos(items) {
  const existing = readStoredArray(STORAGE_KEYS.photos);
  const created = items.map((input) => ({
    id: input.id || makeId("photo", input.title || "custom"),
    title: input.title || "Untitled",
    url: input.url,
    thumbnailUrl: input.thumbnailUrl || input.url,
    category: input.category,
    channel: input.channel,
    album: input.album || "",
    star: input.star || "",
    photographer: input.photographer || "Guest creator",
    tags: input.tags || [],
    description: input.description || "",
    views: input.views ?? 0,
    likes: input.likes ?? 0,
    featured: !!input.featured,
    publishedAt: input.publishedAt || new Date().toISOString().slice(0, 10),
    sourceType: input.sourceType || "embed",
    custom: true,
  }));
  writeStoredArray(STORAGE_KEYS.photos, mergeById(existing, created));
  return created;
}

export function createDemoPreview(overrides = {}) {
  return {
    id: overrides.id || DEMO_UPLOAD_PREVIEW_ID,
    title: overrides.title || "Untitled Preview",
    url: overrides.url || seededPhotos[0].url,
    thumbnailUrl: overrides.thumbnailUrl || overrides.url || seededPhotos[0].thumbnailUrl,
    category: overrides.category || seededCategories[0].id,
    channel: overrides.channel || seededChannels[0].slug,
    album: overrides.album || seededAlbums[0].slug,
    star: overrides.star || seededStars[0].slug,
    photographer: overrides.photographer || "Guest creator",
    tags: overrides.tags || ["preview", "gallery"],
    description: overrides.description || "Temporary local preview.",
    views: 0,
    likes: 0,
    featured: false,
    publishedAt: new Date().toISOString().slice(0, 10),
    demoNotice: "Local-only preview. No backend is involved.",
    custom: true,
  };
}
