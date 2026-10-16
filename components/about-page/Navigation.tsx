"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { NAV, PROFILE } from "@/lib/about-page/data";
import { scrollToTarget, setScrollLocked } from "@/lib/about-page/scroll";

const css = `
.nav{position:fixed;inset:0 0 auto 0;z-index:50;pointer-events:none}
.nav__bar{height:2px;background:var(--accent);transform-origin:0 50%;transform:scaleX(0);will-change:transform}
.nav__row{display:flex;align-items:center;justify-content:space-between;padding:14px var(--gutter);gap:16px}
.nav__row>*{pointer-events:auto}
.nav__brand{display:flex;align-items:center;gap:12px;font-weight:600;letter-spacing:-.02em}
.nav__mark{height:32px;display:flex;align-items:center}
.nav__mark img{height:100%;width:auto;display:block}
.nav__mark .mk-light{display:none}
.dark .nav__mark .mk-dark{display:none}
.dark .nav__mark .mk-light{display:block}
.nav__name{transition:opacity .5s var(--ease),transform .5s var(--ease);white-space:nowrap}
.nav.is-scrolled .nav__name{opacity:0;transform:translateX(-8px);pointer-events:none}
.nav__pill{position:relative;display:flex;padding:5px;border-radius:999px;transition:background .4s var(--ease),box-shadow .4s var(--ease),backdrop-filter .4s}
.nav.is-scrolled .nav__pill{background:color-mix(in srgb,var(--surface) 75%,transparent);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:var(--hair),0 10px 30px -14px color-mix(in srgb,var(--fg) 30%,transparent)}
.nav__ind{position:absolute;top:5px;bottom:5px;left:0;border-radius:999px;background:var(--accent);opacity:0;
  transition:transform .6s var(--ease),width .6s var(--ease),opacity .3s}
.nav__link{position:relative;z-index:1;padding:9px 16px;border-radius:999px;font-size:14px;font-weight:500;letter-spacing:-.01em;color:var(--ink-2);transition:color .35s var(--ease)}
.nav__link:hover{color:var(--fg)}
.nav__link.is-active{color:var(--accent-fg)}
.nav__menu{display:none;height:44px;padding:0 20px;border-radius:999px;font-size:14px;font-weight:500;background:var(--accent);color:var(--accent-fg)}
.nav__ov{position:fixed;inset:0;z-index:60;background:var(--bg);clip-path:inset(0 0 100% 0);visibility:hidden;
  transition:clip-path .9s var(--ease),visibility 0s .9s;display:flex;flex-direction:column;padding:14px var(--gutter) 40px;overflow-y:auto}
.nav__ov.is-open{clip-path:inset(0 0 0 0);visibility:visible;transition:clip-path .9s var(--ease),visibility 0s}
.nav__ovtop{display:flex;justify-content:space-between;align-items:center;min-height:44px}
.nav__ovlist{margin-block:auto;padding-block:32px}
.nav__ovlink{display:flex;align-items:baseline;gap:14px;padding:6px 0;font-size:clamp(44px,13vw,84px);font-weight:700;letter-spacing:-.03em;line-height:1.02;
  opacity:0;transform:translateY(40px);transition:opacity .6s var(--ease),transform .9s var(--ease);transition-delay:0s}
.nav__ovlink small{font-family:var(--font-mono);font-size:12px;font-weight:400;letter-spacing:0;color:var(--mute)}
.nav__ov.is-open .nav__ovlink{opacity:1;transform:none;transition-delay:calc(.25s + var(--i)*70ms)}
.nav__ovfoot{font-family:var(--font-mono);font-size:12px;color:var(--mute)}
.nav__right{display:flex;align-items:center;gap:10px}
.nav__theme{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;color:var(--fg);background:color-mix(in srgb,var(--surface) 75%,transparent);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);
  box-shadow:var(--hair);transition:transform .5s var(--ease),background .3s,color .3s}
.nav__theme:hover{transform:rotate(25deg) scale(1.06);background:var(--accent);color:var(--accent-fg)}
.nav__theme svg{display:block}
@media (max-width:900px){.nav__pill{display:none}.nav__menu{display:block}}
`;

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const ovRef = useRef<HTMLDivElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const [ind, setInd] = useState({ x: 0, w: 0 });
  const [dark, setDark] = useState(false);

  // theme: follows the .dark class on <html> (set by the init script / localStorage 'theme')
  useEffect(() => {
    const html = document.documentElement;
    const sync = () => setDark(html.classList.contains("dark"));
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);
  const toggleTheme = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
  };

  useEffect(() => {
    let raf = 0;
    const run = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      setScrolled(y > 40);
    };
    const tick = () => { if (!raf) raf = requestAnimationFrame(run); };
    run();
    window.addEventListener("scroll", tick, { passive: true });
    return () => { window.removeEventListener("scroll", tick); if (raf) cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    const ids = ["hero", ...NAV.map((n) => n.id)];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => { for (const e of entries) if (e.isIntersecting) setActive(e.target.id === "hero" ? null : e.target.id); },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const measure = useCallback(() => {
    const a = pillRef.current?.querySelector<HTMLElement>(".is-active");
    if (a) setInd({ x: a.offsetLeft, w: a.offsetWidth });
  }, []);
  useLayoutEffect(measure, [active, measure]);
  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    setScrollLocked(open);
    if (!open) return;
    const links = ovRef.current?.querySelectorAll<HTMLElement>("a,button") ?? [];
    links[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      } else if (e.key === "Tab" && links.length) {
        const first = links[0], last = links[links.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); setScrollLocked(false); };
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    window.setTimeout(() => scrollToTarget(id), open ? 350 : 0);
  };

  return (
    <>
      <style>{css}</style>
      <header className={`nav${scrolled ? " is-scrolled" : ""}`}>
        <div className="nav__bar" ref={barRef} aria-hidden />
        <div className="nav__row">
          <a href="#hero" className="nav__brand" onClick={go("top")}>
            <span className="nav__mark" aria-hidden>
              {/* Same BM monogram as the main site; the ink variant follows the .dark class. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="mk-dark" src="/images/mark-dark.png" alt="" width={703} height={352} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="mk-light" src="/images/mark-light.png" alt="" width={809} height={411} />
            </span>
            <span className="nav__name">{PROFILE.name}</span>
          </a>
          <div className="nav__right">
            <nav aria-label="Primary">
              <div className="nav__pill" ref={pillRef}>
                <span className="nav__ind" aria-hidden style={{ width: ind.w, transform: `translateX(${ind.x}px)`, opacity: active ? 1 : 0 }} />
                {NAV.map((n) => (
                  <a key={n.id} href={`#${n.id}`} className={`nav__link${active === n.id ? " is-active" : ""}`} aria-current={active === n.id ? "location" : undefined} onClick={go(n.id)}>
                    {n.label}
                  </a>
                ))}
              </div>
            </nav>
            <button type="button" className="nav__theme" onClick={toggleTheme} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                {dark ? (
                  <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>
                ) : (
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />
                )}
              </svg>
            </button>
            <button ref={menuBtn} className="nav__menu" aria-expanded={open} aria-controls="nav-overlay" onClick={() => setOpen(true)}>
              Menu
            </button>
          </div>
        </div>
      </header>
      <div id="nav-overlay" ref={ovRef} className={`nav__ov${open ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!open}>
        <div className="nav__ovtop">
          <span className="mono" style={{ fontSize: 12, color: "var(--mute)" }}>{PROFILE.name}</span>
          <button className="nav__menu" style={{ display: "block" }} onClick={() => { setOpen(false); menuBtn.current?.focus(); }} tabIndex={open ? 0 : -1}>
            Close
          </button>
        </div>
        <ul className="nav__ovlist">
          {NAV.map((n, i) => (
            <li key={n.id}>
              <a href={`#${n.id}`} className="nav__ovlink" style={{ "--i": i } as CSSProperties} onClick={go(n.id)} tabIndex={open ? 0 : -1}>
                <small>{String(i + 1).padStart(2, "0")}</small>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="nav__ovfoot">{PROFILE.role} · {PROFILE.location}</p>
      </div>
    </>
  );
}
