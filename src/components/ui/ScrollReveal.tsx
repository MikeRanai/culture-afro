"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Animation =
  | "fade-up"
  | "fade-in"
  | "fade-down"
  | "slide-left"
  | "slide-right"
  | "zoom-in"
  | "blur-in";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: Animation;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
}

export default function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 700,
  threshold = 0.15,
  once = true,
  className = "",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          if (once) observer.unobserve(el);
        } else if (!once) {
          el.classList.remove("is-visible");
        }
      },
      { threshold, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return (
    <div
      ref={ref}
      className={`reveal reveal-${animation} ${className}`}
      style={{
        "--reveal-duration": `${duration}ms`,
        "--reveal-delay": `${delay}ms`,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
