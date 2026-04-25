import DiscoveryGrid from "../components/DiscoveryGrid";
import { getCreatorSummaries, getPrimaryNicheLabel } from "../lib/content";

export default function Creators() {
  const creators = getCreatorSummaries();
  const items = creators.map((creator) => ({
    id: `creator-${creator.slug}`,
    type: "creator",
    href: `/search?q=${encodeURIComponent(creator.name)}`,
    title: creator.name,
    subtitle: `${creator.count} galleries`,
    image: creator.heroPhoto?.thumbnailUrl || creator.heroPhoto?.url,
    niche: getPrimaryNicheLabel(creator.tags, "Creator"),
    count: creator.count,
    meta: `${creator.views + creator.likes} engagement`,
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-3 py-4 sm:px-4 sm:py-6">
      <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(17,19,23,0.96),rgba(10,11,14,1))] p-6 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Creators / Models</p>
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Profiles arranged in the same discovery language</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 sm:text-base">
          The creator page now uses the same tighter card system as home, so discovery feels consistent instead of jumping between layouts.
        </p>
      </section>

      <section>
        <DiscoveryGrid items={items} />
      </section>
    </div>
  );
}
