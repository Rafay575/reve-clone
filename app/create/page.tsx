"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { PromptComposer } from "@/components/prompt-composer";
import {
  txt2img,
  myImages,
  toggleFavorite,
  softDeleteImage,
} from "@/lib/runware"; // You must implement these APIs
import { toast } from "sonner";
import { Heart } from "lucide-react";

type RunwareImage = {
  id: string;
  imageURL: string;
  createdAt: string;
  is_favorite?: boolean;
  is_deleted?: boolean;
};

const ImageGalleryPage: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [images, setImages] = useState<RunwareImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const { images: dbImages } = await myImages();
      const normalized: RunwareImage[] = dbImages.map((img) => ({
        id: String(img.id),
        imageURL: img.imageURL,
        createdAt: img.createdAt,
        is_favorite: !!img.is_favorite,
        is_deleted: !!img.is_deleted,
      }));
      setImages(normalized.filter((img) => !img.is_deleted));
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to load your images.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Favoriting logic
  const handleToggleFavorite = async (favorite: boolean) => {
    const promises = selected.map((id) => toggleFavorite(id, favorite));
    await Promise.all(promises);
    toast.success(favorite ? "Added to favorites!" : "Removed from favorites!");
    await loadImages();
    setSelected([]);
  };

  // Soft delete logic
  const handleDeleteSelected = async () => {
    if (!window.confirm("Delete selected images?")) return;
    const promises = selected.map((id) => softDeleteImage(id));
    await Promise.all(promises);
    toast.success("Deleted!");
    await loadImages();
    setSelected([]);
  };

  // Download logic (client-side)
  const handleDownloadSelected = async () => {
    for (let id of selected) {
      const img = images.find((im) => im.id === id);
      if (!img) continue;
      const res = await fetch(img.imageURL);
      const blob = await res.blob();
      const a = document.createElement("a");
      const date = new Date(img.createdAt);
      const filename = `tivoa_image_${date.toISOString().slice(0, 10).replace(/-/g, "")}.png`;
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
    }
    setSelected([]);
  };

  const favImages = images.filter((img) => img.is_favorite);
  const [gridCols, setGridCols] = useState<number>(() => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("galleryGridCols");
    return saved ? Number(saved) : 4;   // Default 4
  }
  return 4;
});

useEffect(() => {
  localStorage.setItem("galleryGridCols", gridCols.toString());
}, [gridCols]);
const gridClass = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
}[gridCols] || "md:grid-cols-4";
  const handleGenerate = async (payload: any) => {
    try {
      setLoading(true);
      const { images: genImages } = await txt2img(payload);
      const now = new Date().toISOString();
      const normalizedGen: RunwareImage[] = (genImages ?? []).map((img, i) => ({
        ...img,
        id: img.imageUUID ?? img.taskUUID ?? `tmp_${Date.now()}_${i}`,
        createdAt: now,
        imageURL: img.imageURL,
      }));
      setImages((prev) =>
        [...normalizedGen, ...prev].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
      setSelected([]);
      if (normalizedGen.length)
        toast.success(
          `Generated ${normalizedGen.length} image${normalizedGen.length > 1 ? "s" : ""}!`
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
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-black text-white flex flex-col space-y-6 relative">
      {/* Full-screen loader */}
      {loading && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-white" />
        </div>
      )}

      <Navbar
        show={selected.length > 0}
        selected={selected}
        images={images}
        onFavorite={handleToggleFavorite}
        onDelete={handleDeleteSelected}
        onDownload={handleDownloadSelected}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        gridCols={gridCols} setGridCols={setGridCols}
      />

   
      <div className="px-6 py-4">
        {loading ? (
          <div className="text-center text-neutral-500 py-16">Loading...</div>
        ) : (showFavorites ? favImages : images).length === 0 ? (
          <div className="text-center text-neutral-500 py-16">
            {showFavorites
              ? "No favorites yet. Mark images as favorite!"
              : "Generate some images to see them here."}
          </div>
        ) : (
          <div className={`grid grid-cols-1 ${gridClass} gap-2`}>
            {(showFavorites ? favImages : images).map((img) => (
              <div
                key={img.id}
                className={`relative group overflow-hidden cursor-pointer transition transform border-2 rounded-lg ${selected.includes(img.id) ? "border-red-500" : "border-transparent"}`}
                onClick={() => toggleSelect(img.id)}
              >
                <img
                  src={img.imageURL}
                  alt={img.id}
                  className="w-full h-full object-cover transition-transform duration-300"
                />
                {/* Favorite icon always top-right */}
                {img.is_favorite && (
                  <div className="absolute top-2 right-2 z-20">
                    <Heart className="w-5 h-5 text-red-400 drop-shadow" />
                  </div>
                )}
                {/* Circle select button */}
                <div
                  className={`absolute top-2 left-2 bg-black/60 rounded-full w-6 h-6 border-2 border-white flex items-center justify-center transition ${
                    selected.includes(img.id)
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {selected.includes(img.id) && (
                    <div className="bg-white w-3 h-3 rounded-full" />
                  )}
                </div>
                {/* Date */}
                {img.createdAt && (
                  <div className="absolute bottom-2 right-2 text-xs bg-black/60 px-2 py-1 rounded">
                    {new Date(img.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prompt Section */}
      <div className="fixed bottom-4 w-[90%] left-[5%] md:w-[60%] md:left-[20%]">
        <PromptComposer onSubmit={handleGenerate} />
      </div>
    </section>
  );
};

export default ImageGalleryPage;
