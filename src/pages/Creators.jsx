import { useSearchParams } from "react-router-dom";
import DirectoryHeader from "../components/DirectoryHeader";
import DiscoveryGrid from "../components/DiscoveryGrid";
import FilterChips from "../components/FilterChips";
import SortTabs from "../components/SortTabs";
import { ENTITY_SORT_OPTIONS, getPrimaryNicheLabel, getSortedCreatorSummaries } from "../lib/content";

export default function Creators() {
  const [searchParams] = useSearchParams();
  const sort = searchParams.get("sort") || "popular";
  const creators = getSortedCreatorSummaries(sort);
  const items = creators.map((creator) => ({
    id: `creator-${creator.slug}`,
    type: "creator",
    href: `/creators/${creator.slug}`,
    title: creator.name,
    subtitle: `${creator.count} galleries`,
    image: creator.heroPhoto?.thumbnailUrl || creator.heroPhoto?.url,
    niche: getPrimaryNicheLabel(creator.tags, "Creator"),
    count: creator.count,
  }));
  const creatorTags = [...new Set(creators.flatMap((creator) => creator.tags || []))]
    .slice(0, 10)
    .map((tag) => ({ slug: tag.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name: tag, href: `/tags/${tag.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` }));

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-3 py-4 sm:px-4 sm:py-6">
      <DirectoryHeader
        eyebrow="Creators"
        title="Creator directory"
        count={creators.length}
        description="Browse photographer and creator archives through one consistent directory structure."
      >
        <div className="flex flex-col gap-3">
          <SortTabs options={ENTITY_SORT_OPTIONS} current={sort} />
          <FilterChips items={creatorTags} emptyCopy="No creator tags available." />
        </div>
      </DirectoryHeader>

      <DiscoveryGrid items={items} />
    </div>
  );
}
