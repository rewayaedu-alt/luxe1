import { Link, useSearchParams } from "react-router-dom";
import { Hash, Search } from "lucide-react";
import MediaMasonry from "../components/MediaMasonry";
import PhotoGrid from "../components/PhotoGrid";
import { searchCatalog } from "../lib/content";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";
  const results = searchCatalog(query);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-3 py-4 sm:px-4 sm:py-6">
      <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(18,20,25,0.96),rgba(10,11,14,1))] p-6 sm:p-8">
        <div className="flex items-center gap-2 text-primary">
          <Search className="h-4 w-4" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em]">Search Results</p>
        </div>
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">{query ? `Results for "${query}"` : "Search the catalog"}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 sm:text-base">
          Search now returns galleries, tags, creators, and channels in one page instead of only gallery cards.
        </p>
        {!query ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {["portrait", "travel", "fitness", "mature", "nightlife"].map((term) => (
              <Link key={term} to={`/search?q=${encodeURIComponent(term)}`} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 transition hover:border-white/20 hover:bg-white/8">
                {term}
              </Link>
            ))}
          </div>
        ) : null}
      </section>

      <section>
        <div className="mb-4 flex flex-wrap gap-3">
          {[
            { label: "Galleries", value: results.galleries.length },
            { label: "Tags", value: results.tags.length },
            { label: "Creators", value: results.creators.length },
            { label: "Channels", value: results.channels.length },
          ].map((item) => (
            <div key={item.label} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200">
              {item.label}: {item.value}
            </div>
          ))}
        </div>
      </section>

      {query ? (
        <>
          <section>
            <div className="mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Galleries</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">Matching gallery results</h2>
            </div>
            <PhotoGrid
              photos={results.galleries}
              emptyTitle="No matching galleries"
              emptyCopy="Try a wider term or jump into tags, creators, or channels below."
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-[1.7rem] border border-white/10 bg-card/70 p-5">
              <div className="mb-4 flex items-center gap-2 text-primary">
                <Hash className="h-4 w-4" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em]">Tags</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {results.tags.length ? (
                  results.tags.map((tag) => (
                    <Link key={tag.slug} to={`/tags/${tag.slug}`} className="rounded-full border border-white/10 px-3 py-2 text-sm text-zinc-200 transition hover:border-white/20">
                      {tag.name}
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-zinc-400">No tags matched this query.</p>
                )}
              </div>
            </div>

            <div className="space-y-4 rounded-[1.7rem] border border-white/10 bg-card/70 p-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Creators</p>
              </div>
              <MediaMasonry
                items={results.creators}
                emptyTitle="No creators matched"
                emptyCopy="Try a broader creator or photographer term."
                columnsClass="columns-2 gap-3"
                imageWidth={500}
                getKey={(creator) => creator.slug}
                getHref={(creator) => `/search?q=${encodeURIComponent(creator.name)}`}
                getImageSrc={(creator) => creator.heroPhoto?.thumbnailUrl || creator.heroPhoto?.url}
                getAlt={(creator) => creator.name}
              />
            </div>

            <div className="space-y-4 rounded-[1.7rem] border border-white/10 bg-card/70 p-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Channels</p>
              </div>
              <MediaMasonry
                items={results.channels}
                emptyTitle="No channels matched"
                emptyCopy="Try a broader studio or theme term."
                columnsClass="columns-2 gap-3"
                imageWidth={500}
                getKey={(channel) => channel.slug}
                getHref={(channel) => `/channels/${channel.slug}`}
                getImageSrc={(channel) => channel.preview?.thumbnailUrl || channel.preview?.url || channel.logoUrl}
                getAlt={(channel) => channel.name}
              />
            </div>
          </section>
        </>
      ) : (
        <PhotoGrid
          photos={[]}
          emptyTitle="Start with a search term"
          emptyCopy="Search by gallery title, tag, creator name, or channel."
        />
      )}
    </div>
  );
}
