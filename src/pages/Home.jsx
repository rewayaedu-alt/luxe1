import { Sparkles, Zap } from "lucide-react";
import DiscoveryGrid from "../components/DiscoveryGrid";
import { getMixedDiscoveryFeed } from "../lib/content";

export default function Home() {
  const items = getMixedDiscoveryFeed();
  const heroItems = items.slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-3 py-4 sm:px-4 sm:py-6">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(18,22,29,0.96),rgba(9,11,16,1))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)] sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-300">
                <Sparkles className="h-3.5 w-3.5" />
                Mixed discovery
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-300">
                <Zap className="h-3.5 w-3.5" />
                Faster thumbnails
              </span>
            </div>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-white sm:text-5xl">
              One fast discovery feed for galleries, stars, channels, and categories.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
              Every card uses one representative image, a compact niche indicator, and lighter thumbnail delivery so the home page feels sharper and loads quicker.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {heroItems.map((item) => (
              <div key={item.id} className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">{item.type}</p>
                <p className="mt-2 text-lg font-semibold text-white">{item.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{item.niche}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Home feed</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">Representative cards only</h2>
          </div>
          <p className="text-sm text-zinc-500">{items.length} cards</p>
        </div>

        <DiscoveryGrid
          items={items}
          emptyTitle="No discovery cards yet"
          emptyCopy="Upload a few items and the mixed feed will fill itself in."
        />
      </section>
    </div>
  );
}
