import { Link, useParams, useSearchParams } from "react-router-dom";
import DirectoryHeader from "../components/DirectoryHeader";
import FilterChips from "../components/FilterChips";
import GalleryGrid from "../components/GalleryGrid";
import SortTabs from "../components/SortTabs";
import { GALLERY_SORT_OPTIONS, getChannelBySlug, getPhotosByChannel, getRelatedChannelTags, getSortedGalleryFeed } from "../lib/content";

export default function ChannelDetail() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const sort = searchParams.get("sort") || "popular";
  const channel = getChannelBySlug(slug);
  const photos = channel ? getSortedGalleryFeed(sort, getPhotosByChannel(channel.slug)) : [];
  const tags = channel
    ? [
        ...(channel.tags || []).map((tag) => ({ slug: tag.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name: tag, href: `/tags/${tag.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` })),
        ...getRelatedChannelTags(channel.slug, 6).map((tag) => ({ ...tag, href: `/tags/${tag.slug}` })),
      ].filter((item, index, array) => array.findIndex((candidate) => candidate.href === item.href) === index)
    : [];

  if (!channel) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-white">Channel not found</h1>
        <Link to="/channels" className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-3 py-4 sm:px-4 sm:py-6">
      <DirectoryHeader eyebrow="Channel" title={channel.name} count={photos.length} description={channel.description}>
        <div className="flex flex-col gap-3">
          <SortTabs options={GALLERY_SORT_OPTIONS} current={sort} />
          <FilterChips items={tags} emptyCopy="No channel tags yet." />
        </div>
      </DirectoryHeader>

      <GalleryGrid photos={photos} emptyTitle="No galleries" emptyCopy="This channel is empty." />
    </div>
  );
}
