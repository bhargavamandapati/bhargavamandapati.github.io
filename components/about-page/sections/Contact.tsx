"use client";
import { useState, type AnimationEvent, type PointerEvent } from "react";
import { PROFILE } from "@/lib/about-page/data";
import { scrollToTarget } from "@/lib/about-page/scroll";
import { SectionTag } from "../ui/SectionHead";

const css = `
.ct{padding-bottom:clamp(48px,8vh,96px)}
.ct__h{font-size:clamp(46px,9.6vw,160px);font-weight:700;letter-spacing:-.045em;line-height:.96}
.ct__h .w{display:inline-block;white-space:nowrap;margin-right:.2em}
.ct__h .l{display:inline-block;will-change:transform}
.ct__h .l.hop{animation:hop .7s var(--ease)}
@keyframes hop{0%{transform:translateY(0)}35%{transform:translateY(-.16em)}100%{transform:translateY(0)}}
.ct__h .acc{color:var(--accent);font-family:var(--font-serif);font-style:italic;font-weight:400;letter-spacing:-.02em}
.ct__row{display:flex;align-items:flex-end;justify-content:space-between;gap:32px;margin-top:clamp(40px,7vh,80px);flex-wrap:wrap}
.ct__mailrow{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.ct__mail{font-size:clamp(22px,3.6vw,52px);font-weight:600;letter-spacing:-.045em;line-height:1.1;text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:.16em;overflow-wrap:anywhere;
  transition:color .3s var(--ease)}
.ct__mail:hover{color:var(--mute)}
.copy{height:34px;padding:0 14px;border-radius:999px;font-family:var(--font-mono);font-size:12px;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--fg) 25%,transparent);transition:background .3s var(--ease),color .3s var(--ease)}
.copy:hover,.copy.ok{background:var(--accent);color:var(--accent-fg)}
.ct__links{display:flex;gap:10px;flex-wrap:wrap;margin-top:28px}
.ct__badge{position:relative;width:132px;height:132px;flex:none}
.ct__badge svg{width:100%;height:100%;animation:spin 18s linear infinite}
.ct__badge span{position:absolute;inset:0;display:grid;place-items:center;font-family:var(--font-serif);font-style:italic;font-size:22px}
@keyframes spin{to{transform:rotate(360deg)}}
.ft{margin-top:clamp(64px,12vh,140px);padding-top:22px;border-top:1px solid var(--line);display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-size:13px;color:var(--mute)}
.ft a{color:var(--ink);box-shadow:inset 0 -1px 0 var(--ink)}
.ft{margin-top:clamp(64px,12vh,140px);padding-top:22px;border-top:1px solid var(--line);display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-size:13px;color:var(--mute)}
.ft a{color:var(--fg);box-shadow:inset 0 -1px 0 var(--fg)}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
`;

function Letters({ text, accent }: { text: string; accent?: boolean }) {
  const onEnter = (e: PointerEvent<HTMLSpanElement>) => e.currentTarget.classList.add("hop");
  const onEnd = (e: AnimationEvent<HTMLSpanElement>) => e.currentTarget.classList.remove("hop");
  return (
    <>
      {text.split(" ").map((w, wi) => (
        <span className={`w${accent ? " acc" : ""}`} key={w + wi} aria-hidden>
          {[...w].map((c, i) => (
            <span className="l" key={i} onPointerEnter={onEnter} onAnimationEnd={onEnd}>{c}</span>
          ))}
        </span>
      ))}
    </>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = PROFILE.email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section id="contact" className="sec ct" aria-labelledby="contact-h">
      <style>{css}</style>
      <div className="wrap">
        <SectionTag index="07" label="Contact" />
        <h2 id="contact-h" className="ct__h" aria-label="Let’s build something together.">
          <Letters text="Let’s build" /><br />
          <Letters text="something" /><Letters text="together." accent />
        </h2>
        <div className="ct__row">
          <div>
            <div className="ct__mailrow">
              <a className="ct__mail" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
              <button className={`copy${copied ? " ok" : ""}`} onClick={copy} aria-label="Copy email address">{copied ? "Copied ✓" : "Copy"}</button>
              <span className="sr" aria-live="polite">{copied ? "Email address copied" : ""}</span>
            </div>
            <div className="ct__links">
              <a className="btn btn-ghost" href={PROFILE.phoneHref}>{PROFILE.phone}</a>
              {PROFILE.github && <a className="btn btn-ghost" href={PROFILE.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}
              <a className="btn btn-ghost" href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            </div>
          </div>
          <div className="ct__badge" aria-hidden>
            <svg viewBox="0 0 132 132">
              <defs><path id="circ" d="M66,66 m-48,0 a48,48 0 1,1 96,0 a48,48 0 1,1 -96,0" /></defs>
              <text fontFamily="var(--font-mono)" fontSize="10.5" fill="currentColor">
                <textPath href="#circ" textLength="298" lengthAdjust="spacing">SAY HELLO • SAY HELLO • SAY HELLO • </textPath>
              </text>
            </svg>
            <span>hi</span>
          </div>
        </div>
        <footer className="ft">
          <span>© <span suppressHydrationWarning>{new Date().getFullYear()}</span> {PROFILE.name}</span>
          <a href="#hero" onClick={(e) => { e.preventDefault(); scrollToTarget("top"); }}>Back to top ↑</a>
          <span>Built with Next.js</span>
        </footer>
      </div>
    </section>
  );
}
