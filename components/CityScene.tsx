"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Full-screen parallax diorama behind the quiz. Back-to-front: sky gradient,
 * stars, the distant "sky-city" skyline (fills the whole sky so it's never
 * empty), drifting clouds, then the player's tower + crane + street that build
 * up in front. The whole scene is laid out relative to `formHeight` (the live
 * height of the quiz form) so the tower is always planted right on top of the
 * form, and the glowing construction frontier sits in the clear sky above it.
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
  const bf = Math.max(0.03, Math.min(1, fraction));

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

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
    const MAXX = 16, MAXY = 8;
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

  // ---- geometry (px), laid out around the live quiz-form height ----
  const ready = h > 0 && w > 0;
  const formH = Math.min(h * 0.82, formHeight || h * 0.46); // the form covers the bottom; the scene owns everything above it
  const sky = h - formH; // height of the open scene above the form
  const towerW = Math.min(w * 0.5, 280);
  const H = towerW / 0.6667; // tower full height (box matches art aspect → fills, no padding)
  const ground = h - formH; // tower is planted right on top of the form
  const targetLine = sky * 0.34; // frontier parks here, in the clear sky above the form
  const camY = Math.max(ground, targetLine + bf * H); // base at the form top until the tower outgrows the sky, then pans
  const building = bf < 0.999;

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden">
      {/* sky gradient */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #0b0e14 0%, #11151f 36%, #16203a 64%, #1d2c4d 100%)" }} />

      {/* stars */}
      <div
        data-parallax data-fx="0.2"
        className="absolute inset-[-6%] animate-twinkle"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 18% 14%, #ffd35c99, transparent), radial-gradient(1px 1px at 68% 10%, #ffffff77, transparent), radial-gradient(1px 1px at 42% 22%, #ffd35c77, transparent), radial-gradient(1px 1px at 84% 18%, #ffffff66, transparent), radial-gradient(1px 1px at 55% 6%, #ffd35c66, transparent), radial-gradient(1px 1px at 9% 26%, #ffffff55, transparent), radial-gradient(1px 1px at 30% 9%, #ffffff44, transparent)",
        }}
      />

      {ready && (
        <>
          {/* sky-city skyline backdrop — fills the whole open sky so it's never empty */}
          <div data-parallax data-fx="0.55" className="absolute inset-x-[-8%]" style={{ top: 0, height: sky }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/build/sky_city_skyline.png" alt="" className="pixelated h-full w-full object-cover object-bottom opacity-95" />
          </div>

          {/* clouds, in front of the distant city */}
          <div data-parallax data-fx="0.9" className="absolute inset-x-[-10%] top-0" style={{ height: sky * 0.62 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/build/clouds_far.png" alt="" className="pixelated h-full w-full animate-clouddrift object-cover opacity-65" />
          </div>

          {/* camera world — the player's build, planted on the form, pans as it rises */}
          <div className="absolute inset-0 transition-transform duration-700 ease-out" style={{ transform: `translateY(${camY}px)` }}>
            {/* crane behind the tower */}
            <div data-parallax data-fx="1.7" className="absolute" style={{ top: -H * 1.06, height: H * 1.06, left: `calc(50% + ${towerW * 0.34}px)`, width: towerW * 0.78 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/build/crane.png" alt="" className="pixelated h-full w-full object-contain object-bottom opacity-90" draggable={false} />
            </div>

            {/* the player's tower, revealed bottom-up (base at world y=0) */}
            <div data-parallax data-fx="1.6" className="absolute left-1/2 -translate-x-1/2" style={{ top: -H, height: H, width: towerW }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/build/hero_tower.png"
                alt="Your startup, under construction"
                className="pixelated h-full w-full object-cover object-bottom drop-shadow-[0_0_26px_rgba(245,180,36,0.35)] transition-[clip-path] duration-700 ease-out"
                style={{ clipPath: `inset(${(1 - bf) * 100}% 0 0 0)` }}
                draggable={false}
              />
            </div>

            {/* construction frontier */}
            {building && (
              <div data-parallax data-fx="1.6" className="absolute left-1/2 z-10 -translate-x-1/2 transition-[top] duration-700 ease-out" style={{ top: -bf * H, width: towerW * 1.16 }}>
                <div className="mx-auto h-[3px] w-[92%] animate-beam bg-gold shadow-[0_0_16px_4px_rgba(245,180,36,0.85)]" />
                <div className="mx-auto -mt-1 h-2 w-2 animate-floaty rounded-[2px] bg-goldlt shadow-[0_0_12px_3px_rgba(245,180,36,0.9)]" />
              </div>
            )}

            {/* foreground street + lamps at the tower's foot */}
            <div data-parallax data-fx="2.2" className="absolute inset-x-[-10%]" style={{ top: -h * 0.03, height: h * 0.3 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/build/ground_plate.png" alt="" className="pixelated h-full w-full object-cover object-top" draggable={false} />
            </div>
          </div>
        </>
      )}

      {/* floor counter chip */}
      <div className="absolute right-3 top-[68px] z-40 rounded-md border border-line bg-ink/70 px-2 py-1 backdrop-blur">
        <span className="font-pixel text-[8px] text-goldlt">🏗 {floors}/{totalFloors} floors</span>
      </div>
    </div>
  );
}
