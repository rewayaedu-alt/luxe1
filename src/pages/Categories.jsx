import { Link, useSearchParams } from "react-router-dom";
import { Hash } from "lucide-react";
import DirectoryHeader from "../components/DirectoryHeader";
import DiscoveryGrid from "../components/DiscoveryGrid";
import SortTabs from "../components/SortTabs";
import { CATEGORY_SORT_OPTIONS, getCategoryRepresentativeImage, getPrimaryNicheLabel, getSortedCategorySummaries, getTags } from "../lib/content";

export default function Categories() {
  const [searchParams] = useSearchParams();
  const sort = searchParams.get("sort") || "popular";
  const categories = getSortedCategorySummaries(sort);
  const tags = getTags();
  const groupedTags = tags.reduce((accumulator, tag) => {
    const letter = tag.name.charAt(0).toUpperCase();
    if (!accumulator[letter]) accumulator[letter] = [];
    accumulator[letter].push(tag);
    return accumulator;
  }, {});
  const letters = Object.keys(groupedTags).sort();
  const items = categories.map((category) => ({
    id: `category-${category.id}`,
    type: "category",
    href: `/category/${category.id}`,
    title: category.name,
    subtitle: category.description,
    image: getCategoryRepresentativeImage(category),
    niche: getPrimaryNicheLabel(category.preview?.tags, category.name),
    count: category.count,
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-3 py-4 sm:px-4 sm:py-6">
      <DirectoryHeader
        eyebrow="Categories"
        title="Browse every category"
        count={categories.length}
        description="Start broad with category lanes, then move into the tag index when you want tighter cuts."
      >
        <SortTabs options={CATEGORY_SORT_OPTIONS} current={sort} />
      </DirectoryHeader>

      <section className="space-y-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Category index</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">All category lanes</h2>
        </div>
        <DiscoveryGrid items={items} />
      </section>

      <section id="tags" className="space-y-5 border-t border-white/10 pt-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Tag archive</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">Tags A-Z</h2>
          </div>
          <div className="hidden gap-2 md:flex">
            {letters.map((letter) => (
              <a key={letter} href={`#letter-${letter}`} className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-zinc-300 transition hover:border-white/20 hover:text-white">
                {letter}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {letters.map((letter) => (
            <div key={letter} id={`letter-${letter}`} className="rounded-[1.5rem] border border-white/10 bg-card/70 p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">{letter}</div>
                <p className="text-sm text-zinc-500">{groupedTags[letter].length} tags</p>
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
