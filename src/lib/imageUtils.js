const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|avi|mkv)$/i;
const VIDEO_HOSTS = ["youtube.com", "youtu.be", "vimeo.com"];
const DIRECT_SERVE_HOSTS = ["imx.to", "imgur.com", "imgbox.com", "postimg.cc", "ibb.co"];

export function isVideo(url = "") {
  if (!url) return false;
  return VIDEO_EXTENSIONS.test(url.split("?")[0]) || VIDEO_HOSTS.some((host) => url.includes(host));
}

export function shouldBypassProxy(url = "") {
  if (!url) return false;
  // Bypass proxy for domains that serve images directly without CDN issues
  return DIRECT_SERVE_HOSTS.some((host) => url.includes(host));
}

export function optimizeImageUrl(url, width = 900, quality = 82) {
  if (!url || isVideo(url) || url.includes("blob:") || url.startsWith("data:")) return url;
  if (url.includes("images.weserv.nl")) return url;
  
  // For domains that work better without CDN proxy, serve them directly
  if (shouldBypassProxy(url)) return url;
  
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=${width}&q=${quality}&output=webp`;
}

export function getFastImageUrl(image, width = 1200, quality = 80) {
  const source = image?.thumbnailUrl || image?.thumbnail_url || image?.url || "";
  return optimizeImageUrl(source, width, quality);
}

export function getOriginalImageUrl(image) {
  return image?.url || image?.thumbnailUrl || image?.thumbnail_url || "";
}
