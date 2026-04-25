import { Link } from "react-router-dom";
import { getOptimizedThumbnailUrl } from "../lib/imageUtils";

const TYPE_LABELS = {
  gallery: "Gallery",
  star: "Star",
  channel: "Channel",
  category: "Category",
  creator: "Creator",
  album: "Album",
};

export default function DiscoveryCard({
  item,
  priority = false,
  aspect = "aspect-[4/5]",
}) {
  if (!item?.image || !item?.href) return null;

  const typeLabel = TYPE_LABELS[item.type] || "Featured";

  return (
    <Link
      to={item.href}
      aria-label={item.title}
      title={item.title}
      className="group block h-full"
    >
      <article className="h-full overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#090b10] shadow-[0_24px_60px_rgba(0,0,0,0.34)] transition duration-300 hover:-translate-y-1 hover:border-white/20">
        <div className={`relative overflow-hidden ${aspect}`}>
          <img
            src={getOptimizedThumbnailUrl(item.image, priority ? 720 : 560, priority ? 74 : 68)}
            alt={item.title}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,10,0.08),rgba(5,7,10,0.16)_40%,rgba(5,7,10,0.88)_100%)]" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85">
              {typeLabel}
            </span>
            {item.niche ? (
              <span className="rounded-full border border-white/12 bg-white/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white/78">
                {item.niche}
              </span>
            ) : null}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <div className="rounded-[1.2rem] border border-white/10 bg-black/28 p-3 backdrop-blur-[10px]">
              <h3 className="line-clamp-1 text-lg font-semibold text-white">{item.title}</h3>
              {item.subtitle ? (
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-300/90">{item.subtitle}</p>
              ) : null}
              <div className="mt-3 flex items-center justify-between gap-3 text-xs text-zinc-300/80">
                <span className="truncate">{item.meta || "Discovery card"}</span>
                {typeof item.count === "number" ? (
                  <span className="shrink-0 rounded-full border border-white/15 bg-white/90 px-2.5 py-1 font-semibold text-black">
                    {item.count}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
