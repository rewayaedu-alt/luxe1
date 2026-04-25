import { Link, useParams, useSearchParams } from "react-router-dom";
import DirectoryHeader from "../components/DirectoryHeader";
import FilterChips from "../components/FilterChips";
import GalleryGrid from "../components/GalleryGrid";
import SortTabs from "../components/SortTabs";
import { GALLERY_SORT_OPTIONS, getPhotosByTag, getSortedGalleryFeed, getTagBySlug, getTags } from "../lib/content";

export default function TagPage() {
  const { tagSlug } = useParams();
  const [searchParams] = useSearchParams();
  const sort = searchParams.get("sort") || "popular";
  const tag = getTagBySlug(tagSlug);
  const galleries = getSortedGalleryFeed(sort, getPhotosByTag(tagSlug));
  const relatedTags = getTags()
    .filter((item) => item.slug !== tagSlug)
    .sort((a, b) => b.galleryCount - a.galleryCount)
    .slice(0, 10)
    .map((item) => ({ ...item, href: `/tags/${item.slug}` }));

  if (!tag) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-white">Tag not found</h1>
        <Link to="/categories" className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-3 py-4 sm:px-4 sm:py-6">
      <DirectoryHeader
        eyebrow="Tag archive"
        title={tag.name}
        count={galleries.length}
        description={`${tag.galleryCount} galleries are currently filed under this tag.`}
      >
        <div className="flex flex-col gap-3">
          <SortTabs options={GALLERY_SORT_OPTIONS} current={sort} />
          <FilterChips items={relatedTags} />
        </div>
      </DirectoryHeader>

      <GalleryGrid photos={galleries} emptyTitle="No galleries" emptyCopy="This tag has not been used yet." />
    </div>
  );
}
