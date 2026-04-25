import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="relative isolate">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(238,71,91,0.12),transparent_38%),radial-gradient(circle_at_20%_20%,rgba(80,130,255,0.08),transparent_28%)]" />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
