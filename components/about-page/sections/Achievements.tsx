"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ACHIEVEMENTS, type Achievement } from "@/lib/about-page/data";
import { prefersReducedMotion, useScrollProgress } from "@/lib/about-page/hooks";
import { SectionTag, Heading } from "../ui/SectionHead";
import TechLogo from "../ui/TechLogo";

const css = `
.ach{position:relative}
.ach__pin{position:sticky;top:0;height:100svh;display:flex;flex-direction:column;justify-content:center;gap:clamp(20px,4.5vh,48px);padding-top:76px;overflow:hidden}
.ach__head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px}
.ach__head .tag{margin-bottom:16px}
.ach__head .h2{font-size:clamp(36px,5.2vw,78px)}
.ach__prog{width:clamp(110px,16vw,220px);flex:none;padding-bottom:10px}
.ach__prog small{display:block;margin-bottom:8px;font-family:var(--font-mono);font-size:11px;letter-spacing:.06em;color:var(--mute);text-align:right}
.ach__bar{height:2px;background:var(--line);border-radius:2px;overflow:hidden}
.ach__bar i{display:block;height:100%;background:var(--accent);transform-origin:0 50%;transform:scaleX(0)}
.ach__track{display:flex;gap:clamp(16px,2vw,28px);padding:30px var(--gutter) 40px;width:max-content;will-change:transform}
.ac{--glow:0;position:relative;flex:none;width:clamp(340px,40vw,540px);height:clamp(260px,36vh,310px);padding:22px 26px 24px;border-radius:28px;background:var(--card);
  box-shadow:var(--hair),0 14px 30px -22px color-mix(in srgb,var(--fg) 25%,transparent);display:flex;flex-direction:column;justify-content:space-between;
  transition:transform .8s var(--ease),box-shadow .8s var(--ease)}
.ac.is-near{transform:translateY(-12px);box-shadow:var(--hair),0 44px 70px -34px color-mix(in srgb,var(--fg) 40%,transparent);--glow:1}
.ac__top{display:flex;align-items:center;justify-content:space-between}
.ac__logo{position:relative;width:72px;height:72px;border-radius:20px;display:grid;place-items:center;background:var(--paper);box-shadow:var(--hair)}
.ac__logo::before{content:"";position:absolute;inset:-10px;border-radius:50%;background:var(--accent);opacity:calc(.04 + var(--glow) * .1);filter:blur(18px);transition:opacity .8s var(--ease);z-index:-1}
.ac__idx{font-family:var(--font-mono);font-size:12px;color:var(--mute)}
.ac__bot{display:flex;align-items:flex-end;justify-content:space-between;gap:16px}
.ac__txt{min-width:0}
.ac__lbl{font-size:clamp(17px,1.6vw,22px);font-weight:600;letter-spacing:-.03em;line-height:1.15}
.ac__cap{margin-top:6px;font-size:13.5px;color:var(--ink-2);line-height:1.35}
.ac__det{margin-top:6px;font-family:var(--font-mono);font-size:10.5px;letter-spacing:.03em;color:var(--mute);line-height:1.45}
.ac__num{flex:none;font-size:clamp(64px,8vw,116px);font-weight:700;letter-spacing:-.045em;line-height:.82;font-variant-numeric:tabular-nums}
.ac__num.w{font-family:var(--font-serif);font-style:italic;font-weight:400;letter-spacing:-.02em;color:var(--mute);font-size:clamp(40px,4.6vw,64px);line-height:.9}
.ach__end{flex:none;align-self:center;padding:0 clamp(24px,4vw,64px);font-family:var(--font-serif);font-style:italic;font-size:clamp(32px,4vw,56px);color:var(--mute);white-space:nowrap}
`;

function Card({ a, i, total }: { a: Achievement; i: number; total: number }) {
  const num = useRef<HTMLSpanElement>(null);
  const card = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = card.current;
    const out = num.current;
    if (!el || !out || a.value === null) return;
    const suffix = a.suffix ?? "";
    if (prefersReducedMotion()) return;
    out.textContent = `0${suffix}`;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const step = (t: number) => {
          const k = Math.min(1, (t - t0) / 1400);
          const eased = 1 - Math.pow(1 - k, 4);
          out.textContent = `${Math.round(eased * a.value!)}${suffix}`;
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [a]);

  return (
    <article ref={card} className="ac" data-card>
      <div className="ac__top">
        <span className="ac__logo"><TechLogo icon={a.icon} size={34} /></span>
        <span className="ac__idx">{String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      </div>
      <div className="ac__bot">
        <div className="ac__txt">
          <h3 className="ac__lbl">{a.label}</h3>
          <p className="ac__cap">{a.caption}</p>
          <p className="ac__det">{a.detail}</p>
        </div>
        {a.value !== null ? (
          <span className="ac__num" ref={num}>{a.value}{a.suffix}</span>
        ) : (
          <span className="ac__num w" aria-hidden>Award</span>
        )}
      </div>
    </article>
  );
}

export default function Achievements() {
  const sec = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  const cnt = useRef<HTMLElement>(null);
  const travel = useRef(0);
  const nearIdx = useRef(-1);
  const [height, setHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const t = track.current;
      if (!t) return;
      travel.current = Math.max(0, t.scrollWidth - window.innerWidth);
      setHeight(window.innerHeight + travel.current);
    };
    measure();
    window.addEventListener("resize", measure);
    const fonts = document.fonts?.ready.then(measure);
    return () => {
      window.removeEventListener("resize", measure);
      void fonts;
    };
  }, []);

  useScrollProgress(
    sec,
    (p) => {
      const t = track.current;
      if (!t) return;
      t.style.transform = `translate3d(${-p * travel.current}px,0,0)`;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      const mid = window.innerWidth / 2;
      let best = -1, bd = Infinity;
      t.querySelectorAll<HTMLElement>("[data-card]").forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - mid);
        if (d < bd) { bd = d; best = i; }
      });
      if (best !== nearIdx.current) {
        const cards = t.querySelectorAll<HTMLElement>("[data-card]");
        cards.forEach((c, i) => c.classList.toggle("is-near", i === best));
        nearIdx.current = best;
        if (cnt.current) cnt.current.textContent = `${String(best + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
      }
    },
    "pin",
  );

  return (
    <section id="achievements" ref={sec} className="ach" style={{ height: height ?? "320svh" }} aria-labelledby="ach-h">
      <style>{css}</style>
      <div className="ach__pin">
        <div className="wrap" style={{ width: "100%" }}>
          <div className="ach__head">
            <div>
              <SectionTag index="06" label="Achievements" />
              <Heading id="ach-h" lines={["Numbers &"]} accent="honours." />
            </div>
            <div className="ach__prog" aria-hidden>
              <small ref={cnt}>01 / {String(ACHIEVEMENTS.length).padStart(2, "0")}</small>
              <div className="ach__bar"><i ref={bar} /></div>
            </div>
          </div>
        </div>
        <div className="ach__track" ref={track}>
          {ACHIEVEMENTS.map((a, i) => (
            <Card key={a.label} a={a} i={i} total={ACHIEVEMENTS.length} />
          ))}
          <p className="ach__end">and counting →</p>
        </div>
      </div>
    </section>
  );
}
