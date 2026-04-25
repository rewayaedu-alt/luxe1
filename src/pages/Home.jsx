import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getPhotos } from "../lib/content";
import { galleryApi } from "../services/galleryApi";
import { getGalleryPrimaryImage, shuffleList } from "../lib/galleryUtils";
import { optimizeImageUrl } from "../lib/imageUtils";

const PAGE_SIZE = 24;

function createPageSequence(totalPages) {
  return shuffleList(Array.from({ length: totalPages }, (_, index) => index + 1));
}

function buildLocalFeedPage(pageNumber) {
  const allPhotos = shuffleList(getPhotos()).filter((gallery) => getGalleryPrimaryImage(gallery)?.url);
  const safePhotos = allPhotos.length ? allPhotos : [];
  const offset = ((pageNumber - 1) * PAGE_SIZE) % Math.max(safePhotos.length, 1);
  const pageItems = [];

  for (let index = 0; index < PAGE_SIZE && safePhotos.length; index += 1) {
    pageItems.push(safePhotos[(offset + index) % safePhotos.length]);
  }

  return {
    data: pageItems,
    total: safePhotos.length,
  };
}

function LoadingTiles({ count = 12 }) {
  return (
    <div className="columns-2 gap-4 lg:columns-3 2xl:columns-5">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="mb-4 block break-inside-avoid">
          <div className={`overflow-hidden rounded-xl border border-white/8 bg-white/[0.04] shadow-[0_18px_40px_rgba(0,0,0,0.22)] ${index % 5 === 0 ? "aspect-[4/5]" : index % 3 === 0 ? "aspect-[3/4]" : "aspect-[5/6]"}`}>
            <div className="h-full w-full animate-pulse bg-white/[0.06]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function GalleryTile({ gallery }) {
  const previewImage = getGalleryPrimaryImage(gallery);
  const fallbackRatio = useMemo(() => {
    const ratios = ["aspect-[4/5]", "aspect-[3/4]", "aspect-[5/6]", "aspect-[1/1]"];
    return ratios[Math.floor(Math.random() * ratios.length)];
  }, []);

  if (!previewImage?.url) return null;

  const aspectRatioClass =
    previewImage.width && previewImage.height
      ? undefined
      : fallbackRatio;

  return (
    <Link to={`/photo/${gallery.id}`} aria-label={gallery.title || "Open gallery"} className="mb-4 block break-inside-avoid">
      <div className="group overflow-hidden rounded-xl border border-white/8 bg-[#0f1115] shadow-[0_18px_40px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-0.5 hover:border-white/16 [content-visibility:auto]">
        <div
          className={aspectRatioClass}
          style={
            previewImage.width && previewImage.height
              ? { aspectRatio: `${previewImage.width} / ${previewImage.height}` }
              : undefined
          }
        >
          <img
            src={optimizeImageUrl(previewImage.thumbnailUrl || previewImage.url, 1000)}
            alt={previewImage.alt || gallery.title || "Gallery image"}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [galleries, setGalleries] = useState([]);
  const [pageQueue, setPageQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [sortMode, setSortMode] = useState("latest");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [dataSource, setDataSource] = useState("api");
  const sentinelRef = useRef(null);
  const isFetchingRef = useRef(false);

  const loadPage = useCallback(async (pageNumber, sort, { replace = false } = {}) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoadingMore(!replace);

    try {
      const response = dataSource === "api" ? await galleryApi.getGalleries(pageNumber, PAGE_SIZE, sort) : buildLocalFeedPage(pageNumber);
      const randomizedBatch = shuffleList(response.data || []).filter((gallery) => getGalleryPrimaryImage(gallery)?.url);

      setGalleries((current) => {
        if (replace) return randomizedBatch;
        return [...current, ...randomizedBatch];
      });
    } finally {
      isFetchingRef.current = false;
      setIsInitialLoading(false);
      setIsLoadingMore(false);
    }
  }, [dataSource]);

  useEffect(() => {
    let active = true;

    const initializeFeed = async () => {
      setIsInitialLoading(true);
      setGalleries([]);

      try {
        const nextSort = Math.random() > 0.5 ? "latest" : "popular";
        const seedResponse = await galleryApi.getGalleries(1, 1, nextSort);
        if (!active) return;

        const totalPages = Math.max(1, Math.ceil((seedResponse.total || 0) / PAGE_SIZE));
        const nextQueue = createPageSequence(totalPages);
        const firstPage = nextQueue[0] || 1;

        setSortMode(nextSort);
        setPageQueue(nextQueue);
        setQueueIndex(1);
        setDataSource("api");
        await loadPage(firstPage, nextSort, { replace: true });
      } catch {
        if (!active) return;
        const localResponse = buildLocalFeedPage(1);
        const totalPages = Math.max(1, Math.ceil((localResponse.total || 0) / PAGE_SIZE));
        const nextQueue = createPageSequence(totalPages);
        const firstPage = nextQueue[0] || 1;

        setSortMode("latest");
        setPageQueue(nextQueue);
        setQueueIndex(1);
        setDataSource("local");
        await loadPage(firstPage, "latest", { replace: true });
      }
    };

    initializeFeed();

    return () => {
      active = false;
    };
  }, [loadPage]);

  const loadNextBatch = useCallback(async () => {
    if (!pageQueue.length || isFetchingRef.current) return;

    let nextIndex = queueIndex;
    let nextQueue = pageQueue;

    if (nextIndex >= nextQueue.length) {
      nextQueue = createPageSequence(pageQueue.length);
      nextIndex = 0;
      setPageQueue(nextQueue);
    }

    const pageNumber = nextQueue[nextIndex];
    setQueueIndex(nextIndex + 1);
    await loadPage(pageNumber, sortMode);
  }, [loadPage, pageQueue, queueIndex, sortMode]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          loadNextBatch();
        }
      },
      { rootMargin: "1200px 0px" }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, [loadNextBatch]);

  if (isInitialLoading) {
    return (
      <div className="min-h-[60vh] px-2 py-3 sm:px-3 sm:py-4">
        <LoadingTiles count={18} />
      </div>
    );
  }

  return (
    <div className="px-2 py-3 sm:px-3 sm:py-4">
      <div className="columns-2 gap-4 lg:columns-3 2xl:columns-5">
        {galleries.map((gallery, index) => (
          <GalleryTile key={`${gallery.id}-${index}`} gallery={gallery} />
        ))}
      </div>

      {isLoadingMore ? <LoadingTiles count={10} /> : null}

      {!galleries.length && !isLoadingMore ? (
        <div className="py-12 text-center text-sm text-zinc-500">No galleries available yet.</div>
      ) : null}

      <div ref={sentinelRef} className="h-px w-full" aria-hidden="true" />
    </div>
  );
}
