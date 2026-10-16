"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { prefersReducedMotion } from "./hooks";

let lenis: Lenis | null = null;

export function scrollToTarget(target: string) {
  const el = target === "top" ? null : document.getElementById(target);
  if (lenis) {
    if (el) lenis.scrollTo(el, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else lenis.scrollTo(0, { duration: 1.4 });
  } else if (el) el.scrollIntoView(); // honours scroll-margin-top
  else window.scrollTo(0, 0);
}

export function setScrollLocked(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export function LenisProvider() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true, autoRaf: true });
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);
  return null;
}
