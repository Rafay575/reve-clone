"use client";

import JSZip from "jszip";
import React, { useEffect, useState, useRef } from "react";

import Navbar from "@/components/Navbar";
import { PromptComposer } from "@/components/prompt-composer";
import {
  txt2img,
  myImages,
  toggleFavorite,
  softDeleteImage,
} from "@/lib/runware";
import { toast } from "sonner";
import { Heart } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Skeleton block (kept for reuse)
// ─────────────────────────────────────────────────────────────
const SkeletonImage = ({ ratio = "3/2" }: { ratio?: string }) => (
  <div
    className={`animate-pulse bg-neutral-800 rounded-lg aspect-[${ratio}]`}
    style={{ aspectRatio: ratio.replace("/", "/") }}
  />
);

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const parseAR = (r?: string) => {
  if (!r) return 1;
  const parts = String(r).split(/[^\d]+/).filter(Boolean);
  const w = Number(parts[0]) || 1;
  const h = Number(parts[1]) || 1;
  return w / h;
};

// Observe container width to compute justified rows
const useContainerWidth = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = React.useState(0);
  React.useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (cr?.width) setW(cr.width);
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
};

// Types
type RunwareImage = {
  id: string;
  imageURL: string;
  createdAt: string;
  is_favorite?: boolean;
  is_deleted?: boolean;
};
type ImgAspectMap = Record<string, string>;
type Box = { id: string; src: string; ar: number; img: RunwareImage };

