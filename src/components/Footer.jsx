import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-[#0b0d12]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Luxious</p>
          <p className="mt-2 max-w-md text-sm text-zinc-400">A faster discovery surface for galleries, stars, channels, and categories.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <Link to="/categories" className="hover:text-foreground">Categories</Link>
          <Link to="/channels" className="hover:text-foreground">Channels</Link>
          <Link to="/creators" className="hover:text-foreground">Creators</Link>
          <Link to="/upload" className="hover:text-foreground">Upload</Link>
        </div>
        <p>(c) 2026 Luxious</p>
      </div>
    </footer>
  );
}
