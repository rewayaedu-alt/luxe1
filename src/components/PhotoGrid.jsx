import { Link } from "react-router-dom";
import { getGalleryPrimaryImage, normalizeGalleryStats } from "../lib/galleryUtils";
import { optimizeImageUrl } from "../lib/imageUtils";

function GridCard({ photo, mode = "default" }) {
  const target = mode === "uploaded" ? `/uploaded/${photo.id}` : `/photo/${photo.id}`;
  const { views, likes } = normalizeGalleryStats(photo);
  const previewImage = getGalleryPrimaryImage(photo);
  const ratioClass = Number(likes) > 1800 ? "aspect-[4/5]" : Number(views) > 20000 ? "aspect-[3/4]" : "aspect-[5/6]";

  if (!previewImage?.url) return null;

  return (
    <Link to={target} aria-label={photo.title} title={photo.title} className="mb-4 block break-inside-avoid">
      <article className="group overflow-hidden rounded-xl border border-white/8 bg-[#111318] shadow-[0_18px_40px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-white/18">
        <div className={`overflow-hidden ${ratioClass}`}>
          <img
            src={optimizeImageUrl(previewImage.thumbnailUrl || previewImage.url, 900)}
            alt={previewImage.alt || photo.title}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </article>
    </Link>
  );
}

export default function PhotoGrid({
  photos = [],
  emptyTitle = "No galleries found",
  emptyCopy = "Try another path through the catalog.",
  mode = "default",
}) {
  if (!photos.length) {
    return (
      <div className="rounded-[2rem] border border-dashed border-white/10 bg-card/65 px-6 py-16 text-center">
        <h3 className="text-xl font-semibold text-white">{emptyTitle}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{emptyCopy}</p>
      </div>
    );
  }

  return (
    <div className="columns-2 gap-4 lg:columns-3 2xl:columns-5">
      {photos.map((photo) => <GridCard key={photo.id} photo={photo} mode={mode} />)}
    </div>
  );
}
