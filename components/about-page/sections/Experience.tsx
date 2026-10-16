"use client";
import { useRef } from "react";
import { EDUCATION, EXPERIENCE } from "@/lib/about-page/data";
import { useScrollProgress } from "@/lib/about-page/hooks";
import { scrollToTarget } from "@/lib/about-page/scroll";
import { SectionHead } from "../ui/SectionHead";

const css = `
.tline{--yw:170px;position:relative;margin-top:clamp(48px,7vh,88px)}
.tl__spine{position:absolute;top:8px;bottom:8px;left:calc(var(--yw) + 24px + 11px);width:2px;background:var(--line);border-radius:2px}
.tl__spine i{position:absolute;inset:0;background:var(--accent);transform-origin:0 0;transform:scaleY(0);border-radius:2px;will-change:transform}
.stop{position:relative;display:grid;grid-template-columns:var(--yw) 24px minmax(0,1fr);column-gap:24px;padding-bottom:clamp(40px,7vh,72px)}
.stop .yr{font-family:var(--font-mono);font-size:13px;color:var(--mute);padding-top:2px;text-align:right;transition:color .6s var(--ease)}
.stop .dot{width:24px;height:24px;border-radius:50%;background:var(--paper);box-shadow:inset 0 0 0 2px var(--line);display:grid;place-items:center;transition:box-shadow .6s var(--ease),background .6s var(--ease)}
.stop .dot::after{content:"";width:8px;height:8px;border-radius:50%;background:var(--faint);transition:background .6s var(--ease),transform .6s var(--ease)}
.stop .bd{transform:translateY(8px);transition:transform .8s var(--ease)}
.stop .bd h3,.stop .bd .dt{color:var(--mute);transition:color .8s var(--ease)}
.stop .kind{font-family:var(--font-mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
.stop h3{font-size:clamp(22px,2.6vw,36px);font-weight:700;letter-spacing:-.045em;line-height:1.1;margin-top:6px}
.stop .pl{margin-top:6px;color:var(--mute);font-size:15px}
.stop .dt{margin-top:12px;max-width:62ch;color:var(--ink-2);font-size:15px}
.stop.lit .yr{color:var(--ink)}
.stop.lit .dot{background:var(--card);box-shadow:inset 0 0 0 2px var(--ink)}
.stop.lit .dot::after{background:var(--accent);transform:scale(1.25)}
.stop.lit .bd{transform:none}
.stop.lit .bd h3{color:var(--ink)}
.stop.lit .bd .dt{color:var(--ink-2)}
.nx{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-top:8px;margin-left:calc(var(--yw) + 48px);padding:clamp(24px,3vw,40px);border-radius:26px;border:1.5px dashed color-mix(in srgb,var(--fg) 28%,transparent)}
.nx h3{font-size:clamp(26px,3.2vw,44px);font-weight:700;letter-spacing:-.045em;line-height:1}
.nx h3 em{color:var(--accent);font-weight:400}
@media (max-width:760px){
  .tline{--yw:0px}
  .stop{grid-template-columns:24px minmax(0,1fr);column-gap:16px}
  .stop .yr{display:none}
  .tl__spine{left:11px}
  .nx{margin-left:40px}
  .stop .kind::after{content:attr(data-yr);margin-left:10px;color:var(--faint)}
}
`;

export default function Experience() {
  const ol = useRef<HTMLOListElement>(null);
  const spine = useRef<HTMLElement>(null);
  const stops = [...EDUCATION, ...EXPERIENCE];

  useScrollProgress(
    ol,
    (p, el) => {
      if (spine.current) spine.current.style.transform = `scaleY(${p})`;
      const line = window.innerHeight * 0.6;
      el.querySelectorAll<HTMLElement>(".stop").forEach((s) => {
        const d = s.querySelector(".dot")!.getBoundingClientRect();
        s.classList.toggle("lit", d.top + d.height / 2 <= line);
      });
    },
    "through",
    0.6,
  );

  return (
    <section id="experience" className="sec" aria-labelledby="exp-h">
      <style>{css}</style>
      <div className="wrap">
        <SectionHead index="05" label="Education & experience" id="exp-h" lines={["One continuous"]} accent="path." />
        <ol className="tline" ref={ol}>
          <span className="tl__spine" aria-hidden><i ref={spine} /></span>
          {stops.map((s) => (
            <li key={s.year + s.title} className="stop">
              <span className="yr">{s.year}</span>
              <span className="dot" aria-hidden />
              <div className="bd">
                <p className="kind" data-yr={s.year}>{s.kind === "education" ? "Education" : "Experience"}</p>
                <h3>{s.title}</h3>
                <p className="pl">{s.place}</p>
                <p className="dt">{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="nx rv">
          <h3>Next — <em className="serif">Your team?</em></h3>
          <a className="btn btn-primary" href="#contact" onClick={(e) => { e.preventDefault(); scrollToTarget("contact"); }}>Let&rsquo;s talk →</a>
        </div>
      </div>
    </section>
  );
}
