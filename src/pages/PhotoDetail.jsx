import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Copy, Eye, Heart, Images, Share2, Star } from "lucide-react";
import DirectoryHeader from "../components/DirectoryHeader";
import FilterChips from "../components/FilterChips";
import GalleryGrid from "../components/GalleryGrid";
import { getGalleryById as getLocalGalleryById, getRelatedPhotos } from "../lib/content";
import { getGalleryPrimaryImage, normalizeGalleryStats } from "../lib/galleryUtils";
import { getOriginalImageUrl, optimizeImageUrl } from "../lib/imageUtils";
import { galleryApi } from "../services/galleryApi";

function formatCount(value) {
  return new Intl.NumberFormat("en-US", {
    notation: Number(value || 0) >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(Number(value || 0));
}

export default function PhotoDetail() {
  const { photoId } = useParams();
  const [gallery, setGallery] = useState(null);
  const [relatedPhotos, setRelatedPhotos] = useState([]);
  const [status, setStatus] = useState("loading");
  const [source, setSource] = useState("api");
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
    setLightboxOpen(false);
  }, [photoId]);

  useEffect(() => {
    let active = true;

    const loadGallery = async () => {
      setStatus("loading");

      try {
        const [galleryData, relatedData] = await Promise.all([
          galleryApi.getGalleryById(photoId),
          galleryApi.getRelatedGalleries(photoId).catch(() => ({ galleries: [] })),
        ]);

        if (!active) return;
        setGallery(galleryData);
        setRelatedPhotos(relatedData.galleries || []);
        setSource("api");
        setStatus("ready");
      } catch {
        if (!active) return;
        const localGallery = getLocalGalleryById(photoId);
        if (!localGallery) {
          setStatus("error");
          return;
        }
        setGallery(localGallery);
        setRelatedPhotos(getRelatedPhotos(localGallery, 8));
        setSource("local");
        setStatus("ready");
      }
    };

    loadGallery();
    return () => {
      active = false;
    };
  }, [photoId]);

  const images = useMemo(
    () =>
      Array.isArray(gallery?.images)
        ? gallery.images.map((image, index) => ({
            id: image.id ?? `${gallery.id}-image-${index}`,
            url: image.url,
            thumbnailUrl: image.thumbnail_url || image.thumbnailUrl || image.url,
            title: image.alt_text || image.altText || gallery.title,
          }))
        : [],
    [gallery]
  );

  const activeImage = images[activeIndex] || getGalleryPrimaryImage(gallery);
  const { views, likes } = normalizeGalleryStats(gallery);

  useEffect(() => {
    if (!lightboxOpen || !images.length) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowRight") setActiveIndex((current) => (current + 1) % images.length);
      if (event.key === "ArrowLeft") setActiveIndex((current) => (current - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length, lightboxOpen]);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6">
        <div className="mb-6 h-8 w-2/3 animate-pulse rounded bg-white/[0.06]" />
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="aspect-video animate-pulse rounded-lg bg-white/[0.06]" />
          ))}
        </div>
      </div>
    );
  }

  if (status === "error" || !gallery) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-white">Gallery not found</h1>
        <Link to="/" className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Back
        </Link>
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : `/photo/${gallery.id}`;
  const metadataLinks = [];

  if (source === "local" && gallery.categoryMeta?.name) {
    metadataLinks.push({ id: "category", label: "Category", value: gallery.categoryMeta.name, href: `/category/${gallery.categoryMeta.id}` });
  } else if (gallery.category_name) {
    metadataLinks.push({ id: "category", label: "Category", value: gallery.category_name });
  }
  if (source === "local" && gallery.channelMeta?.name) {
    metadataLinks.push({ id: "channel", label: "Channel", value: gallery.channelMeta.name, href: `/channels/${gallery.channelMeta.slug}` });
  }
  if (source === "local" && gallery.starMeta?.name) {
    metadataLinks.push({ id: "star", label: "Star", value: gallery.starMeta.name, href: `/stars/${gallery.starMeta.slug}` });
  }
  if (gallery.photographer) {
    metadataLinks.push({ id: "creator", label: "Creator", value: gallery.photographer, href: `/creators/${gallery.photographer.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` });
  }

  const tagLinks = (gallery.tags || []).map((tag) => {
    const tagName = typeof tag === "string" ? tag : tag.name;
    const tagSlug = typeof tag === "string" ? tag.toLowerCase().replace(/[^a-z0-9]+/g, "-") : tag.slug;
    return { id: tagSlug || tagName, name: tagName, href: `/tags/${tagSlug}` };
  });

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: gallery.title, url: shareUrl });
      return;
    }
    await navigator.clipboard.writeText(shareUrl);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-3 py-4 sm:px-4 sm:py-6">
      <DirectoryHeader
        eyebrow="Gallery"
        title={gallery.title}
        count={images.length}
        description={gallery.description || gallery.photographer}
        actions={
          <>
            <button type="button" onClick={handleShare} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90">
              <Share2 className="mr-2 inline h-4 w-4" />
              Share
            </button>
            <button type="button" onClick={handleCopy} className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/25">
              <Copy className="mr-2 inline h-4 w-4" />
              Copy link
            </button>
          </>
        }
      />

      <section>
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => {
                setActiveIndex(index);
                setLightboxOpen(true);
              }}
              className="group relative mb-4 block w-full overflow-hidden rounded-lg border border-white/10 bg-white/5 transition hover:border-white/30"
            >
              <img
                src={optimizeImageUrl(image.thumbnailUrl || image.url, 500)}
                alt={image.title}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/20" />
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Stats</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1rem] border border-white/8 bg-white/3 px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Views</div>
              <div className="mt-1 flex items-center gap-2 text-lg font-semibold text-white">
                <Eye className="h-4 w-4 text-primary" />
                {formatCount(views)}
              </div>
            </div>
            <div className="rounded-[1rem] border border-white/8 bg-white/3 px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Likes</div>
              <div className="mt-1 flex items-center gap-2 text-lg font-semibold text-white">
                <Heart className="h-4 w-4 text-primary" />
                {formatCount(likes)}
              </div>
            </div>
            <div className="rounded-[1rem] border border-white/8 bg-white/3 px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Frames</div>
              <div className="mt-1 flex items-center gap-2 text-lg font-semibold text-white">
                <Images className="h-4 w-4 text-primary" />
                {images.length}
              </div>
            </div>
            <div className="rounded-[1rem] border border-white/8 bg-white/3 px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Rating</div>
              <div className="mt-1 flex items-center gap-2 text-lg font-semibold text-white">
                <Star className="h-4 w-4 text-primary" />
                100%
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5 rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Directory fields</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {metadataLinks.map((item) => (
                <div key={item.id} className="rounded-[1rem] border border-white/8 bg-white/3 px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{item.label}</div>
                  {item.href ? (
                    <Link to={item.href} className="mt-2 block text-sm font-semibold text-white transition hover:text-primary">
                      {item.value}
                    </Link>
                  ) : (
                    <div className="mt-2 text-sm font-semibold text-white">{item.value}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Tags</p>
            <div className="mt-3">
              <FilterChips items={tagLinks} emptyCopy="No tags attached to this gallery." />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 border-t border-white/10 pt-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Related galleries</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">Keep browsing nearby lanes</h2>
        </div>
        <GalleryGrid photos={relatedPhotos} emptyTitle="No related galleries" emptyCopy="Nothing similar yet." />
      </section>

      {lightboxOpen ? (
        <div className="fixed inset-0 z-[70] bg-black/95 px-3 py-4 sm:px-6 sm:py-6">
          <div className="mx-auto flex h-full max-w-7xl flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">Lightbox viewer</p>
                <h3 className="text-2xl font-semibold text-white">{activeImage?.title || gallery.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30"
              >
                Close
              </button>
            </div>

            <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[1fr_18rem]">
              <div className="relative flex min-h-0 items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-black">
                <button
                  type="button"
                  onClick={() => setActiveIndex((current) => (current - 1 + images.length) % images.length)}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/20"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <img
                  src={getOriginalImageUrl(activeImage)}
                  alt={activeImage?.title || gallery.title}
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => setActiveIndex((current) => (current + 1) % images.length)}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/20"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="overflow-y-auto rounded-[2rem] border border-white/10 bg-white/5 p-4">
                <div className="space-y-3">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`flex w-full items-center gap-3 rounded-[1.2rem] border p-2 text-left transition ${
                        index === activeIndex
                          ? "border-white/30 bg-white/10"
                          : "border-white/8 hover:border-white/16 hover:bg-white/5"
                      }`}
                    >
                      <img
                        src={optimizeImageUrl(image.thumbnailUrl || image.url, 160)}
                        alt={image.title}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="h-16 w-16 rounded-2xl object-cover"
                      />
                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-semibold text-white">{image.title}</h4>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
