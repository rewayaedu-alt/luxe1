import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Grid2x2, Menu, Search, TrendingUp, Tv2, Upload, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCategories } from "../lib/content";

const navItems = [
  { to: "/", label: "Home", icon: Grid2x2, match: (pathname) => pathname === "/" },
  { to: "/trending", label: "Trending", icon: TrendingUp, match: (pathname) => pathname.startsWith("/trending") },
  { to: "/categories", label: "Categories", icon: Grid2x2, match: (pathname) => pathname === "/categories" || pathname.startsWith("/category/") || pathname.startsWith("/tags/") },
  { to: "/creators", label: "Creators", icon: UserRound, match: (pathname) => pathname.startsWith("/creators") },
  { to: "/channels", label: "Channels", icon: Tv2, match: (pathname) => pathname.startsWith("/channels") },
];

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const quickCategories = useMemo(() => getCategories().slice(0, 8), []);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0c0e12]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-3 sm:px-4">
        <Link to="/" className="shrink-0 text-xl font-bold uppercase tracking-[0.18em] text-white">
          Luxious
        </Link>

        <form onSubmit={handleSearch} className="hidden flex-1 md:block">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search galleries, tags, creators, channels"
              className="h-11 rounded-full border-white/10 bg-white/5 pl-10 pr-4 text-sm"
            />
          </div>
        </form>

        <nav className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) => {
            const active = item.match(location.pathname);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active ? "bg-white text-black" : "text-muted-foreground hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden md:block">
          <Link to="/upload">
            <Button className="h-10 rounded-full px-5">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </Link>
        </div>

        <Button variant="ghost" size="icon" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} className="md:hidden" onClick={() => setMobileOpen((value) => !value)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/10 bg-[#0c0e12] px-3 py-3 md:hidden">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search"
                className="h-11 rounded-full border-white/10 bg-white/5 pl-10"
              />
            </div>
          </form>
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className="rounded-2xl bg-white/5 px-3 py-3 text-sm text-white">
                {item.label}
              </Link>
            ))}
            <Link to="/upload" onClick={() => setMobileOpen(false)} className="rounded-2xl bg-white px-3 py-3 text-sm font-medium text-black">
              Upload
            </Link>
          </div>
        </div>
      ) : null}

      <div className="hidden border-t border-white/10 bg-[#101319]/95 md:block">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-3 py-2 sm:px-4 no-scrollbar">
          {quickCategories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="whitespace-nowrap rounded-full border border-white/8 bg-white/3 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground transition hover:border-white/16 hover:text-white"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
