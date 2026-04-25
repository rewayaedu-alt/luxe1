import { Link, useParams } from "react-router-dom";
import CategoryPills from "../components/CategoryPills";
import PhotoGrid from "../components/PhotoGrid";
import { getCategoryById, getPhotosByCategory } from "../lib/content";

export default function CategoryPage() {
  const { categoryId } = useParams();
  const category = getCategoryById(categoryId);
  const photos = category ? getPhotosByCategory(category.id) : [];

  if (!category) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-white">Category not found</h1>
        <Link to="/categories" className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-3 py-4 sm:px-4 sm:py-6">
      <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(18,20,25,0.96),rgba(10,11,14,1))] p-6 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Category</p>
        <h1 className="mt-2 text-4xl font-semibold text-white sm:text-5xl">{category.name}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-300">{category.description}</p>
        <p className="mt-2 text-sm text-zinc-400">{photos.length} galleries</p>
      </section>

      <CategoryPills activeCategory={category.id} />

      <PhotoGrid photos={photos} emptyTitle="No galleries" emptyCopy="This category is empty." />
    </div>
  );
}
