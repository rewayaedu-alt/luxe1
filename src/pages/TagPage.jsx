import { Link, useParams } from "react-router-dom";
import { Hash } from "lucide-react";
import PhotoGrid from "../components/PhotoGrid";
import { getPhotosByTag, getTagBySlug, getTags } from "../lib/content";

export default function TagPage() {
  const { tagSlug } = useParams();
  const tag = getTagBySlug(tagSlug);
  const galleries = getPhotosByTag(tagSlug);
  const relatedTags = getTags()
    .filter((item) => item.slug !== tagSlug)
    .sort((a, b) => b.galleryCount - a.galleryCount)
    .slice(0, 8);

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
      <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(18,20,25,0.96),rgba(10,11,14,1))] p-6 sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/72">
          <Hash className="h-3.5 w-3.5 text-primary" />
          Tag archive
        </div>
        <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">{tag.name}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 sm:text-base">
          {tag.galleryCount} galleries are currently filed under this tag. The layout keeps the same masonry-heavy discovery rhythm as the rest of the catalog.
        </p>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Results</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">{galleries.length} matching galleries</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {relatedTags.map((item) => (
              <Link key={item.slug} to={`/tags/${item.slug}`} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 transition hover:border-white/20">
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <PhotoGrid photos={galleries} emptyTitle="No galleries" emptyCopy="This tag has not been used yet." />
      </section>
    </div>
  );
}
