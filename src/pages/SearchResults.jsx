import { useSearchParams } from "react-router-dom";
import DirectoryHeader from "../components/DirectoryHeader";
import DiscoveryGrid from "../components/DiscoveryGrid";
import FilterChips from "../components/FilterChips";
import GalleryGrid from "../components/GalleryGrid";
import { searchCatalog } from "../lib/content";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";
  const results = searchCatalog(query);

  const creatorItems = results.creators.map((creator) => ({
    id: `creator-${creator.slug}`,
    type: "creator",
    href: `/creators/${creator.slug}`,
    title: creator.name,
    subtitle: `${creator.count} galleries`,
    image: creator.heroPhoto?.thumbnailUrl || creator.heroPhoto?.url,
    count: creator.count,
  }));

  const channelItems = results.channels.map((channel) => ({
    id: `channel-${channel.slug}`,
    type: "channel",
    href: `/channels/${channel.slug}`,
    title: channel.name,
    subtitle: channel.description,
    image: channel.preview?.thumbnailUrl || channel.preview?.url || channel.logoUrl,
    count: channel.count,
  }));

  const starItems = results.stars.map((star) => ({
    id: `star-${star.slug}`,
    type: "star",
    href: `/stars/${star.slug}`,
    title: star.name,
    subtitle: star.bio,
    image: star.preview?.thumbnailUrl || star.preview?.url || star.avatarUrl || star.thumbnailUrl,
    count: star.count,
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-3 py-4 sm:px-4 sm:py-6">
      <DirectoryHeader
        eyebrow="Search"
        title={query ? `Results for "${query}"` : "Search the catalog"}
        count={query ? results.galleries.length : 0}
        description="Search is gallery-first, with tags and entity matches grouped underneath."
      >
        {!query ? (
          <FilterChips
            items={["portrait", "travel", "fitness", "mature", "nightlife"].map((term) => ({
              id: term,
              name: term,
              href: `/search?q=${encodeURIComponent(term)}`,
            }))}
          />
        ) : null}
      </DirectoryHeader>

      {query ? (
        <>
          <section className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Galleries", value: results.galleries.length },
                { label: "Tags", value: results.tags.length },
                { label: "Stars", value: results.stars.length },
                { label: "Creators", value: results.creators.length },
                { label: "Channels", value: results.channels.length },
              ].map((item) => (
                <div key={item.label} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200">
                  {item.label}: {item.value}
                </div>
              ))}
            </div>
            <GalleryGrid
              photos={results.galleries}
              emptyTitle="No matching galleries"
              emptyCopy="Try a wider term or browse the entities below."
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-4">
            <div className="rounded-[1.6rem] border border-white/10 bg-card/70 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Tags</p>
              <div className="mt-4">
                <FilterChips
                  items={results.tags.map((tag) => ({ ...tag, href: `/tags/${tag.slug}` }))}
                  emptyCopy="No tags matched this query."
                />
              </div>
            </div>

            <div className="space-y-4 xl:col-span-3">
              {starItems.length ? (
                <section>
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Stars</p>
                  <DiscoveryGrid items={starItems.slice(0, 4)} />
                </section>
              ) : null}
              {creatorItems.length ? (
                <section>
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Creators</p>
                  <DiscoveryGrid items={creatorItems.slice(0, 4)} />
                </section>
              ) : null}
              {channelItems.length ? (
                <section>
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Channels</p>
                  <DiscoveryGrid items={channelItems.slice(0, 4)} />
                </section>
              ) : null}
            </div>
          </section>
        </>
      ) : (
        <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-card/65 px-6 py-16 text-center">
          <h3 className="text-xl font-semibold text-white">Start with a search term</h3>
          <p className="mt-2 text-sm text-muted-foreground">Search by gallery title, tag, star, creator, or channel.</p>
        </div>
      )}
    </div>
  );
}
