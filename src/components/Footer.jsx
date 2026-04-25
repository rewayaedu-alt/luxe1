import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-border bg-[#101114]">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-4">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <Link to="/categories" className="hover:text-foreground">Categories</Link>
          <Link to="/channels" className="hover:text-foreground">Channels</Link>
          <Link to="/upload" className="hover:text-foreground">Upload</Link>
        </div>
        <p>(c) 2026 StockPics</p>
      </div>
    </footer>
  );
}
