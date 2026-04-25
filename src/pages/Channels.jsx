import { useSearchParams } from "react-router-dom";
import DirectoryHeader from "../components/DirectoryHeader";
import DiscoveryGrid from "../components/DiscoveryGrid";
import FilterChips from "../components/FilterChips";
import SortTabs from "../components/SortTabs";
import { ENTITY_SORT_OPTIONS, getChannelRepresentativeImage, getPrimaryNicheLabel, getSortedChannelSummaries } from "../lib/content";

export default function Channels() {
  const [searchParams] = useSearchParams();
  const sort = searchParams.get("sort") || "popular";
  const channels = getSortedChannelSummaries(sort);
  const items = channels.map((channel) => ({
    id: `channel-${channel.slug}`,
    type: "channel",
    href: `/channels/${channel.slug}`,
    title: channel.name,
    subtitle: channel.description,
    image: getChannelRepresentativeImage(channel),
    niche: getPrimaryNicheLabel(channel.tags, channel.preview?.tags, "Channel"),
    count: channel.count,
  }));
  const topChannelTags = [...new Set(channels.flatMap((channel) => channel.tags || []))]
    .slice(0, 10)
    .map((tag) => ({ slug: tag.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name: tag, href: `/tags/${tag.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` }));

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-3 py-4 sm:px-4 sm:py-6">
      <DirectoryHeader
        eyebrow="Channels"
        title="Channel directory"
        count={channels.length}
        description="Browse studios and hubs, then drill straight into their gallery lanes."
      >
        <div className="flex flex-col gap-3">
          <SortTabs options={ENTITY_SORT_OPTIONS} current={sort} />
          <FilterChips items={topChannelTags} emptyCopy="No channel tags available." />
        </div>
      </DirectoryHeader>

      <DiscoveryGrid items={items} />
    </div>
  );
}
