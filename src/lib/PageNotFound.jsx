import { Link, useLocation } from "react-router-dom";

export default function PageNotFound() {
  const location = useLocation();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4 py-16">
      <div className="w-full rounded-[2rem] border border-border/70 bg-card/85 p-10 text-center shadow-[0_22px_60px_rgba(18,20,34,0.08)]">
        <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">404</p>
        <h1 className="mt-3 font-display text-5xl">This route does not exist</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
          We could not find <span className="font-medium text-foreground">{location.pathname}</span>. Jump back into the catalog or explore one of the featured sections below.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background">Home</Link>
          <Link to="/channels" className="rounded-full border border-border px-5 py-3 text-sm font-semibold">Channels</Link>
          <Link to="/upload" className="rounded-full border border-border px-5 py-3 text-sm font-semibold">Demo upload</Link>
        </div>
      </div>
    </div>
  );
}
