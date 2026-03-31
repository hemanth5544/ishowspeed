"use client";

import { useEffect, useRef, useState } from "react";

interface Options {
  decimals?: number;   // how many decimal places to display
  duration?: number;   // animation duration in ms
}

/**
 * Animates a number from its previous value to the new value.
 * Returns a formatted string ready to render.
 *
 * Usage:
 *   const display = useAnimatedNumber(summary.download, { decimals: 1 });
 *   <span>{display}</span>
 */
export function useAnimatedNumber(
  target: number,
  { decimals = 1, duration = 600 }: Options = {}
): string {
  const [display, setDisplay] = useState(target);
  const prevRef   = useRef(target);
  const rafRef    = useRef<number | null>(null);
  const startRef  = useRef<number | null>(null);

  useEffect(() => {
    // Skip animation when resetting to 0
    if (target === 0) {
      setDisplay(0);
      prevRef.current = 0;
      return;
    }

    const from = prevRef.current;
    const to   = target;
    prevRef.current = to;

    if (from === to) return;

    // Cancel any in-flight animation
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    startRef.current = null;

    function tick(timestamp: number) {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed  = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (to - from) * eased);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(to);
        rafRef.current = null;
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  if (target === 0) return "—";
  return display.toFixed(decimals);
}