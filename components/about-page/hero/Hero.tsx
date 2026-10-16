"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/about-page/data";
import { scrollToTarget } from "@/lib/about-page/scroll";

const css = `
.hero{position:relative;min-height:100svh;display:flex;flex-direction:column;justify-content:flex-end;overflow:clip}
.hero__ghost{position:absolute;left:50%;top:clamp(88px,15svh,170px);transform:translateX(-50%);font-weight:800;letter-spacing:-.06em;line-height:.9;text-transform:uppercase;
  font-size:clamp(88px,22.5vw,380px);color:transparent;-webkit-text-stroke:1.2px color-mix(in srgb,var(--fg) 16%,transparent);white-space:nowrap;user-select:none;pointer-events:none}
.hero__stage{position:relative;z-index:1;display:flex;justify-content:center;margin-top:4svh;mix-blend-mode:multiply}
.hero__video.hero__video--dark{display:none}
.dark .hero__video.hero__video--light{display:none}
.dark .hero__video.hero__video--dark{display:block}
.dark .hero__stage{mix-blend-mode:screen}
.hero__video{-webkit-mask-image:linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent);mask-image:linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent);height:min(96svh,1040px);aspect-ratio:768/962;max-width:100%;display:block;object-fit:cover;background:transparent}
.hero__copy{position:absolute;z-index:2;left:0;right:0;bottom:clamp(20px,4vh,40px)}
.hero__copy .wrap{display:flex;align-items:flex-end;justify-content:space-between;gap:24px}
.hero__h1{font-size:clamp(44px,7.2vw,116px);font-weight:700;letter-spacing:-.04em;line-height:.94}
.hero__h1 .rv-mask>span{transform:none;animation:hrise 1.1s var(--ease) calc(var(--i,0)*90ms + 120ms) backwards}
@keyframes hrise{from{transform:translateY(108%)}}
@keyframes hfade{from{opacity:0;transform:translateY(24px)}}
.hero__h1 em{display:block;font-family:var(--font-serif);font-style:italic;color:var(--accent);font-weight:400;letter-spacing:-.02em}
.hero__side{display:flex;flex-direction:column;align-items:flex-end;gap:20px;text-align:right;max-width:340px;animation:hfade 1s var(--ease) .5s backwards}
.hero__side p{color:var(--ink-2);font-size:15px;line-height:1.45}
.hero__cta{display:flex;flex-wrap:wrap;gap:10px;justify-content:flex-end}
.hero__loc{position:absolute;z-index:2;left:var(--gutter);top:clamp(84px,12svh,110px);font-family:var(--font-mono);font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}
.hero__snd{position:absolute;z-index:3;right:var(--gutter);top:clamp(84px,12svh,110px);width:46px;height:46px;border-radius:50%;background:var(--accent);color:var(--accent-fg);display:grid;place-items:center;
  transition:transform .5s var(--ease),background .3s}
.hero__snd:hover{transform:scale(1.08);background:var(--accent-hover)}
.hero__snd svg{display:block}
.hero__snd.is-blocked::after{content:"";position:absolute;inset:-2px;border-radius:50%;border:1.5px solid var(--accent);animation:ping 1.8s var(--ease) infinite}
@keyframes ping{0%{transform:scale(1);opacity:.55}100%{transform:scale(1.9);opacity:0}}
@media (max-width:820px){
  .hero{justify-content:flex-start}
  .hero__video{height:62svh;width:auto}
  .hero__stage{margin-top:64px}
  .hero__copy{position:relative;bottom:auto;margin-top:8px}
  .hero__copy .wrap{flex-direction:column;align-items:flex-start;gap:20px}
  .hero__side{align-items:flex-start;text-align:left}
  .hero__cta{justify-content:flex-start}
  .hero__ghost{top:120px}
  .hero__loc{display:none}
}
`;

