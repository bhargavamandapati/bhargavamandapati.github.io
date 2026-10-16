"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { PROFILE } from "@/lib/about-page/data";
import { prefersReducedMotion } from "@/lib/about-page/hooks";
import { SectionTag, Heading } from "../ui/SectionHead";

const css = `
.about{padding-block:0 var(--pad-y);overflow-x:clip}
.about__grid{display:grid;grid-template-columns:minmax(0,1fr) 320px minmax(0,1fr);gap:clamp(24px,4vw,64px);align-items:stretch}
.about__l,.about__r{padding-top:var(--pad-y);display:flex;flex-direction:column}
.about__l p{color:var(--ink-2)}
.about__l p+p{margin-top:16px}
.about__sum{margin-top:28px}
.about__btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:32px}
.about__facts{border-top:1px solid var(--line)}
.about__facts div{display:grid;grid-template-columns:96px 1fr;gap:12px;padding:14px 0;border-bottom:1px solid var(--line);font-size:15px}
.about__facts dt{font-family:var(--font-mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute);padding-top:3px}
.about__facts dd{margin:0;overflow-wrap:anywhere}
.about__facts a{box-shadow:inset 0 -1px 0 var(--ink)}
.about__q{margin-top:auto;padding-top:36px}
.about__q blockquote{font-family:var(--font-serif);font-style:italic;font-size:clamp(26px,2.4vw,34px);line-height:1.12;letter-spacing:-.01em}
.about__q small{display:block;margin-top:14px;font-family:var(--font-mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}

/* lanyard */
.lan{position:relative;min-height:620px}
.pend{position:absolute;top:0;left:50%;width:300px;margin-left:-150px;transform-origin:150px 0;will-change:transform;display:flex;flex-direction:column;align-items:center}
.cord{width:2px;height:clamp(70px,11vh,110px);background:var(--fg)}
.strap{position:relative;width:30px;height:56px;background:var(--fg);overflow:hidden;border-radius:2px 2px 4px 4px;color:var(--bg)}
.strap span{position:absolute;left:50%;top:0;writing-mode:vertical-rl;font-family:var(--font-mono);font-size:8px;letter-spacing:.14em;text-transform:uppercase;white-space:nowrap;margin-left:-5px;animation:strapY 9s linear infinite}
@keyframes strapY{from{transform:translateY(0)}to{transform:translateY(-50%)}}
.clip{width:20px;height:26px;border-radius:5px 5px 8px 8px;background:linear-gradient(90deg,#c9c7c2,#f4f3f0 45%,#8e8c87);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--fg) 35%,transparent);position:relative}
.clip::after{content:"";position:absolute;left:50%;bottom:5px;width:8px;height:8px;margin-left:-4px;border-radius:50%;background:var(--paper);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--fg) 45%,transparent)}
.id{width:300px;height:404px;perspective:1400px;margin-top:-6px;cursor:pointer;border-radius:22px;outline-offset:6px}
.id__in{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform .9s var(--ease)}
.id.is-flip .id__in{transform:rotateY(180deg)}
.face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:22px;background:var(--surface);overflow:hidden;
  box-shadow:var(--hair),0 40px 60px -28px color-mix(in srgb,var(--fg) 35%,transparent);display:flex;flex-direction:column}
.face--back{transform:rotateY(180deg)}
.band{height:36px;background:var(--fg);color:var(--bg);display:flex;align-items:center;justify-content:center;gap:10px;font-family:var(--font-mono);font-size:10.5px;letter-spacing:.2em;flex:none;position:relative}
.band::before{content:"";width:34px;height:6px;border-radius:3px;background:var(--bg);position:absolute;top:-3px;left:50%;margin-left:-17px}
.id__body{flex:1;display:flex;flex-direction:column;align-items:center;padding:20px 22px 14px;min-height:0}
.ring{padding:3px;border-radius:20px;background:linear-gradient(145deg,#e4e2dd,#8f8d88);box-shadow:0 0 0 8px color-mix(in srgb,var(--fg) 04%,transparent),0 20px 36px -18px color-mix(in srgb,var(--fg) 50%,transparent);flex:none}
.ring__in{width:128px;height:156px;border-radius:17px;overflow:hidden;background:var(--soft);position:relative}
.ring__in img{width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.05);transition:transform 1.2s var(--ease)}
.id__hit{position:absolute;inset:0;z-index:5;border-radius:22px;outline-offset:6px;cursor:pointer}
.id:hover .ring__in img,.id:focus-within .ring__in img{transform:scale(1.07)}
.id__name{margin-top:16px;font-size:21px;font-weight:700;letter-spacing:-.045em;line-height:1.1;text-align:center}
.id__role{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.04em;color:var(--mute);margin-top:4px;text-align:center}
.id__rows{width:100%;margin-top:12px;font-size:11.5px}
.id__rows div{display:flex;justify-content:space-between;gap:10px;padding:4px 0;border-top:1px solid var(--line)}
.id__rows dt{font-family:var(--font-mono);font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);padding-top:1px}
.id__rows dd{margin:0;font-weight:500;text-align:right}
.id__foot{width:100%;margin-top:auto;display:flex;align-items:flex-end;justify-content:space-between;gap:12px;padding-top:8px}
.holo{width:34px;height:34px;border-radius:50%;flex:none;background:conic-gradient(from 20deg,#f2f2f2,#9c9a96,#fafafa,#6d6b67,#e6e4df,#a8a6a1,#f2f2f2);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--fg) 25%,transparent);animation:holo 6s linear infinite}
@keyframes holo{to{transform:rotate(360deg)}}
.back{padding:20px 22px 18px;display:flex;flex-direction:column;flex:1}
.back h3{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);font-weight:400}
.back ul{margin-top:12px;display:flex;flex-direction:column;gap:7px;font-size:12px;line-height:1.3}
.back li{display:flex;gap:10px}
.back li::before{content:"";flex:none;width:5px;height:5px;border-radius:50%;background:var(--accent);margin-top:.5em}
.sig{margin-top:auto;padding-top:10px;font-family:var(--font-serif);font-style:italic;font-size:27px;line-height:1;border-bottom:1px solid var(--ink);padding-bottom:6px}
.back small{display:block;margin-top:10px;font-family:var(--font-mono);font-size:9.5px;letter-spacing:.04em;color:var(--mute);line-height:1.5;overflow-wrap:anywhere}
@media (max-width:1060px){
  .about__grid{grid-template-columns:minmax(0,1fr)}
  .about__l{order:1;padding-top:var(--pad-y)}
  .lan{order:2;min-height:640px}
  .about__r{order:3;padding-top:24px}
  .about__q{margin-top:0}
}
`;

