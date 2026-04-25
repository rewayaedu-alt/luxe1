import { Link } from "react-router-dom";
import { getCategories } from "../lib/content";

export default function CategoryPills({ activeCategory = null }) {
  const categories = getCategories();

  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      <Link
        to="/"
        className={`whitespace-nowrap rounded-md border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.08em] ${
          !activeCategory ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"
        }`}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/category/${category.id}`}
          className={`whitespace-nowrap rounded-md border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.08em] ${
            activeCategory === category.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
