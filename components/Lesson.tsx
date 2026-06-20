"use client";

import type { Lesson, LessonBlock } from "@/lib/types";

const calloutStyles = {
  info: { border: "border-sky", label: "text-sky", icon: "ℹ️" },
  warn: { border: "border-ember", label: "text-ember", icon: "⚠️" },
  key: { border: "border-gold", label: "text-gold", icon: "🔑" },
} as const;

function Block({ block }: { block: LessonBlock }) {
  switch (block.kind) {
    case "p":
      return <p className="text-[1.05rem] text-parchment/90">{block.text}</p>;

    case "list":
      return (
        <ul className="space-y-2">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-2 text-parchment/90">
              <span className="mt-1 text-gold">▸</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );

    case "callout": {
      const s = calloutStyles[block.tone];
      return (
        <div className={`rounded-lg border-l-4 ${s.border} bg-panel2 p-4`}>
          <p className={`font-pixel text-[10px] uppercase tracking-wide ${s.label}`}>
            {s.icon} {block.title}
          </p>
          <p className="mt-2 text-parchment/90">{block.text}</p>
        </div>
      );
    }

    case "compare":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {[block.left, block.right].map((col, i) => (
            <div key={i} className="rounded-lg border-2 border-line bg-panel2 p-4">
              <p className="font-pixel text-[10px] uppercase text-goldlt">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.items.map((it, j) => (
                  <li key={j} className="flex gap-2 text-sm text-parchment/85">
                    <span className="text-quest">◆</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    case "formula":
      return (
        <div className="rounded-lg border-2 border-dashed border-gold/50 bg-gold/5 p-4">
          <p className="font-pixel text-[10px] uppercase text-gold">🧮 {block.label}</p>
          <p className="mt-2 font-pixel text-[11px] leading-relaxed text-goldlt sm:text-xs">
            {block.formula}
          </p>
          {block.note && <p className="mt-2 text-sm text-muted">{block.note}</p>}
        </div>
      );
  }
}

export default function LessonView({ lesson }: { lesson: Lesson }) {
  return (
    <article className="space-y-4">
      <h3 className="h-pixel text-base text-parchment sm:text-lg">{lesson.title}</h3>
      <div className="space-y-4">
        {lesson.blocks.map((b, i) => (
          <Block key={i} block={b} />
        ))}
      </div>
    </article>
  );
}
