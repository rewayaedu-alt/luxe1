import CategoryPills from "../components/CategoryPills";
import PhotoGrid from "../components/PhotoGrid";
import { getTrendingPhotos } from "../lib/content";

export default function Trending() {
  const photos = getTrendingPhotos(24);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-3 py-4 sm:px-4 sm:py-6">
      <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(17,19,23,0.96),rgba(10,11,14,1))] p-6 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Trending</p>
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">The hottest galleries in the catalog</h1>
      </section>
      <CategoryPills />
      <PhotoGrid photos={photos} />
    </div>
  );
}
