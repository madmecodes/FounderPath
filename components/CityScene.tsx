"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Full-screen parallax diorama. A fixed sky (gradient + stars + drifting clouds)
 * sits behind a camera-panned "world" (distant skyline, the player's rising tower,
 * a crane, and a foreground street). As `fraction` (0..1 of the whole journey)
 * grows, the tower is revealed bottom-up and the camera pans so the glowing
 * construction frontier always stays in the clear sky just above the quiz card.
 */
export default function CityScene({
  fraction,
  floors,
  totalFloors,
}: {
  fraction: number;
  floors: number;
  totalFloors: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);
  const reduced = useRef(false);

  const bf = Math.max(0.03, Math.min(1, fraction));

  // measure scene height
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setH(el.clientHeight));
    ro.observe(el);
    setH(el.clientHeight);
    return () => ro.disconnect();
  }, []);

  // pointer / tilt parallax via a single rAF loop writing transforms directly
  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) return;

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

    const MAXX = 18;
    const MAXY = 9;
    const tick = () => {
      cur.x += (target.x - cur.x) * 0.08;
      cur.y += (target.y - cur.y) * 0.08;
      const els = root.querySelectorAll<HTMLElement>("[data-parallax]");
      els.forEach((el) => {
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

  // ---- camera + layout geometry (px), derived from measured height ----
  const towerW = Math.min(h * 0.42, 320); // on-screen tower width
  const H = towerW / 0.6667; // full tower height — box matches the art's 1024x1536 aspect so it fills with no padding
  const B = h * 1.1; // ground line (tower base) from world-wrapper top
  const targetLine = h * 0.34; // keep the frontier here, in clear sky above the card
  const camY = targetLine - B + bf * H; // pan so frontier sits at targetLine
  const frontierY = B - bf * H; // world-Y of the current build top
  const skylineH = h * 0.5;
  const building = bf < 0.999;

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden">
      {/* L0 — fixed sky gradient (never empty, never moves) */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, #0b0e14 0%, #11151f 42%, #16203a 72%, #1c2b4a 100%)" }}
      />

      {/* L1 — stars (fixed, slight parallax) */}
      <div
        data-parallax
        data-fx="0.25"
        className="absolute inset-[-8%] animate-twinkle"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20% 18%, #ffd35c88, transparent), radial-gradient(1px 1px at 70% 12%, #ffffff66, transparent), radial-gradient(1px 1px at 40% 30%, #ffd35c66, transparent), radial-gradient(1px 1px at 85% 26%, #ffffff55, transparent), radial-gradient(1px 1px at 55% 8%, #ffd35c55, transparent), radial-gradient(1px 1px at 10% 36%, #ffffff44, transparent)",
        }}
      />

      {/* L2 — drifting clouds (fixed band, parallax + ambient drift) */}
      <div data-parallax data-fx="0.5" className="absolute inset-x-[-10%] top-0 h-[48%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/build/clouds_far.png"
          alt=""
          className="pixelated h-full w-full animate-clouddrift object-cover opacity-80"
        />
      </div>

      {/* camera world — pans vertically as the tower rises */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out"
        style={{ transform: `translateY(${h ? camY : 0}px)` }}
      >
        {h > 0 && (
          <>
            {/* L3 — distant sky-city skyline, bottom-aligned to the ground line */}
            <div
              data-parallax
              data-fx="1"
              className="absolute inset-x-[-10%]"
              style={{ top: B - skylineH, height: skylineH }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/build/sky_city_skyline.png" alt="" className="pixelated h-full w-full object-cover object-bottom opacity-90" />
            </div>

            {/* L4 — the player's tower, revealed bottom-up (box matches art aspect → fills, no padding) */}
            <div
              data-parallax
              data-fx="1.7"
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: B - H, height: H, width: towerW }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/build/hero_tower.png"
                alt="Your startup, under construction"
                className="pixelated h-full w-full object-cover object-bottom drop-shadow-[0_0_22px_rgba(245,180,36,0.3)] transition-[clip-path] duration-700 ease-out"
                style={{ clipPath: `inset(${(1 - bf) * 100}% 0 0 0)` }}
                draggable={false}
              />
            </div>

            {/* L5 — construction frontier: glowing beam + spark */}
            {building && (
              <div
                data-parallax
                data-fx="1.7"
                className="absolute left-1/2 z-10 -translate-x-1/2 transition-[top] duration-700 ease-out"
                style={{ top: frontierY, width: towerW * 1.12 }}
              >
                <div className="mx-auto h-[3px] w-[90%] animate-beam bg-gold shadow-[0_0_16px_4px_rgba(245,180,36,0.85)]" />
                <div className="mx-auto -mt-1 h-2 w-2 animate-floaty rounded-[2px] bg-goldlt shadow-[0_0_12px_3px_rgba(245,180,36,0.9)]" />
              </div>
            )}

            {/* L5b — crane beside the tower */}
            <div
              data-parallax
              data-fx="1.9"
              className="absolute"
              style={{ top: B - H * 1.05, height: H * 1.05, left: `calc(50% + ${towerW * 0.32}px)`, width: towerW * 0.8 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/build/crane.png" alt="" className="pixelated h-full w-full object-contain object-bottom" draggable={false} />
            </div>

            {/* L6 — foreground street / ground plate */}
            <div data-parallax data-fx="2.4" className="absolute inset-x-[-10%]" style={{ top: B - h * 0.06, height: h * 0.4 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/build/ground_plate.png" alt="" className="pixelated h-full w-full object-cover object-top" draggable={false} />
            </div>
          </>
        )}
      </div>

      {/* floor counter chip */}
      <div className="absolute right-3 top-[64px] z-40 rounded-md border border-line bg-ink/70 px-2 py-1 backdrop-blur">
        <span className="font-pixel text-[8px] text-goldlt">🏗 {floors}/{totalFloors} floors</span>
      </div>
    </div>
  );
}
