import { Link } from "react-router-dom";
import MediaMasonry from "../components/MediaMasonry";
import { getCreatorSummaries } from "../lib/content";

export default function Creators() {
  const creators = getCreatorSummaries();

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-3 py-4 sm:px-4 sm:py-6">
      <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(17,19,23,0.96),rgba(10,11,14,1))] p-6 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Creators / Models</p>
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Profiles arranged as a discovery grid</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 sm:text-base">
          Each card surfaces a hero image, name, gallery count, and enough engagement detail to make the page feel alive.
        </p>
      </section>

      <section>
        <MediaMasonry
          items={creators}
          getHref={(creator) => `/search?q=${encodeURIComponent(creator.name)}`}
          getImageSrc={(creator) => creator.heroPhoto?.url}
          getAlt={(creator) => creator.name}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {creators.map((creator) => (
          <Link key={creator.slug} to={`/search?q=${encodeURIComponent(creator.name)}`} className="rounded-[1.4rem] border border-white/10 bg-card/75 p-5 transition hover:border-white/20">
            <h2 className="text-xl font-semibold text-white">{creator.name}</h2>
            <p className="mt-2 text-sm text-zinc-400">{creator.count} galleries</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
