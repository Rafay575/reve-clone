"use client";

import React from "react";
import { useState } from "react";

const images = [
  { id: 1, url: "/image/a.jpeg", date: "July 3, 2025" },
  { id: 2, url: "/image/a.jpeg", date: "July 3, 2025" },
  { id: 3, url: "/image/a.jpeg", date: "July 3, 2025" },
  { id: 4, url: "/image/a.jpeg", date: "July 3, 2025" },
];

import { Upload } from "lucide-react";
import Navbar from "@/components/Navbar";

const ImageGalleryPage: React.FC = () => {
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  return (
    <>
      <Navbar show={selected.length > 0} />
      <section className="min-h-screen bg-black text-white p-4 flex flex-col space-y-6">
        {/* Image Grid */}
        <div className=" px-6 py-4">
       
          <div className="grid grid-cols-4 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className={`relative group rounded-lg overflow-hidden cursor-pointer transition transform ${
                  selected.includes(img.id) ? "scale-105" : "hover:scale-105"
                }`}
                onClick={() => toggleSelect(img.id)}
              >
                <img
                  src={img.url}
                  alt="Car"
                  className="w-full h-full object-cover rounded-lg transition-transform duration-300"
                />
                {/* Hover Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

                {/* Date at Bottom Right */}
                <div className="absolute bottom-2 right-2 text-sm bg-black/60 px-2 py-1 rounded">
                  {img.date}
                </div>

                {/* Circle Select Button */}
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

                {/* Border if Selected */}
                {selected.includes(img.id) && (
                  <div className="absolute inset-0 border-4 border-purple-500 rounded-lg pointer-events-none" />
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Image Prompt Section */}

        <div className="flex  w-full md:w-3/4 lg:w-1/2 mx-auto fixed bottom-6 left-1/2 -translate-x-1/2 flex-col  items-center md:items-start gap-4 bg-gray-600 backdrop-blur-md p-5 rounded-xl shadow-lg border border-gray-500">
          <div className="flex items-center w-full gap-2">
            <input
              type="text"
              placeholder="Type text and create images..."
              className="flex-1 w-full  p-3 rounded-md bg-black border border-gray-500 text-white outline-none placeholder-gray-500 focus:ring-2 focus:ring-purple-500 transition"
            />
            <button className="p-3 bg-purple-600 rounded-md hover:bg-purple-500 transition text-white shadow-md">
              <Upload className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-2 flex-wrap justify-center md:justify-start">
            <button className="bg-black px-4 py-2 rounded-md text-sm hover:bg-gray-500 transition">
              3:2
            </button>
            <button className="bg-black px-4 py-2 rounded-md text-sm hover:bg-gray-500 transition">
              4 images
            </button>
            <button className="bg-black px-4 py-2 rounded-md text-sm hover:bg-gray-500 transition">
              Enhance on
            </button>
            <button className="bg-black px-4 py-2 rounded-md text-sm hover:bg-gray-500 transition">
              Auto
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ImageGalleryPage;
