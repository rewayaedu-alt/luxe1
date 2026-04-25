export function getGalleryPrimaryImage(gallery) {
  if (!gallery) return null;

  if (gallery.thumbnailUrl || gallery.url) {
    return {
      url: gallery.url,
      thumbnailUrl: gallery.thumbnailUrl || gallery.url,
      alt: gallery.title || "Gallery image",
      width: gallery.width,
      height: gallery.height,
    };
  }

  const firstImage = Array.isArray(gallery.images) ? gallery.images[0] : null;
  if (!firstImage) return null;

  return {
    url: firstImage.url,
    thumbnailUrl: firstImage.thumbnail_url || firstImage.thumbnailUrl || firstImage.url,
    alt: firstImage.alt_text || firstImage.altText || gallery.title || "Gallery image",
    width: firstImage.width,
    height: firstImage.height,
  };
}

export function normalizeGalleryStats(gallery) {
  return {
    views: gallery?.views ?? gallery?.view_count ?? 0,
    likes: gallery?.likes ?? gallery?.like_count ?? 0,
  };
}

export function shuffleList(items = []) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}
