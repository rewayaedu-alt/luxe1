import { Link } from "react-router-dom";

export default function FilterChips({
  items = [],
  emptyCopy = "",
  getKey = (item) => item.id || item.slug || item.name,
  getLabel = (item) => item.name || item.label,
  getHref = (item) => item.href || "#",
}) {
  if (!items.length) {
    return emptyCopy ? <p className="text-sm text-zinc-500">{emptyCopy}</p> : null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={getKey(item)}
          to={getHref(item)}
          className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-300 transition hover:border-white/20 hover:text-white"
        >
          {getLabel(item)}
        </Link>
      ))}
    </div>
  );
}