// Build rows with exactly `cols` items per row.
// Last (partial) row width is computed as if missing slots were `placeholderAR`.
const buildRowsByCount = (
  boxes: Box[],
  cols: number,
  containerWidth: number,
  gap: number,
  placeholderAR = 1
) => {
  const rows: Array<Array<{ box: Box; w: number; h: number }>> = [];

  for (let i = 0; i < boxes.length; i += cols) {
    const slice = boxes.slice(i, i + cols);
    const actualCount = slice.length;

    const gapsFull = gap * Math.max(0, cols - 1);
    const sumARActual = slice.reduce((s, b) => s + (b.ar || 1), 0);

    const missing = Math.max(0, cols - actualCount);
    const sumARFull = sumARActual + missing * placeholderAR;

    // Height as if row were full; real items get widths from their own ARs
    const h = Math.floor((containerWidth - gapsFull) / Math.max(sumARFull, 1));

    const row = slice.map((box) => ({
      box,
      w: Math.round(h * (box.ar || 1)),
      h,
    }));

    rows.push(row);
  }

  return rows;
};

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────
const ImageGalleryPage: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [images, setImages] = useState<RunwareImage[]>([]);
  const [loading, setLoading] = useState(false); // kept for disabling buttons
  const [showFavorites, setShowFavorites] = useState(false);
  const [aspectRatios, setAspectRatios] = useState<ImgAspectMap>({});
  const [loadedIds, setLoadedIds] = useState<Record<string, boolean>>({}); // track img load state

  const [gridCols, setGridCols] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("galleryGridCols");
      return saved ? Number(saved) : 4;
    }
    return 4;
  });

  useEffect(() => {
    localStorage.setItem("galleryGridCols", gridCols.toString());
  }, [gridCols]);

  // Pending skeleton descriptors (used for generation + initial load)
  const [pendingImages, setPendingImages] = useState<
    { ratio: string; key: string }[]
  >([]);

  // Load images on mount (with initial skeletons)
  useEffect(() => {
    loadImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Derive aspect ratios when images arrive (first-time only per id)
  useEffect(() => {
    if (!images.length) return;

    images.forEach((img) => {
      if (aspectRatios[img.id]) return;

      const imageObj = new window.Image();
      imageObj.onload = function () {
        const width = imageObj.width;
        const height = imageObj.height;
        function gcd(a: number, b: number): number {
          return b === 0 ? a : gcd(b, a % b);
        }
        const divisor = gcd(width, height);
        const ratio = `${Math.round(width / divisor)}/${Math.round(
          height / divisor
        )}`;
        setAspectRatios((prev) => ({
          ...prev,
          [img.id]: ratio,
        }));
      };
      imageObj.src = img.imageURL;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  const loadImages = async () => {
    try {
      setLoading(true);

      // Seed initial skeletons (e.g., 2 rows worth)
      const initialCols = Math.min(Math.max(gridCols, 2), 5);
      const initialCount = Math.max(initialCols * 2, 6);
      setPendingImages(
        Array.from({ length: initialCount }).map((_, i) => ({
          ratio: "3/2",
          key: `initial_${Date.now()}_${i}`,
        }))
      );

      const { images: dbImages } = await myImages();
      const normalized: RunwareImage[] = dbImages.map((img) => ({
        id: String(img.id),
        imageURL: img.imageURL,
        createdAt: img.createdAt,
        is_favorite: !!img.is_favorite,
        is_deleted: !!img.is_deleted,
      }));
      console.log("Loaded images ->", normalized);
      setImages(normalized.filter((img) => !img.is_deleted));
      setLoadedIds({}); // reset per-image loaded flags on fresh load
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to load your images.");
    } finally {
      setLoading(false);
      setPendingImages([]); // clear initial skeletons once data arrives
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Favoriting
  // put near other helpers
const isNumericId = (v?: string) => !!v && /^\d+$/.test(v);

// Favoriting logic
const handleToggleFavorite = async (favorite: boolean) => {
  // Only backend-known numeric IDs
  const backendIds = selected
    .map((id) => images.find((im) => im.id === id)?.id)
    .filter(isNumericId) as string[];

  const pendingCount = selected.length - backendIds.length;
  if (pendingCount > 0) {
    toast.info("Some new images are still saving. Syncing…");
    await loadImages();
  }
  if (!backendIds.length) return;

  await Promise.all(backendIds.map((id) => toggleFavorite(id, favorite)));
  toast.success(favorite ? "Added to favorites!" : "Removed from favorites!");
  await loadImages();
  setSelected([]);
};

// Soft delete logic
const handleDeleteSelected = async () => {
  if (!window.confirm("Delete selected images?")) return;

  const backendIds = selected
    .map((id) => images.find((im) => im.id === id)?.id)
    .filter(isNumericId) as string[];

  const pendingCount = selected.length - backendIds.length;
  if (pendingCount > 0) {
    toast.info("Some new images are still saving. Syncing…");
    await loadImages();
  }
  if (!backendIds.length) return;

  await Promise.all(backendIds.map((id) => softDeleteImage(id)));
  toast.success("Deleted!");
  await loadImages();
  setSelected([]);
};


  // Download (unchanged, but unique single-file name preserved)
  const handleDownloadSelected = async () => {
    if (selected.length === 1) {
      const id = selected[0];
      const img = images.find((im) => im.id === id);
      if (!img) return;

      const res = await fetch(img.imageURL);
      const blob = await res.blob();
      const date = new Date(img.createdAt);
      const datePart = date.toISOString().slice(0, 10).replace(/-/g, "");

      const now = new Date();
      const hhmmss =
        now.toISOString().slice(11, 19).replace(/:/g, "") +
        now.getMilliseconds().toString().padStart(3, "0");

      const filename = `tivoa_image_${datePart}_${hhmmss}.png`;

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
    } else if (selected.length > 1) {
      const zip = new JSZip();

      await Promise.all(
        selected.map(async (id, idx) => {
          const img = images.find((im) => im.id === id);
          if (!img) return;
          const res = await fetch(img.imageURL);
          const blob = await res.blob();
          const date = new Date(img.createdAt);
          const datePart = date.toISOString().slice(0, 10).replace(/-/g, "");
          const filename = `tivoa_image_${datePart}_${idx + 1}.png`;
          zip.file(filename, blob);
        })
      );

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipName = `tivoa_images_${new Date()
        .toISOString()
        .slice(0, 10)}.zip`;

      const a = document.createElement("a");
      a.href = URL.createObjectURL(zipBlob);
      a.download = zipName;
      a.click();
    }

    setSelected([]);
  };

  const favImages = images.filter((img) => img.is_favorite);

  // Generate (kept same; adds pending skeletons that match requested ratio/count)
  const handleGenerate = async (payload: any) => {
    try {
      setLoading(true);

      const numImages = parseInt(payload.numImages || 1, 10);
      const aspectRatio = payload.aspectRatio || "1:1";

      setPendingImages(
        Array.from({ length: numImages }).map((_, i) => ({
          ratio: aspectRatio.replace(":", "/"),
          key: `pending_${Date.now()}_${i}`,
        }))
      );

      const { images: genImages } = await txt2img(payload);
      const now = new Date().toISOString();
      const normalizedGen: RunwareImage[] = (genImages ?? []).map((img, i) => ({
        ...img,
        id: img.imageUUID ?? img.taskUUID ?? `tmp_${Date.now()}_${i}`,
        createdAt: now,
        imageURL: img.imageURL,
      }));

      // Pre-mark new images as not loaded (for overlay)
      const freshLoaded: Record<string, boolean> = {};
      normalizedGen.forEach((im) => (freshLoaded[String(im.id)] = false));
      setLoadedIds((prev) => ({ ...prev, ...freshLoaded }));

      setImages((prev) =>
        [...normalizedGen, ...prev].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
      setSelected([]);

      if (normalizedGen.length)
        toast.success(
          `Generated ${normalizedGen.length} image${
            normalizedGen.length > 1 ? "s" : ""
          }!`
        );
      else toast.info("No images returned.");
    } catch (e: any) {
      console.error(e);
      if (e.status === 402 && e.meta?.error === "INSUFFICIENT_CREDITS") {
        toast.error(
          `Not enough credits. Need ${e.meta.needed}, you have ${e.meta.have}.`
        );
      } else if (e.status === 401) {
        toast.error("You must be logged in.");
      } else {
        toast.error(e.message || "Something went wrong.");
      }
    } finally {
      setPendingImages([]); // remove generation skeletons after done
      setLoading(false);
    }
  };

  // Which images to show
  const displayImages = showFavorites ? favImages : images;

  // Layout data
 // Layout data
const [wrapRef, containerWidth] = useContainerWidth();
const gap = 8; // px; match your Tailwind gap-2

const boxes: Box[] = displayImages.map((img) => ({
  id: img.id,
  src: img.imageURL,
  ar: parseAR(aspectRatios[img.id]) || 1,
  img,
}));

const cols = Math.min(Math.max(gridCols, 2), 5);

// Build "pending" boxes that will be shown inside the same grid
const pendingBoxes: Box[] = pendingImages.map((p, i) => ({
  id: `pending_${i}`,
  src: "",                 // no image yet
  ar: parseAR(p.ratio) || 1,
  img: {
    id: `pending_${i}`,
    imageURL: "",
    createdAt: new Date().toISOString(),
  } as RunwareImage,
}));

// IMPORTANT: merge pending first so they appear at the front (newest first behavior)
// If you prefer them at the end, use [...boxes, ...pendingBoxes]
const allBoxes: Box[] = [...pendingBoxes, ...boxes];

const rows =
  containerWidth > 0
    ? buildRowsByCount(allBoxes, cols, containerWidth, gap)
    : [];


  return (
    <section className="min-h-screen bg-black text-white flex flex-col space-y-6 relative">
      <Navbar
        show={selected.length > 0}
        selected={selected}
        images={images}
        onFavorite={handleToggleFavorite}
        onDelete={handleDeleteSelected}
        onDownload={handleDownloadSelected}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        gridCols={gridCols}
        setGridCols={setGridCols}
      />

      <div className="px-6 py-4" ref={wrapRef}>
     {rows.map((row, ri) => (
  <div key={ri} className="flex gap-1 mb-1">
    {row.map(({ box, w, h }) => {
      const isPending = box.id.startsWith("pending_");
      return (
        <div
          key={box.id}
          className={`relative group overflow-hidden cursor-pointer transition transform border-2 ${
            selected.includes(box.id) ? "border-red-500" : "border-transparent"
          } ${isPending ? "pointer-events-none" : ""}`} // pending not clickable
          style={{ width: w, height: h }}
          onClick={() => !isPending && toggleSelect(box.id)}
        >
          {isPending ? (
            // PENDING: show skeleton block only
            <div className="absolute inset-0 animate-pulse bg-neutral-800" />
          ) : (
            <>
              {/* skeleton overlay until the image loads */}
              {!loadedIds[box.id] && (
                <div className="absolute inset-0 animate-pulse bg-neutral-800" />
              )}

              <img
                src={box.src}
                alt={box.id}
                className="absolute inset-0 w-full h-full object-cover"
                onLoad={(e) => {
                  const el = e.currentTarget;
                  const w0 = el.naturalWidth, h0 = el.naturalHeight;
                  if (w0 && h0) {
                    const gcd = (a: number, b: number): number =>
                      b === 0 ? a : gcd(b, a % b);
                    const d = gcd(w0, h0);
                    const r = `${Math.round(w0 / d)}/${Math.round(h0 / d)}`;
                    setAspectRatios((prev) =>
                      prev[box.id] ? prev : { ...prev, [box.id]: r }
                    );
                  }
                  setLoadedIds((prev) => ({ ...prev, [box.id]: true }));
                }}
              />

              {/* Favorite badge */}
              {box.img.is_favorite && (
                <div className="absolute top-2 right-2 z-10">
                  <Heart className="w-5 h-5 text-red-400 drop-shadow" />
                </div>
              )}

              {/* Selection dot */}
              <div
                className={`absolute top-2 left-2 bg-black/60 rounded-full w-6 h-6 border-2 border-white flex items-center justify-center transition ${
                  selected.includes(box.id)
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              >
                {selected.includes(box.id) && (
                  <div className="bg-white w-3 h-3 rounded-full" />
                )}
              </div>

              {/* Date */}
              {box.img.createdAt && (
                <div className="absolute bottom-2 right-2 text-xs bg-black/60 px-2 py-1 rounded">
                  {new Date(box.img.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              )}
            </>
          )}
        </div>
      );
    })}
  </div>
))}

      </div>

      {/* Prompt Section */}
      <div
        className="fixed bottom-4 w-[90%] left-[5%] md:w-[60%] md:left-[20%]"
        style={{ zIndex: 21 }}
      >
        <PromptComposer onSubmit={handleGenerate} />
      </div>
    </section>
  );
};

export default ImageGalleryPage;
