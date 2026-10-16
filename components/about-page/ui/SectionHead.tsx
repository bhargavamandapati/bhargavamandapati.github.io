import type { CSSProperties } from "react";

type Vars = CSSProperties & { "--i"?: number };

export function SectionTag({ index, label }: { index: string; label: string }) {
  return (
    <p className="tag rv">
      <b>{index}</b>
      <span aria-hidden>—</span>
      <span>{label}</span>
    </p>
  );
}

/** Heading in masked lines; the last word is the one Instrument Serif italic accent. */
export function Heading({ id, lines, accent }: { id: string; lines: string[]; accent: string }) {
  return (
    <h2 id={id} className="h2">
      {lines.map((l, i) => (
        <span className="rv-mask" key={l}>
          <span style={{ "--i": i } as Vars}>{l}</span>
        </span>
      ))}
      <span className="rv-mask">
        <span style={{ "--i": lines.length } as Vars}>
          <em className="serif accent">{accent}</em>
        </span>
      </span>
    </h2>
  );
}

export function SectionHead({ index, label, id, lines, accent }: { index: string; label: string; id: string; lines: string[]; accent: string }) {
  return (
    <header>
      <SectionTag index={index} label={label} />
      <Heading id={id} lines={lines} accent={accent} />
    </header>
  );
}
