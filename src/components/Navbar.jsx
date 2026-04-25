import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, Shield, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCategories } from "../lib/content";

const navItems = [
  { to: "/", label: "Popular", active: (location) => location.pathname === "/" && (new URLSearchParams(location.search).get("sort") || "popular") === "popular" },
  { to: "/?sort=recent", label: "Recent", active: (location) => location.pathname === "/" && new URLSearchParams(location.search).get("sort") === "recent" },
  { to: "/categories", label: "Categories", active: (location) => location.pathname === "/categories" || location.pathname.startsWith("/category/") },
  { to: "/categories#tags", label: "Tags", active: (location) => location.pathname.startsWith("/tags/") },
  { to: "/stars", label: "Stars", active: (location) => location.pathname === "/stars" || location.pathname.startsWith("/stars/") },
  { to: "/creators", label: "Creators", active: (location) => location.pathname === "/creators" || location.pathname.startsWith("/creators/") },
  { to: "/channels", label: "Channels", active: (location) => location.pathname === "/channels" || location.pathname.startsWith("/channels/") },
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

  const mobileLinks = [...navItems, { to: "/trending", label: "Trending", active: (itemLocation) => itemLocation.pathname.startsWith("/trending") }];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090b10]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-3 sm:px-4">
        <Link to="/" className="flex shrink-0 items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-white transition hover:border-white/20">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">
            <Sparkles className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Directory</span>
            <span className="block text-sm font-semibold">Luxious</span>
          </span>
        </Link>

        <form onSubmit={handleSearch} className="hidden flex-1 lg:block">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search galleries, tags, stars, creators, channels"
              className="h-11 rounded-full border-white/10 bg-white/[0.04] pl-10 pr-4 text-sm"
            />
          </div>
        </form>

        <nav className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) => {
            const active = item.active(location);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active ? "bg-white text-black" : "text-muted-foreground hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Link to="/upload" className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:text-white">
            Admin
          </Link>
          <Link to="/trending">
            <Button className="h-10 rounded-full px-5">
              <Shield className="mr-2 h-4 w-4" />
              Trending
            </Button>
          </Link>
        </div>

        <Button variant="ghost" size="icon" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} className="md:hidden" onClick={() => setMobileOpen((value) => !value)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/10 bg-[#090b10] px-3 py-3 md:hidden">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search"
                className="h-11 rounded-full border-white/10 bg-white/[0.04] pl-10"
              />
            </div>
          </form>
          <div className="grid grid-cols-2 gap-2">
            {mobileLinks.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className="rounded-2xl bg-white/[0.04] px-3 py-3 text-sm text-white">
                {item.label}
              </Link>
            ))}
            <Link to="/upload" onClick={() => setMobileOpen(false)} className="rounded-2xl bg-white px-3 py-3 text-sm font-medium text-black">
              Admin
            </Link>
          </div>
        </div>
      ) : null}

      <div className="hidden border-t border-white/10 bg-[#0d1015]/95 md:block">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-3 py-2 sm:px-4 no-scrollbar">
          {quickCategories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="whitespace-nowrap rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground transition hover:border-white/16 hover:text-white"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
