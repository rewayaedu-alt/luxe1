import DiscoveryGrid from "../components/DiscoveryGrid";
import { getChannelRepresentativeImage, getChannelSummaries, getPrimaryNicheLabel } from "../lib/content";

export default function Channels() {
  const channelSummaries = getChannelSummaries();
  const items = channelSummaries.map((channel) => ({
    id: `channel-${channel.slug}`,
    type: "channel",
    href: `/channels/${channel.slug}`,
    title: channel.name,
    subtitle: channel.description,
    image: getChannelRepresentativeImage(channel),
    niche: getPrimaryNicheLabel(channel.tags, channel.preview?.tags, "Channel"),
    count: channel.count,
    meta: `${channel.views} views`,
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-3 py-4 sm:px-4 sm:py-6">
      <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(17,19,23,0.96),rgba(10,11,14,1))] p-6 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Channels</p>
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Channel hubs with lighter, cleaner card previews</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 sm:text-base">
          Each channel now carries one representative image, one niche indicator, and a compact summary that matches the home feed.
        </p>
      </section>

      <section>
        <DiscoveryGrid items={items} />
      </section>
    </div>
  );
}
