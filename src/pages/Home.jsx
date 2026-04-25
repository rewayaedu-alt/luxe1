import { Link, useSearchParams } from "react-router-dom";
import DirectoryHeader from "../components/DirectoryHeader";
import FilterChips from "../components/FilterChips";
import GalleryGrid from "../components/GalleryGrid";
import SortTabs from "../components/SortTabs";
import { GALLERY_SORT_OPTIONS, getRelatedTagsForPhotos, getSortedGalleryFeed, getTopCategoryTiles } from "../lib/content";

export default function Home() {
  const [searchParams] = useSearchParams();
  const sort = searchParams.get("sort") || "popular";
  const photos = getSortedGalleryFeed(sort).slice(0, 30);
  const topCategories = getTopCategoryTiles(8).map((category) => ({
    ...category,
    href: `/category/${category.id}`,
  }));
  const topTags = getRelatedTagsForPhotos(photos, 10).map((tag) => ({
    ...tag,
    href: `/tags/${tag.slug}`,
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-3 py-4 sm:px-4 sm:py-6">
      <DirectoryHeader
        eyebrow="Browse galleries"
        title={sort === "recent" ? "Newest galleries" : "Popular galleries"}
        count={photos.length}
        description="A directory-first gallery feed with quick jumps into categories and tags."
      >
        <div className="flex flex-col gap-3">
          <SortTabs options={GALLERY_SORT_OPTIONS} current={sort} />
          <FilterChips items={topCategories} />
        </div>
      </DirectoryHeader>

      <GalleryGrid photos={photos} emptyTitle="No galleries yet" emptyCopy="Upload a few galleries to start the directory." />

      <section className="space-y-3 border-t border-white/10 pt-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Popular tags</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">Fast jumps into narrower lanes</h2>
          </div>
          <Link to="/categories#tags" className="text-sm text-zinc-400 transition hover:text-white">
            Full tag index
          </Link>
        </div>
        <FilterChips items={topTags} />
      </section>
    </div>
  );
}
