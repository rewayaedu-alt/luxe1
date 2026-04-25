import { Link } from "react-router-dom";
import { getOptimizedThumbnailUrl } from "../lib/imageUtils";

const aspectCycle = [
  "aspect-[4/5]",
  "aspect-[3/4]",
  "aspect-[5/6]",
  "aspect-[4/6]",
  "aspect-[1/1]",
];

export default function MediaMasonry({
  items = [],
  emptyTitle = "Nothing to show",
  emptyCopy = "Try another path through the gallery.",
  getKey = (item) => item.id,
  getHref = () => "/",
  getImageSrc = (item) => item.url,
  getAlt = (item) => item.title || item.name || "Gallery image",
  columnsClass = "columns-2 gap-4 lg:columns-3 xl:columns-4",
  imageWidth = 1200,
}) {
  if (!items.length) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-card/65 px-6 py-16 text-center">
        <h3 className="text-xl font-semibold text-white">{emptyTitle}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{emptyCopy}</p>
      </div>
    );
  }

  return (
    <div className={columnsClass}>
      {items.map((item, index) => {
        const imageSrc = getImageSrc(item);
        const aspectClass = aspectCycle[index % aspectCycle.length];

        return (
          <Link
            key={getKey(item)}
            to={getHref(item)}
            aria-label={getAlt(item)}
            title={getAlt(item)}
            className="group mb-4 block break-inside-avoid"
          >
            <div className="overflow-hidden rounded-xl border border-white/8 bg-[#111318] shadow-[0_18px_40px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-white/18">
              <div className={`overflow-hidden ${aspectClass}`}>
                <img
                  src={getOptimizedThumbnailUrl(imageSrc, 600, 70)}
                  alt={getAlt(item)}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
