import { useSearchParams } from "react-router-dom";
import DirectoryHeader from "../components/DirectoryHeader";
import DiscoveryGrid from "../components/DiscoveryGrid";
import FilterChips from "../components/FilterChips";
import SortTabs from "../components/SortTabs";
import { ENTITY_SORT_OPTIONS, getPrimaryNicheLabel, getSortedStarSummaries, getStarRepresentativeImage } from "../lib/content";

export default function Stars() {
  const [searchParams] = useSearchParams();
  const sort = searchParams.get("sort") || "popular";
  const stars = getSortedStarSummaries(sort);
  const items = stars.map((star) => ({
    id: `star-${star.slug}`,
    type: "star",
    href: `/stars/${star.slug}`,
    title: star.name,
    subtitle: star.bio,
    image: getStarRepresentativeImage(star),
    niche: getPrimaryNicheLabel(star.tags, "Star"),
    count: star.count,
  }));
  const starTags = [...new Set(stars.flatMap((star) => star.tags || []))]
    .slice(0, 10)
    .map((tag) => ({ slug: tag.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name: tag, href: `/tags/${tag.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` }));

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-3 py-4 sm:px-4 sm:py-6">
      <DirectoryHeader
        eyebrow="Stars"
        title="Star directory"
        count={stars.length}
        description="Browse talent pages as their own public directory instead of only as gallery metadata."
      >
        <div className="flex flex-col gap-3">
          <SortTabs options={ENTITY_SORT_OPTIONS} current={sort} />
          <FilterChips items={starTags} emptyCopy="No star tags available." />
        </div>
      </DirectoryHeader>

      <DiscoveryGrid items={items} />
    </div>
  );
}
