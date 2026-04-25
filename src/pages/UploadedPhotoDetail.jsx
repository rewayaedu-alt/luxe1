import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Images, Info, Tag, Tv2, User, Verified, X } from "lucide-react";
import { createDemoPreview, getAlbumBySlug, getCategoryById, getChannelBySlug, getPhotoById, getStarBySlug } from "../lib/content";
import { getFastImageUrl, getOriginalImageUrl } from "../lib/imageUtils";

export default function UploadedPhotoDetail() {
  const { photoId } = useParams();
  const location = useLocation();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const preview = location.state?.preview || getPhotoById(photoId) || createDemoPreview({ id: photoId });

  if (!preview) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-semibold">This preview no longer exists</h1>
        <p className="mt-3 text-sm text-muted-foreground">Uploaded previews are temporary and are not stored as part of the local catalog.</p>
        <Link to="/upload" className="mt-6 inline-flex rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background">
          Create another preview
        </Link>
      </div>
    );
  }

  const category = getCategoryById(preview.category);
  const channel = getChannelBySlug(preview.channel);
  const album = getAlbumBySlug(preview.album);
  const star = getStarBySlug(preview.star);
  const previewImageUrl = getFastImageUrl(preview, 1400, 82);
  const originalImageUrl = getOriginalImageUrl(preview);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/upload" className="inline-flex items-center text-sm font-medium text-muted-foreground transition hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to demo upload
      </Link>

      <section className="mt-4 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/85 shadow-[0_22px_60px_rgba(18,20,34,0.08)]">
          <button type="button" onClick={() => setLightboxOpen(true)} className="block w-full text-left">
            <img
              src={previewImageUrl}
              alt={preview.title}
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full object-cover"
            />
          </button>
        </div>
        <aside className="rounded-[2rem] border border-border/70 bg-card/85 p-8 shadow-[0_22px_60px_rgba(18,20,34,0.08)]">
          <div className="flex items-start gap-3 rounded-[1.5rem] bg-secondary/70 p-4">
            <Info className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Preview only</p>
              <p className="mt-1 text-sm leading-7 text-muted-foreground">
                This page is local-only. Items can live in browser storage for this device, but nothing is sent to any backend.
              </p>
            </div>
          </div>

          <h1 className="mt-6 text-4xl font-semibold">{preview.title}</h1>
          <p className="mt-4 text-sm leading-8 text-muted-foreground">{preview.description}</p>

          <div className="mt-6 flex items-center gap-3 rounded-[1.5rem] bg-secondary/70 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-background">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{preview.photographer}</p>
              <p className="text-sm text-muted-foreground">Demo submission owner</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {category && (
              <div className="rounded-[1.5rem] bg-secondary/70 p-4">
                <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Category</p>
                <p className="mt-2 text-lg font-semibold">{category.name}</p>
              </div>
            )}
            {channel && (
              <div className="rounded-[1.5rem] bg-secondary/70 p-4">
                <div className="flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-muted-foreground">
                  <Tv2 className="h-4 w-4" />
                  Channel
                </div>
                <p className="mt-2 text-lg font-semibold">{channel.name}</p>
              </div>
            )}
            {album && (
              <div className="rounded-[1.5rem] bg-secondary/70 p-4">
                <div className="flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-muted-foreground">
                  <Images className="h-4 w-4" />
                  Album
                </div>
                <p className="mt-2 text-lg font-semibold">{album.name}</p>
              </div>
            )}
            {star && (
              <div className="rounded-[1.5rem] bg-secondary/70 p-4">
                <div className="flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-muted-foreground">
                  <Verified className="h-4 w-4" />
                  Star
                </div>
                <p className="mt-2 text-lg font-semibold">{star.name}</p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Tag className="h-4 w-4" />
              Tags
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(preview.tags || []).map((tag) => (
                <span key={tag} className="rounded-full border border-border px-3 py-1 text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {lightboxOpen ? (
        <div className="fixed inset-0 z-[70] bg-black/90 px-3 py-4 sm:px-6 sm:py-6">
          <div className="mx-auto flex h-full max-w-7xl flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-white">{preview.title}</h2>
              <button type="button" onClick={() => setLightboxOpen(false)} aria-label="Close preview" className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-black">
              <img
                src={originalImageUrl}
                alt={preview.title}
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
