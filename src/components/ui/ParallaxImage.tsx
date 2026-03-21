"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface ParallaxImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  scaleRange?: [number, number]; // [start, end] ex: [1, 1.15]
}

export default function ParallaxImage({
  src,
  alt,
  priority = false,
  sizes = "100vw",
  scaleRange = [1.08, 1],
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(scaleRange[0]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Respect reduced motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    function onScroll() {
      const rect = el!.getBoundingClientRect();
      const viewH = window.innerHeight;

      // 0 = element top at viewport bottom, 1 = element bottom at viewport top
      const progress = Math.min(
        Math.max((viewH - rect.top) / (viewH + rect.height), 0),
        1
      );

      const [from, to] = scaleRange;
      setScale(from + (to - from) * progress);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [scaleRange]);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover will-change-transform transition-none"
        style={{ transform: `scale(${scale})` }}
      />
    </div>
  );
}
