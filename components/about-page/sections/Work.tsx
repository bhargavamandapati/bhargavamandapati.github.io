"use client";
import { useState, type CSSProperties } from "react";
import { PROJECTS, skillByName, type Project } from "@/lib/about-page/data";
import { SectionHead } from "../ui/SectionHead";
import TechLogo from "../ui/TechLogo";

const css = `
.wk__row{display:flex;gap:12px;height:min(78svh,600px);margin-top:clamp(40px,6vh,72px)}
.pn{--ow:calc((min(1320px,100vw - 2 * var(--gutter)) - 24px) * .8);position:relative;flex:1 1 0;min-width:0;overflow:hidden;border-radius:28px;background:var(--card);box-shadow:var(--hair);
  transition:flex-grow .9s var(--ease),box-shadow .6s var(--ease)}
.pn.is-open{flex-grow:8;box-shadow:var(--hair),var(--lift)}
.pn__spine{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:26px 0;width:100%;
  transition:opacity .4s var(--ease);z-index:2}
.pn.is-open .pn__spine{opacity:0;pointer-events:none}
.pn__spine .n{font-family:var(--font-mono);font-size:12px;color:var(--mute)}
.pn__spine .vt{writing-mode:vertical-rl;transform:rotate(180deg);font-size:clamp(20px,2vw,28px);font-weight:700;letter-spacing:-.045em;white-space:nowrap}
.pn__spine .plus{width:36px;height:36px;border-radius:50%;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--fg) 20%,transparent);display:grid;place-items:center;font-size:20px;line-height:1;transition:transform .6s var(--ease),background .3s,color .3s}
.pn__spine:hover .plus,.pn__spine:focus-visible .plus{transform:rotate(90deg);background:var(--accent);color:var(--accent-fg)}
.pn__open{position:absolute;left:0;top:0;bottom:0;width:var(--ow);padding:clamp(22px,2.4vw,36px);display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:clamp(18px,2vw,32px);
  opacity:0;transition:opacity .5s var(--ease)}
.pn.is-open .pn__open{opacity:1;transition:opacity .7s var(--ease) .25s}
.pn__l{display:flex;flex-direction:column;min-width:0;min-height:0}
.pn__k{font-family:var(--font-mono);font-size:11.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute);display:flex;gap:10px;flex-wrap:wrap}
.pn__k b{color:var(--ink);font-weight:500}
.pn__t{font-size:clamp(30px,3.6vw,54px);font-weight:700;letter-spacing:-.045em;line-height:1;margin-top:14px}
.pn__d{margin-top:14px;font-size:15px;line-height:1.5;color:var(--ink-2)}
.pn__f{margin-top:16px;display:grid;grid-template-columns:1fr 1fr;gap:6px 18px;font-size:13px;line-height:1.35}
.pn__f li{display:flex;gap:8px}
.pn__f li::before{content:"";flex:none;width:4px;height:4px;border-radius:50%;background:var(--accent);margin-top:.55em}
.pn__chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:auto;padding-top:16px}
.tchip{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 11px 0 8px;border-radius:999px;font-size:12px;font-weight:500;box-shadow:inset 0 0 0 1px var(--line);background:var(--paper)}
.tchip svg{color:var(--ink-2)}
.pn__r{position:relative;min-width:0;display:flex;flex-direction:column;justify-content:center}
.pui{position:relative;border-radius:20px;background:var(--paper);box-shadow:var(--hair);padding:16px;overflow:hidden;clip-path:inset(0 100% 0 0);transition:clip-path 1.1s var(--ease) .2s;aspect-ratio:1/1.05;max-height:100%}
.pn.is-open .pui{clip-path:inset(0 0 0 0)}
.pui__lbl{margin-top:10px;font-family:var(--font-mono);font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--faint);text-align:center}
.pui .dots{display:flex;gap:5px;margin-bottom:12px}.pui .dots i{width:7px;height:7px;border-radius:50%;background:var(--soft)}
.pui .cap{font-family:var(--font-mono);font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}
/* signals */
.sg{display:flex;flex-direction:column;gap:10px;margin-top:12px}
.sg li{background:var(--surface);border-radius:12px;box-shadow:var(--hair);padding:9px 12px;font-size:12px;font-weight:500}
.sg li div{height:5px;border-radius:3px;background:var(--soft);margin-top:7px;overflow:hidden}
.sg li div::after{content:"";display:block;height:100%;width:var(--w);background:var(--accent);border-radius:3px;animation:sgw 4.6s var(--ease) infinite alternate;animation-delay:calc(var(--k)*-1.1s)}
@keyframes sgw{0%{transform:scaleX(.2)}100%{transform:scaleX(1)}}
.sg li div::after{transform-origin:0 50%}
/* cluster */
.cl2{display:flex;flex-direction:column;gap:14px;height:100%}
.scr{background:var(--surface);border-radius:14px;box-shadow:var(--hair);padding:10px}
.scr--s{width:72%;align-self:flex-end}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:8px}
.cards span{display:block;border-radius:8px;background:var(--paper);padding:14px 6px 6px;font-size:10px;font-weight:500;text-align:center;box-shadow:var(--hair)}
.link{position:relative;height:46px;margin:2px 0}
.link::before{content:"";position:absolute;left:50%;top:0;bottom:0;border-left:1.5px dashed color-mix(in srgb,var(--fg) 30%,transparent)}
.link i{position:absolute;left:50%;margin-left:-4px;width:8px;height:8px;border-radius:50%;background:var(--accent);animation:pk 2.2s linear infinite;animation-delay:calc(var(--k)*-.73s)}
@keyframes pk{from{top:-4px;opacity:0}15%{opacity:1}85%{opacity:1}to{top:42px;opacity:0}}
.link b{position:absolute;left:calc(50% + 14px);top:50%;transform:translateY(-50%);font-family:var(--font-mono);font-size:9.5px;font-weight:400;color:var(--mute);letter-spacing:.04em}
/* boot */
.bt{display:flex;flex-direction:column-reverse;gap:8px;margin-top:12px}
.bt li{border-radius:12px;padding:13px 14px;font-size:12.5px;font-weight:500;background:var(--surface);box-shadow:var(--hair);animation:lit 6s var(--ease) infinite;animation-delay:calc(var(--k)*.6s);display:flex;justify-content:space-between}
.bt li small{font-family:var(--font-mono);font-size:10px;color:var(--faint);transition:color .3s}
@keyframes lit{0%,8%{background:var(--surface);color:var(--ink)}18%,70%{background:var(--accent);color:var(--accent-fg)}90%,100%{background:var(--surface);color:var(--ink)}}
@media (max-width:900px){
  .wk__row{flex-direction:column;height:auto}
  .pn{flex:none;max-height:76px;transition:max-height .9s var(--ease),box-shadow .6s var(--ease)}
  .pn.is-open{max-height:1200px}
  .pn__spine{flex-direction:row;height:76px;bottom:auto;padding:0 22px;gap:14px;justify-content:flex-start}
  .pn__spine .vt{writing-mode:horizontal-tb;transform:none;flex:1;text-align:left;font-size:22px}
  .pn.is-open .pn__spine{opacity:1;pointer-events:auto}
  .pn__open{position:relative;width:auto;margin-top:76px;grid-template-columns:minmax(0,1fr);padding-top:6px}
  .pn__t{display:none}
  .pui{aspect-ratio:auto;min-height:280px}
}
@media (max-width:520px){.pn__f{grid-template-columns:1fr}}
@media (min-width:901px) and (max-width:1100px){.pn__open{grid-template-columns:minmax(0,1fr)}.pn__r{display:none}}
`;

