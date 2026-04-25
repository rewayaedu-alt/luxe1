import DiscoveryGrid from "../components/DiscoveryGrid";
import { getMixedDiscoveryFeed } from "../lib/content";

export default function Home() {
  const items = getMixedDiscoveryFeed();

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-3 py-4 sm:px-4 sm:py-6">
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Home feed</p>
            <h1 className="mt-1 text-3xl font-semibold text-white sm:text-4xl">Image-first discovery</h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">
              A tighter feed for galleries, stars, channels, and categories with the focus pushed back onto the thumbnail itself.
            </p>
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