export default function Hero() {
  const lightRef = useRef<HTMLVideoElement>(null);
  const darkRef = useRef<HTMLVideoElement>(null);
  const root = useRef<HTMLElement>(null);
  const isDark = useRef(false);
  const [on, setOn] = useState(false);
  const [blocked, setBlocked] = useState(false);

  /** the video belonging to the current theme (both share one timeline, so they can be swapped in sync) */
  const cur = useCallback(() => (isDark.current ? darkRef.current : lightRef.current), []);

  const play = useCallback(async () => {
    const v = cur();
    if (!v) return;
    try {
      await v.play();
      setOn(!v.muted);
    } catch {
      v.muted = true;
      setOn(false);
      setBlocked(true);
      v.play().catch(() => {});
    }
  }, [cur]);

  // pick the video for the theme (light = white backdrop, dark = black backdrop) and keep it in sync on toggle
  useEffect(() => {
    const html = document.documentElement;
    const apply = (first: boolean) => {
      const dark = html.classList.contains("dark");
      const prev = isDark.current ? darkRef.current : lightRef.current;
      isDark.current = dark;
      const next = dark ? darkRef.current : lightRef.current;
      if (!next) return;
      next.preload = "auto";
      if (first) {
        next.muted = false;
        play();
        return;
      }
      if (prev && prev !== next) {
        const wasPlaying = !prev.paused;
        next.muted = prev.muted;
        try { next.currentTime = prev.currentTime; } catch {}
        prev.pause();
        if (wasPlaying) next.play().catch(() => {});
      }
    };
    apply(true);
    const mo = new MutationObserver(() => {
      if (html.classList.contains("dark") !== isDark.current) apply(false);
    });
    mo.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, [play]);

  // unlock sound on the first gesture
  useEffect(() => {
    if (!blocked) return;
    const evs = ["pointerdown", "keydown", "touchend"] as const;
    const cleanup = () => evs.forEach((n) => window.removeEventListener(n, unlock));
    function unlock(e: Event) {
      if ((e.target as HTMLElement | null)?.closest?.("[data-sound-btn]")) return;
      const v = cur();
      if (!v) return;
      v.muted = false;
      v.play().then(() => { setOn(true); setBlocked(false); }).catch(() => { v.muted = true; });
      cleanup();
    }
    evs.forEach((n) => window.addEventListener(n, unlock, { passive: true }));
    return cleanup;
  }, [blocked, cur]);

  // pause (so the voice stops) when the hero is mostly out of view; resume on return
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio < 0.35) cur()?.pause();
        else play();
      },
      { threshold: [0, 0.35, 0.5, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [play, cur]);

  const toggle = () => {
    const v = cur();
    if (!v) return;
    if (v.muted) {
      v.muted = false;
      setBlocked(false);
      v.play().catch(() => {});
      setOn(true);
    } else {
      v.muted = true;
      setOn(false);
    }
  };

  return (
    <section id="hero" ref={root} className="hero" aria-label="Introduction">
      <style>{css}</style>
      <p className="hero__loc">{PROFILE.location}</p>
      <div className="hero__ghost" aria-hidden>{PROFILE.first}</div>
      <div className="hero__stage">
        {(["light", "dark"] as const).map((t) => (
          <video
            key={t}
            ref={t === "dark" ? darkRef : lightRef}
            className={`hero__video hero__video--${t}`}
            muted
            loop
            playsInline
            preload="none"
            poster={t === "dark" ? "/hero/poster-dark.webp" : "/hero/poster.webp"}
            aria-label={`${PROFILE.name} introducing himself in a short looping video`}
          >
            <source src={t === "dark" ? "/hero/hero-dark.webm" : "/hero/hero.webm"} type="video/webm" />
            <source src={t === "dark" ? "/hero/hero-dark.mp4" : "/hero/hero.mp4"} type="video/mp4" />
          </video>
        ))}
      </div>
      <button
        type="button"
        data-sound-btn
        className={`hero__snd${blocked ? " is-blocked" : ""}`}
        aria-label={on ? "Mute the introduction" : "Play the introduction with sound"}
        aria-pressed={on}
        onClick={toggle}
      >
        {on ? (
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden><rect x="2" y="1" width="3.5" height="12" rx="1" fill="currentColor" /><rect x="8.5" y="1" width="3.5" height="12" rx="1" fill="currentColor" /></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden><path d="M3 1.4v11.2a.6.6 0 0 0 .9.5l9-5.6a.6.6 0 0 0 0-1L3.9.9a.6.6 0 0 0-.9.5z" fill="currentColor" /></svg>
        )}
      </button>
      <div className="hero__copy">
        <div className="wrap">
          <h1 className="hero__h1">
            <span className="rv-mask"><span>Senior</span></span>
            <span className="rv-mask"><span style={{ "--i": 1 } as React.CSSProperties}>Software</span></span>
            <span className="rv-mask"><span style={{ "--i": 2 } as React.CSSProperties}><em>Engineer.</em></span></span>
          </h1>
          <div className="hero__side">
            <p>{PROFILE.headline}.</p>
            <div className="hero__cta">
              <a className="btn btn-primary" href="#work" onClick={(e) => { e.preventDefault(); scrollToTarget("work"); }}>Explore work</a>
              <a className="btn btn-ghost" href="#contact" onClick={(e) => { e.preventDefault(); scrollToTarget("contact"); }}>Let&rsquo;s talk</a>
              <a className="btn btn-ghost" href={PROFILE.resume} download>Résumé ↓</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
