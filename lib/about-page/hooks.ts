"use client";
import { RefObject, useEffect, useRef, useState } from "react";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** true once the element has entered the viewport (fires once by default). */
export function useInView<T extends Element>(opts: { threshold?: number; rootMargin?: string; once?: boolean } = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const { threshold = 0.15, rootMargin = "0px", once = true } = opts;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin, once]);
  return [ref, inView] as const;
}

/**
 * rAF-throttled scroll progress for an element.
 * "through": 0 when the top reaches `anchor` × viewport height, 1 when the bottom does.
 * "pin": 0 when the element's top hits the viewport top, 1 when its sticky range is used up.
 */
export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onProgress: (p: number, el: T) => void,
  mode: "through" | "pin" = "through",
  anchor = 0.6,
) {
  const cb = useRef(onProgress);
  cb.current = onProgress;
  useEffect(() => {
    let raf = 0;
    const run = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p =
        mode === "pin"
          ? clamp(-r.top / Math.max(1, r.height - vh))
          : clamp((vh * anchor - r.top) / Math.max(1, r.height));
      cb.current(p, el);
    };
    const tick = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    run();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    return () => {
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, mode, anchor]);
}
