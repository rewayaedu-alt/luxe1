import { Link, useParams, useSearchParams } from "react-router-dom";
import DirectoryHeader from "../components/DirectoryHeader";
import FilterChips from "../components/FilterChips";
import GalleryGrid from "../components/GalleryGrid";
import SortTabs from "../components/SortTabs";
import { GALLERY_SORT_OPTIONS, getCategoryById, getPhotosByCategory, getRelatedCategoryTags, getSortedGalleryFeed } from "../lib/content";

export default function CategoryPage() {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const sort = searchParams.get("sort") || "popular";
  const category = getCategoryById(categoryId);
  const photos = category ? getSortedGalleryFeed(sort, getPhotosByCategory(category.id)) : [];
  const relatedTags = category
    ? getRelatedCategoryTags(category.id, 10).map((tag) => ({ ...tag, href: `/tags/${tag.slug}` }))
    : [];

  if (!category) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-white">Category not found</h1>
        <Link to="/categories" className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-3 py-4 sm:px-4 sm:py-6">
      <DirectoryHeader eyebrow="Category" title={category.name} count={photos.length} description={category.description}>
        <div className="flex flex-col gap-3">
          <SortTabs options={GALLERY_SORT_OPTIONS} current={sort} />
          <FilterChips items={relatedTags} emptyCopy="No related tags yet." />
        </div>
      </DirectoryHeader>

      <GalleryGrid photos={photos} emptyTitle="No galleries" emptyCopy="This category is empty." />
    </div>
  );
}
