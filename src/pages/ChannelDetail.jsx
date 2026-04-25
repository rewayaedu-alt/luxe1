import { Link, useParams } from "react-router-dom";
import PhotoGrid from "../components/PhotoGrid";
import { getChannelBySlug, getPhotosByChannel } from "../lib/content";

export default function ChannelDetail() {
  const { slug } = useParams();
  const channel = getChannelBySlug(slug);
  const photos = channel ? getPhotosByChannel(channel.slug) : [];

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
      <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(18,20,25,0.96),rgba(10,11,14,1))] p-6 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Channel</p>
        <h1 className="mt-2 text-4xl font-semibold text-white sm:text-5xl">{channel.name}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-300">{channel.description}</p>
        <p className="mt-2 text-sm text-zinc-400">{photos.length} galleries</p>
      </section>

      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {channel.tags.map((tag) => (
          <Link key={tag} to={`/tags/${tag.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 transition hover:border-white/20">
            {tag}
          </Link>
        ))}
      </div>

      <PhotoGrid photos={photos} emptyTitle="No galleries" emptyCopy="This channel is empty." />
    </div>
  );
}
