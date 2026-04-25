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
      <article className="flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-white/10 bg-[linear-gradient(180deg,rgba(19,22,29,0.96),rgba(12,14,18,0.96))] shadow-[0_24px_60px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-white/20">
        <div className={`relative overflow-hidden ${aspect}`}>
          <img
            src={getOptimizedThumbnailUrl(item.image, priority ? 720 : 560, priority ? 74 : 68)}
            alt={item.title}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090b10] via-[#090b10]/10 to-transparent" />
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
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="space-y-1.5">
            <h3 className="line-clamp-1 text-lg font-semibold text-white">{item.title}</h3>
            {item.subtitle ? (
              <p className="line-clamp-2 text-sm leading-6 text-zinc-400">{item.subtitle}</p>
            ) : null}
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 text-xs text-zinc-500">
            <span className="truncate">{item.meta || "Discovery card"}</span>
            {typeof item.count === "number" ? (
              <span className="shrink-0 rounded-full bg-white px-2.5 py-1 font-semibold text-black">
                {item.count}
              </span>
            ) : null}
          </div>
        </div>
      </article>
    </Link>
  );
}
