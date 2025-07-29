"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const IMAGES = [
  { src: "/image/a.jpeg", top: "10%", left: "20%", size: 220, rotation: -6, speed: 0.2 },
  { src: "/image/a.jpeg", top: "30%", left: "65%", size: 180, rotation: 4, speed: 0.4 },
  { src: "/image/a.jpeg", top: "50%", left: "40%", size: 250, rotation: -3, speed: 0.1 },
  { src: "/image/a.jpeg", top: "70%", left: "25%", size: 190, rotation: 5, speed: 0.5 },
  { src: "/image/a.jpeg", top: "80%", left: "70%", size: 220, rotation: -4, speed: 0.3 },
];

export default function ParallaxMosaic() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLImageElement>(".mosaic-img").forEach((img) => {
        const speed = Number(img.dataset.speed);
        gsap.to(img, {
          y: () => 200 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.Tivoart();
  }, []);

  return (
    <section ref={containerRef} className="relative h-[150vh] bg-black overflow-hidden">
      {IMAGES.map((img, i) => (
        <img
          key={i}
          src={img.src}
          alt=""
          className="mosaic-img absolute will-change-transform"
          data-speed={img.speed}
          style={{
            top: img.top,
            left: img.left,
            width: img.size,
            transform: `rotate(${img.rotation}deg)`,
            filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.3))",
          }}
        />
      ))}
    </section>
  );
}
