import { Link } from "react-router-dom";
import { buildGalleryCardFeed } from "../lib/content";
import { getGalleryPrimaryImage, normalizeGalleryStats } from "../lib/galleryUtils";
import { optimizeImageUrl } from "../lib/imageUtils";

function formatCompact(value) {
  return new Intl.NumberFormat("en-US", {
    notation: Number(value || 0) >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(Number(value || 0));
}

function GalleryCard({ photo, mode = "default" }) {
  const target = mode === "uploaded" ? `/uploaded/${photo.id}` : `/photo/${photo.id}`;
  const previewImage = getGalleryPrimaryImage(photo);
  const { views } = normalizeGalleryStats(photo);
  const ratioClass = Number(views) > 22000 ? "aspect-[3/4]" : Number(views) > 18000 ? "aspect-[4/5]" : "aspect-[5/6]";

  if (!previewImage?.url) return null;

  return (
    <Link to={target} aria-label={photo.title} title={photo.title} className="group mb-4 block break-inside-avoid">
      <article className="overflow-hidden rounded-[1.15rem] border border-white/10 bg-[#0c0f14] shadow-[0_18px_46px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1 hover:border-white/20">
        <div className={`relative overflow-hidden ${ratioClass}`}>
          <img
            src={optimizeImageUrl(previewImage.thumbnailUrl || previewImage.url, 900)}
            alt={previewImage.alt || photo.title}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090b10] via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3">
            <div className="min-w-0 rounded-2xl bg-black/35 px-3 py-2 backdrop-blur-sm">
              <h3 className="line-clamp-1 text-sm font-semibold text-white">{photo.title}</h3>
              <p className="line-clamp-1 text-xs text-zinc-300/80">{photo.photographer || "Gallery"}</p>
            </div>
            <div className="shrink-0 rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[11px] font-semibold text-white/85 backdrop-blur-sm">
              {formatCompact(views)} views
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function GalleryGrid({
  photos = [],
  emptyTitle = "No galleries found",
  emptyCopy = "Try another path through the catalog.",
  mode = "default",
}) {
  const galleryCards = buildGalleryCardFeed(photos);

  if (!galleryCards.length) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-card/65 px-6 py-16 text-center">
        <h3 className="text-xl font-semibold text-white">{emptyTitle}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{emptyCopy}</p>
      </div>
    );
  }

  return (
    <div className="columns-2 gap-4 lg:columns-3 2xl:columns-5">
      {galleryCards.map((photo) => (
        <GalleryCard key={photo.id} photo={photo} mode={mode} />
      ))}
    </div>
  );
}
