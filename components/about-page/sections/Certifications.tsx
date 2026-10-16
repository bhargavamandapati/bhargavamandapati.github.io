import type { CSSProperties } from "react";
import { CERTIFICATIONS } from "@/lib/about-page/data";
import { SectionHead } from "../ui/SectionHead";

const css = `
.cert{background:var(--card);border-block:1px solid var(--line)}
.cert__grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(24px,5vw,80px);align-items:start}
.cert__l{position:sticky;top:120px}
.cert__count{margin-top:28px;font-family:var(--font-mono);font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}
.cert__list{border-top:1px solid var(--line)}
.crow{position:relative;display:grid;grid-template-columns:48px minmax(0,1fr) auto;gap:18px;align-items:center;padding:clamp(22px,3vw,34px) clamp(14px,2vw,24px);border-bottom:1px solid var(--line);overflow:hidden;isolation:isolate;
  transition:color .5s var(--ease)}
.crow::before{content:"";position:absolute;inset:0;background:var(--accent);transform:scaleX(0);transform-origin:0 50%;transition:transform .8s var(--ease);z-index:-1}
.crow:hover,.crow:focus-visible{color:var(--accent-fg)}
.crow:hover::before,.crow:focus-visible::before{transform:scaleX(1)}
.crow .i{font-family:var(--font-mono);font-size:12px;color:var(--mute);transition:color .5s var(--ease)}
.crow h3{font-size:clamp(20px,2.3vw,32px);font-weight:600;letter-spacing:-.045em;line-height:1.1}
.crow p{margin-top:6px;font-size:14px;color:var(--mute);transition:color .5s var(--ease)}
.crow:hover .i,.crow:hover p,.crow:focus-visible .i,.crow:focus-visible p{color:color-mix(in srgb,var(--accent-fg) 70%,transparent)}
.crow .ar{font-size:24px;opacity:0;transform:translate(-14px,6px);transition:opacity .5s var(--ease),transform .7s var(--ease)}
.crow:hover .ar,.crow:focus-visible .ar{opacity:1;transform:none}
@media (max-width:900px){.cert__grid{grid-template-columns:minmax(0,1fr)}.cert__l{position:static}.crow{grid-template-columns:36px minmax(0,1fr) auto}}
`;

export default function Certifications() {
  return (
    <section id="certifications" className="sec cert" aria-labelledby="cert-h">
      <style>{css}</style>
      <div className="wrap cert__grid">
        <div className="cert__l">
          <SectionHead index="04" label="Certifications" id="cert-h" lines={["Always"]} accent="learning." />
          <p className="cert__count rv" style={{ "--i": 2 } as CSSProperties}>{String(CERTIFICATIONS.length).padStart(2, "0")} certifications</p>
        </div>
        <ol className="cert__list">
          {CERTIFICATIONS.map((c, i) => (
            <li key={c.title} className="crow rv" tabIndex={0} style={{ "--i": i } as CSSProperties}>
              <span className="i">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{c.title}</h3>
                <p>{c.issuer}</p>
              </div>
              <span className="ar" aria-hidden>↗</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
