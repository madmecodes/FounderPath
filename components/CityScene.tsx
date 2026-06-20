"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Background for the quiz: a full-bleed pixel sky-city that never crops awkwardly
 * (one portrait image, object-cover), with the player's startup tower growing
 * bottom-up directly on top of the quiz form as `fraction` (0..1) increases.
 * Deliberately simple and aspect-robust — no fragile multi-layer camera math.
 */
export default function CityScene({
  fraction,
  floors,
  totalFloors,
  formHeight,
}: {
  fraction: number;
  floors: number;
  totalFloors: number;
  formHeight: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [{ w, h }, setSize] = useState({ w: 0, h: 0 });
  const bf = Math.max(0.04, Math.min(1, fraction));

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

  // subtle pointer / tilt parallax (bg drifts a little, tower a bit more)
  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;
    const onPointer = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      target.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      target.x = Math.max(-1, Math.min(1, e.gamma / 35));
      target.y = Math.max(-1, Math.min(1, (e.beta - 45) / 35));
    };
    const MAXX = 14, MAXY = 8;
    const tick = () => {
      cur.x += (target.x - cur.x) * 0.08;
      cur.y += (target.y - cur.y) * 0.08;
      root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const fx = parseFloat(el.dataset.fx || "0");
        el.style.transform = `translate3d(${(-cur.x * fx * MAXX).toFixed(2)}px, ${(-cur.y * fx * MAXY).toFixed(2)}px, 0)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("deviceorientation", onTilt, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, []);

  const ready = h > 0 && w > 0;
  const formH = Math.min(h * 0.85, formHeight || h * 0.45);
  const sky = h - formH; // open scene above the form
  // tower sized so it always fits the open sky and the screen width
  const buildingH = Math.max(120, Math.min(sky * 0.74, w * 0.9));
  const towerW = buildingH * 0.6667;

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden bg-ink">
      {/* full-bleed sky-city background — one portrait image, never crops the sky weirdly */}
      <div data-parallax data-fx="0.3" className="absolute inset-[-4%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/build/cityscape.png" alt="" className="pixelated h-full w-full scale-105 object-cover object-top" draggable={false} />
      </div>
      {/* darken toward the bottom so the form sits cleanly under the scene */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(11,14,20,0.15) 0%, rgba(11,14,20,0.05) 45%, rgba(11,14,20,0.85) 100%)" }} />

      {ready && (
        /* the player's tower, planted on top of the form, revealed bottom-up */
        <div
          data-parallax data-fx="1.1"
          className="absolute"
          style={{ bottom: formH, height: buildingH, width: towerW, left: "50%", marginLeft: -towerW / 2 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/build/hero_tower.png"
            alt="Your startup, under construction"
            className="pixelated absolute bottom-0 h-full w-full object-cover object-bottom drop-shadow-[0_0_26px_rgba(245,180,36,0.4)] transition-[clip-path] duration-700 ease-out"
            style={{ clipPath: `inset(${(1 - bf) * 100}% 0 0 0)` }}
            draggable={false}
          />
          {/* glowing construction line at the current build top */}
          {bf < 0.999 && (
            <div className="pointer-events-none absolute inset-x-[-14%] transition-[bottom] duration-700 ease-out" style={{ bottom: `${bf * 100}%` }}>
              <div className="mx-auto h-[3px] w-[88%] animate-beam bg-gold shadow-[0_0_16px_4px_rgba(245,180,36,0.85)]" />
              <div className="mx-auto -mt-1 h-2 w-2 animate-floaty rounded-[2px] bg-goldlt shadow-[0_0_12px_3px_rgba(245,180,36,0.9)]" />
            </div>
          )}
        </div>
      )}

      {/* floor counter chip */}
      <div className="absolute right-3 top-[68px] z-40 rounded-md border border-line bg-ink/70 px-2 py-1 backdrop-blur">
        <span className="font-pixel text-[8px] text-goldlt">🏗 {floors}/{totalFloors} floors</span>
      </div>
    </div>
  );
}
