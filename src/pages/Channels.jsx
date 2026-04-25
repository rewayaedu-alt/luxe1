import { Link } from "react-router-dom";
import MediaMasonry from "../components/MediaMasonry";
import { getChannelSummaries } from "../lib/content";

export default function Channels() {
  const channelSummaries = getChannelSummaries();

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-3 py-4 sm:px-4 sm:py-6">
      <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(17,19,23,0.96),rgba(10,11,14,1))] p-6 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Channels</p>
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Premium studios and channel hubs</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 sm:text-base">
          This page puts channels in a premium-studio presentation while still fitting the rest of the discovery flow.
        </p>
      </section>

      <section>
        <MediaMasonry
          items={channelSummaries}
          getHref={(channel) => `/channels/${channel.slug}`}
          getImageSrc={(channel) => channel.preview?.url || channel.logoUrl}
          getAlt={(channel) => channel.name}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {channelSummaries.map((channel) => (
          <Link key={channel.id} to={`/channels/${channel.slug}`} className="rounded-[1.4rem] border border-white/10 bg-card/75 p-5 transition hover:border-white/20">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">{channel.name}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{channel.description}</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase text-black">{channel.count}</span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
