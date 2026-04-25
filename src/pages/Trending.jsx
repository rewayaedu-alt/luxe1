import DirectoryHeader from "../components/DirectoryHeader";
import GalleryGrid from "../components/GalleryGrid";
import { getTrendingPhotos } from "../lib/content";

export default function Trending() {
  const photos = getTrendingPhotos(30);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-3 py-4 sm:px-4 sm:py-6">
      <DirectoryHeader
        eyebrow="Trending"
        title="Highest-traffic galleries"
        count={photos.length}
        description="This lane stays focused on the strongest-performing gallery cards in the catalog."
      />
      <GalleryGrid photos={photos} />
    </div>
  );
}
