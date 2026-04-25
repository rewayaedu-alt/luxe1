import { Link, useParams, useSearchParams } from "react-router-dom";
import DirectoryHeader from "../components/DirectoryHeader";
import FilterChips from "../components/FilterChips";
import GalleryGrid from "../components/GalleryGrid";
import SortTabs from "../components/SortTabs";
import { GALLERY_SORT_OPTIONS, getCreatorBySlug, getPhotosByCreator, getRelatedCreatorTags, getSortedGalleryFeed } from "../lib/content";

export default function CreatorDetail() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const sort = searchParams.get("sort") || "popular";
  const creator = getCreatorBySlug(slug);
  const photos = creator ? getSortedGalleryFeed(sort, getPhotosByCreator(creator.slug)) : [];
  const tags = creator
    ? getRelatedCreatorTags(creator.slug, 10).map((tag) => ({ ...tag, href: `/tags/${tag.slug}` }))
    : [];

  if (!creator) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-white">Creator not found</h1>
        <Link to="/creators" className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-3 py-4 sm:px-4 sm:py-6">
      <DirectoryHeader
        eyebrow="Creator"
        title={creator.name}
        count={photos.length}
        description="A gallery-first creator archive with related tags and direct drill-down browsing."
      >
        <div className="flex flex-col gap-3">
          <SortTabs options={GALLERY_SORT_OPTIONS} current={sort} />
          <FilterChips items={tags} emptyCopy="No related tags yet." />
        </div>
      </DirectoryHeader>

      <GalleryGrid photos={photos} emptyTitle="No galleries" emptyCopy="This creator does not have any galleries yet." />
    </div>
  );
}
