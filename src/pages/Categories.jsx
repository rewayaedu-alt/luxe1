import { Link } from "react-router-dom";
import { Hash } from "lucide-react";
import DiscoveryGrid from "../components/DiscoveryGrid";
import { getCategoryRepresentativeImage, getCategorySummaries, getPrimaryNicheLabel, getTags } from "../lib/content";

export default function Categories() {
  const categorySummaries = getCategorySummaries();
  const popularCategories = categorySummaries.slice(0, 4);
  const allTags = getTags();
  const groupedTags = allTags.reduce((accumulator, tag) => {
    const letter = tag.name.charAt(0).toUpperCase();
    if (!accumulator[letter]) accumulator[letter] = [];
    accumulator[letter].push(tag);
    return accumulator;
  }, {});
  const letters = Object.keys(groupedTags).sort();
  const discoveryItems = categorySummaries.map((category) => ({
    id: `category-${category.id}`,
    type: "category",
    href: `/category/${category.id}`,
    title: category.name,
    subtitle: category.description,
    image: getCategoryRepresentativeImage(category),
    niche: getPrimaryNicheLabel(category.preview?.tags, category.name),
    count: category.count,
    meta: `${category.views} views`,
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-3 py-4 sm:px-4 sm:py-6">
      <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(22,25,32,0.95),rgba(10,11,14,1))] p-6 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Categories & Tags</p>
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Category discovery with one strong card for each lane</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 sm:text-base">
          Browse broad lanes first, then drill into the tag cloud when you want the narrower niche cuts.
        </p>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Popular categories</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">Highlighted discovery cards</h2>
          </div>
          <div className="hidden gap-2 md:flex">
            {letters.map((letter) => (
              <a key={letter} href={`#letter-${letter}`} className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-zinc-300 transition hover:border-white/20 hover:text-white">
                {letter}
              </a>
            ))}
          </div>
        </div>

        <DiscoveryGrid items={discoveryItems.slice(0, popularCategories.length)} />
      </section>

      <section>
        <div className="mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">All categories</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">Full category grid</h2>
        </div>
        <DiscoveryGrid items={[...discoveryItems].sort((a, b) => a.title.localeCompare(b.title))} />
      </section>

      <section>
        <div className="mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Tags A-Z</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">Every tag in one scanable index</h2>
        </div>
        <div className="space-y-5">
          {letters.map((letter) => (
            <div key={letter} id={`letter-${letter}`} className="rounded-[1.6rem] border border-white/10 bg-card/70 p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">{letter}</div>
                <p className="text-sm text-zinc-400">{groupedTags[letter].length} tags</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {groupedTags[letter].map((tag) => (
                  <Link
                    key={tag.slug}
                    to={`/tags/${tag.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 transition hover:border-white/20 hover:bg-white/8"
                  >
                    <Hash className="h-3.5 w-3.5 text-primary" />
                    {tag.name}
                    <span className="text-zinc-500">{tag.galleryCount}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
