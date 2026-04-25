import { Link } from "react-router-dom";
import { getOptimizedThumbnailUrl } from "../lib/imageUtils";

export default function EntityIndexCard({ item, priority = false }) {
  if (!item?.image || !item?.href) return null;

  return (
    <Link to={item.href} className="group block h-full" aria-label={item.title} title={item.title}>
      <article className="overflow-hidden rounded-[1.3rem] border border-white/10 bg-[#0c0f14] shadow-[0_18px_44px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-white/20">
        <div className="relative aspect-[5/4] overflow-hidden">
          <img
            src={getOptimizedThumbnailUrl(item.image, priority ? 720 : 560, priority ? 74 : 68)}
            alt={item.title}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-[#090b10]/15 to-transparent" />
        </div>
        <div className="space-y-2 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">{item.type}</p>
            {typeof item.count === "number" ? (
              <span className="text-xs text-zinc-500">{item.count} galleries</span>
            ) : null}
          </div>
          <h3 className="line-clamp-1 text-lg font-semibold text-white">{item.title}</h3>
          {item.subtitle ? (
            <p className="line-clamp-2 text-sm leading-6 text-zinc-400">{item.subtitle}</p>
          ) : null}
        </div>
      </article>
    </Link>
  );
}
