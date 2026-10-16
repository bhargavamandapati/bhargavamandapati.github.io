"use client";
import { useMemo, useState, type CSSProperties } from "react";
import { PROJECTS, SKILL_GROUPS } from "@/lib/about-page/data";
import { useInView } from "@/lib/about-page/hooks";
import { SectionHead } from "../ui/SectionHead";
import TechLogo, { BRAND, isBrand } from "../ui/TechLogo";

const css = `
.sk__wrap{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:clamp(20px,3vw,48px);margin-top:clamp(40px,6vh,72px);align-items:start}
.sk__chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}
.chip{height:36px;padding:0 16px;border-radius:999px;font-size:13px;font-weight:500;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--fg) 18%,transparent);transition:background .3s var(--ease),color .3s var(--ease),transform .4s var(--ease)}
.chip:hover{transform:translateY(-1px);box-shadow:inset 0 0 0 1px var(--ink)}
.chip[aria-pressed="true"]{background:var(--accent);color:var(--accent-fg);box-shadow:none}
.sk__grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:8px}
.pt{--d:var(--d8);position:relative;aspect-ratio:1/1.1;border-radius:14px;background:var(--card);box-shadow:var(--hair);padding:9px 9px 8px;display:flex;flex-direction:column;text-align:left;min-width:0;
  transition:transform .5s var(--ease),background .3s var(--ease),color .3s var(--ease),box-shadow .3s var(--ease),opacity .4s var(--ease)}
.pt i{font-family:var(--font-mono);font-style:normal;font-size:9px;color:var(--faint);line-height:1}
.pt b{margin-top:auto;font-size:clamp(20px,2.2vw,28px);font-weight:700;letter-spacing:-.045em;line-height:1}
.pt span{margin-top:4px;font-size:10.5px;line-height:1.15;font-weight:500;letter-spacing:-.01em;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.pt em{font-style:normal;font-family:var(--font-mono);font-size:8px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pt:hover,.pt.is-sel{transform:translateY(-3px);box-shadow:var(--hair),0 16px 30px -18px color-mix(in srgb,var(--fg) 40%,transparent)}
.pt.is-sel{background:var(--accent);color:var(--accent-fg)}
.pt.is-sel i,.pt.is-sel em{color:color-mix(in srgb,var(--accent-fg) 65%,transparent)}
.pt.is-dim{opacity:.16}
.sk__grid:not(.is-in) .pt{opacity:0}
.sk__grid.is-in .pt{animation:ptIn .9s var(--ease) calc(var(--d) * 40ms) backwards}
@keyframes ptIn{from{opacity:0;transform:translateY(18px) scale(.94)}}
.insp{position:sticky;top:96px;border-radius:28px;padding:22px;display:flex;flex-direction:column;align-items:center;text-align:center;min-height:380px}
.insp__logo{position:relative;width:150px;height:150px;display:flex;align-items:center;justify-content:center;margin-top:8px;flex:none}
.insp__logo>*:not(.glow){position:relative;z-index:1;animation:pop .7s var(--ease)}
.glow{position:absolute;inset:14px;border-radius:50%;opacity:.16;filter:blur(26px)}
@keyframes pop{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.08);opacity:1}100%{transform:scale(1)}}
.insp h3{font-size:26px;font-weight:700;letter-spacing:-.045em;line-height:1.1;margin-top:12px}
.insp__meta{font-family:var(--font-mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute);margin-top:6px}
.insp__used{width:100%;margin-top:18px;padding-top:16px;border-top:1px solid var(--line);text-align:left;font-size:14px}
.insp__used small{display:block;font-family:var(--font-mono);font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute);margin-bottom:8px}
.insp__used li{padding:3px 0;color:var(--ink-2)}
.insp .cl{color:var(--ink)}
@media (max-width:1000px){.sk__wrap{grid-template-columns:minmax(0,1fr)}.insp{position:relative;top:0;min-height:0}}
@media (max-width:700px){.sk__grid{grid-template-columns:repeat(4,minmax(0,1fr))}.pt{--d:var(--d4)}.pt b{font-size:22px}}
`;

export default function Skills() {
  const flat = useMemo(() => {
    let n = 0;
    return SKILL_GROUPS.flatMap((g) => g.skills.map((s) => ({ ...s, family: g.family, n: ++n })));
  }, []);
  const [filter, setFilter] = useState("All");
  const [sel, setSel] = useState(0);
  const [gridRef, inView] = useInView<HTMLDivElement>({ threshold: 0.08 });
  const cur = flat[sel];
  const used = PROJECTS.filter((p) => p.tech.includes(cur.name));

  return (
    <section id="skills" className="sec" aria-labelledby="skills-h">
      <style>{css}</style>
      <div className="wrap">
        <SectionHead index="02" label="Skills" id="skills-h" lines={["The periodic table", "of my"]} accent="stack." />
        <div className="sk__wrap">
          <div>
            <div className="sk__chips rv" role="group" aria-label="Filter skills by family">
              {["All", ...SKILL_GROUPS.map((g) => g.family)].map((f) => (
                <button key={f} className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
                  {f}
                </button>
              ))}
            </div>
            <div ref={gridRef} className={`sk__grid${inView ? " is-in" : ""}`}>
              {flat.map((s, i) => {
                const row = Math.floor(i / 8), col = i % 8;
                const row4 = Math.floor(i / 4), col4 = i % 4;
                return (
                  <button
                    key={s.name}
                    className={`pt${sel === i ? " is-sel" : ""}${filter !== "All" && filter !== s.family ? " is-dim" : ""}`}
                    style={{ "--d8": row + col, "--d4": row4 + col4 } as CSSProperties}
                    onMouseEnter={() => setSel(i)}
                    onFocus={() => setSel(i)}
                    onClick={() => setSel(i)}
                    aria-label={`${s.name}, ${s.family}, element ${s.n}`}
                    aria-pressed={sel === i}
                  >
                    <i aria-hidden>{String(s.n).padStart(2, "0")}</i>
                    <b aria-hidden>{s.sym}</b>
                    <span aria-hidden>{s.name}</span>
                    <em aria-hidden>{s.family}</em>
                  </button>
                );
              })}
            </div>
          </div>
          <aside className="insp card rv" aria-live="polite" aria-label="Skill details">
            <div className="insp__logo" key={cur.name}>
              {isBrand(cur.icon) && <span className="glow" style={{ background: BRAND[cur.icon].tint }} aria-hidden />}
              <TechLogo icon={cur.icon} size={isBrand(cur.icon) ? 110 : 96} label={`${cur.name} logo`} glow />
            </div>
            <h3>{cur.name}</h3>
            <p className="insp__meta">{cur.family} · No. {String(cur.n).padStart(2, "0")}</p>
            <div className="insp__used">
              <small>{used.length ? "Used in" : "From"}</small>
              <ul>
                {used.length ? used.map((p) => <li key={p.id} className="cl">{p.title}</li>) : <li>Core competencies &amp; technical skills</li>}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