const BARS = (() => {
  const s = "BHARGAVA-MANDAPATI-2016";
  let x = 0;
  const out: { x: number; w: number }[] = [];
  for (let i = 0; i < 38; i++) {
    const w = 1 + (s.charCodeAt(i % s.length) % 3);
    out.push({ x, w });
    x += w + 1.5 + (i % 3 === 0 ? 1 : 0);
  }
  return { bars: out, width: x };
})();

function Barcode() {
  return (
    <svg style={{ color: "var(--fg)" }} width="132" height="30" viewBox={`0 0 ${BARS.width} 30`} preserveAspectRatio="none" role="img" aria-label="Decorative barcode">
      {BARS.bars.map((b) => (
        <rect key={b.x} x={b.x} y="0" width={b.w} height="30" fill="currentColor" />
      ))}
    </svg>
  );
}

export default function About() {
  const root = useRef<HTMLElement>(null);
  const pend = useRef<HTMLDivElement>(null);
  const [flip, setFlip] = useState(false);
  const ptype = useRef("mouse");
  const kick = useRef<(v: number) => void>(() => {});

  // damped pendulum: pointer velocity -> angular velocity, spring + damping, idle sway
  useEffect(() => {
    const el = root.current;
    const p = pend.current;
    if (!el || !p || prefersReducedMotion()) return;
    let th = 0, om = 0, px: number | null = null, raf = 0, visible = false, last = performance.now();
    kick.current = (v) => { om += v; };
    const K = 38, C = 2.6;
    const frame = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const sway = 1.6 * Math.sin(now / 1100);
      const acc = -K * (th - sway) - C * om;
      om += acc * dt;
      om = Math.max(-220, Math.min(220, om));
      th += om * dt;
      th = Math.max(-26, Math.min(26, th));
      p.style.transform = `rotate(${th.toFixed(3)}deg)`;
      raf = visible ? requestAnimationFrame(frame) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (px !== null) om += (e.clientX - px) * 0.55;
      px = e.clientX;
    };
    const onLeave = () => { px = null; };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
    });
    io.observe(el);
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      io.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  const toggle = () => { setFlip((f) => !f); kick.current(60); };

  return (
    <section id="about" ref={root} className="sec about" aria-labelledby="about-h">
      <style>{css}</style>
      <div className="wrap">
        <div className="about__grid">
          <div className="about__l">
            <SectionTag index="01" label="About" />
            <Heading id="about-h" lines={["Hi, I’m"]} accent={`${PROFILE.first}.`} />
            <div className="about__sum rv" style={{ "--i": 1 } as CSSProperties}>
              <p>{PROFILE.resumeSummary}</p>
              <p>{PROFILE.extraLine}</p>
            </div>
            <div className="about__btns rv" style={{ "--i": 2 } as CSSProperties}>
              <a className="btn btn-primary" href={PROFILE.resume} download>Résumé ↓</a>
              {PROFILE.github && <a className="btn btn-ghost" href={PROFILE.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}
              <a className="btn btn-ghost" href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            </div>
          </div>

          <div className="lan">
            <div className="pend" ref={pend}>
              <div className="cord" aria-hidden />
              <div className="strap" aria-hidden>
                <span>{`${PROFILE.name} · ${PROFILE.role} · ${PROFILE.name} · ${PROFILE.role} · `.toUpperCase()}</span>
              </div>
              <div className="clip" aria-hidden />
              <div
                className={`id${flip ? " is-flip" : ""}`}
                role="group"
                aria-label={`Developer ID card for ${PROFILE.name}`}
                onPointerEnter={(e) => { ptype.current = e.pointerType; if (e.pointerType === "mouse") setFlip(true); }}
                onPointerLeave={(e) => { if (e.pointerType === "mouse") setFlip(false); }}
                onPointerDown={(e) => { ptype.current = e.pointerType; }}
                onClick={(e) => { if (e.detail === 0 || ptype.current !== "mouse") toggle(); }}
              >
                <button type="button" className="id__hit" aria-pressed={flip} aria-label="Flip the ID card" />
                <div className="id__in">
                  <div className="face">
                    <div className="band">DEVELOPER ID</div>
                    <div className="id__body">
                      <div className="ring">
                        <div className="ring__in">
                          <Image src={PROFILE.photo} alt={`Portrait of ${PROFILE.name}`} width={256} height={312} sizes="128px" />
                        </div>
                      </div>
                      <p className="id__name">{PROFILE.name}</p>
                      <p className="id__role">{PROFILE.role}</p>
                      <dl className="id__rows">
                        <div><dt>Based</dt><dd>{PROFILE.location}</dd></div>
                        <div><dt>Since</dt><dd>{PROFILE.careerStart}</dd></div>
                        <div><dt>Now</dt><dd>{PROFILE.current.org}</dd></div>
                      </dl>
                      <div className="id__foot">
                        <Barcode />
                        <span className="holo" aria-hidden />
                      </div>
                    </div>
                  </div>
                  <div className="face face--back">
                    <div className="band">WHAT I AM</div>
                    <div className="back">
                      <h3>Verified by résumé</h3>
                      <ul>
                        <li>Senior Software Engineer &amp; Technical Lead</li>
                        <li>B.Tech, Electronics &amp; Communications Engineering, JNTU Kakinada</li>
                        <li>10+ years across the Android application stack and AOSP</li>
                        <li>SDV Android · ClusterService RHMI · Project Guava</li>
                        <li>Service Anniversary · Unmatched Dedication · Outside the Box Thinker</li>
                      </ul>
                      <p className="sig">{PROFILE.name}</p>
                      <small>If found, say hello · {PROFILE.email}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="about__r">
            <p className="tag rv" style={{ marginBottom: 12 }}><span>Quick facts</span></p>
            <dl className="about__facts rv" style={{ "--i": 1 } as CSSProperties}>
              <div><dt>Location</dt><dd>{PROFILE.location}</dd></div>
              <div><dt>Education</dt><dd>B.Tech., Electronics &amp; Communications Engineering · JNTU Kakinada</dd></div>
              <div><dt>Now</dt><dd>{PROFILE.current.title}, {PROFILE.current.org}</dd></div>
              <div><dt>Email</dt><dd><a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a></dd></div>
            </dl>
            <figure className="about__q rv" style={{ "--i": 2 } as CSSProperties}>
              <blockquote>&ldquo;{PROFILE.quote}&rdquo;</blockquote>
              <small>Paraphrased from the résumé</small>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