function MiniUI({ kind }: { kind: Project["ui"] }) {
  if (kind === "signals")
    return (
      <>
        <div className="dots"><i /><i /><i /></div>
        <p className="cap">C++/Qt simulation tool</p>
        <ul className="sg">
          {["VSS", "SOME/IP", "Franca IDL", "Eclipse Kuksa Data Broker"].map((s, i) => (
            <li key={s} style={{ "--k": i, "--w": "100%" } as CSSProperties}>{s}<div /></li>
          ))}
        </ul>
      </>
    );
  if (kind === "cluster")
    return (
      <div className="cl2">
        <div className="scr">
          <p className="cap">Center Stack</p>
          <div className="cards"><span>Audio</span><span>Phone</span><span>Navigation</span></div>
        </div>
        <div className="link" aria-hidden>
          {[0, 1, 2].map((k) => <i key={k} style={{ "--k": k } as CSSProperties} />)}
          <b>Protobuf · TCP/IP</b>
        </div>
        <div className="scr scr--s">
          <p className="cap">Instrument Cluster</p>
          <div className="cards"><span>Audio</span><span>Phone</span><span>Navigation</span></div>
        </div>
      </div>
    );
  return (
    <>
      <div className="dots"><i /><i /><i /></div>
      <p className="cap">System bring-up</p>
      <ul className="bt">
        {[["Proprietary board", "01"], ["HAL", "02"], ["SEPolicy", "03"], ["Framework layers", "04"], ["Full platform", "05"]].map(([t, n], i) => (
          <li key={t} style={{ "--k": i } as CSSProperties}>{t}<small>{n}</small></li>
        ))}
      </ul>
    </>
  );
}

export default function Work() {
  const [active, setActive] = useState(0);
  return (
    <section id="work" className="sec" aria-labelledby="work-h">
      <style>{css}</style>
      <div className="wrap">
        <SectionHead index="03" label="Selected work" id="work-h" lines={["Things I’ve"]} accent="built." />
        <div className="wk__row rv">
          {PROJECTS.map((p, i) => {
            const open = active === i;
            return (
              <article key={p.id} className={`pn${open ? " is-open" : ""}`} onMouseEnter={() => setActive(i)} aria-label={p.title}>
                <button
                  className="pn__spine"
                  aria-expanded={open}
                  aria-controls={`pn-${p.id}`}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  tabIndex={open ? -1 : 0}
                >
                  <span className="n">{p.index}</span>
                  <span className="vt">{p.title}</span>
                  <span className="plus" aria-hidden>+</span>
                </button>
                <div className="pn__open" id={`pn-${p.id}`} inert={!open}>
                  <div className="pn__l">
                    <p className="pn__k"><b>{p.index}</b><span>{p.kicker}</span><span>{p.period}</span></p>
                    <h3 className="pn__t">{p.title}</h3>
                    <p className="pn__d">{p.description}</p>
                    <ul className="pn__f">{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
                    <ul className="pn__chips" aria-label="Technologies">
                      {p.tech.map((t) => (
                        <li key={t} className="tchip"><TechLogo icon={skillByName(t)?.icon} size={16} />{t}</li>
                      ))}
                    </ul>
                    {p.github && (
                      <a className="btn btn-primary" style={{ marginTop: 16, alignSelf: "flex-start" }} href={p.github} target="_blank" rel="noopener noreferrer">View on GitHub ↗</a>
                    )}
                  </div>
                  <div className="pn__r">
                    <div className="pui" role="img" aria-label={`Illustrative interface sketch for ${p.title}`}>
                      <MiniUI kind={p.ui} />
                    </div>
                    <p className="pui__lbl">Illustrative UI</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
