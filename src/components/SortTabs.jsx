import { Link, useLocation } from "react-router-dom";

function buildHref(pathname, searchParams, value) {
  const next = new URLSearchParams(searchParams);
  if (value) {
    next.set("sort", value);
  } else {
    next.delete("sort");
  }
  const query = next.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export default function SortTabs({ options = [], current = "popular" }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = current === option.value;
        return (
          <Link
            key={option.value}
            to={buildHref(location.pathname, searchParams, option.value)}
            className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
              active
                ? "border-white bg-white text-black"
                : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:text-white"
            }`}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
