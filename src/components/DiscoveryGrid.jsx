import DiscoveryCard from "./DiscoveryCard";

export default function DiscoveryGrid({
  items = [],
  emptyTitle = "Nothing to show",
  emptyCopy = "Try another path through the catalog.",
}) {
  if (!items.length) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-card/65 px-6 py-16 text-center">
        <h3 className="text-xl font-semibold text-white">{emptyTitle}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{emptyCopy}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {items.map((item, index) => (
        <DiscoveryCard
          key={item.id || `${item.type}-${index}`}
          item={item}
          priority={index < 4}
          aspect={index % 5 === 0 ? "aspect-[5/6]" : index % 3 === 0 ? "aspect-[4/5]" : "aspect-[1/1]"}
        />
      ))}
    </div>
  );
}
