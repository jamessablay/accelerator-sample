// -----------------------------------------------------------------------------
// Measure an element's rendered size, live.
//
// WHY THIS EXISTS
// Two different problems, one measurement.
//
// 1. SVG TYPE SIZE. The SVG views declare `fontSize` in viewBox user units, which
//    the browser scales along with the rest of the drawing. That made a declared
//    size meaningless as a legibility guarantee: `fontSize={10}` rendered at
//    15.0px inside the journey Table and 6.8px inside the Strip, purely because
//    the two callers pass a different `columnWidth` and therefore a different
//    viewBox. Pair `width` with `svgFont()` in data/type.ts.
//
// 2. FILLING THE BOX. A `w-full h-auto` SVG has its height dictated by its width
//    and its viewBox aspect, so it cannot use spare vertical room: on a tall
//    screen the Flow left about a third of the page empty. `height` lets a view
//    compute a viewBox aspect that matches its container. See MindsetFlow.
//
// Tailwind is CDN only here, so there are no container queries. This hook is also
// the general answer for "the constraint is the panel, not the viewport", which
// the `stacked` prop on PersonaDetail solves by hand.
// -----------------------------------------------------------------------------

import { useCallback, useEffect, useRef, useState } from 'react';

export interface ElementSize {
  width: number;
  height: number;
}

/**
 * Returns a ref to attach to the measured element and its current size in CSS
 * px, or `null` before the first measurement.
 *
 * Callers must handle the `null` first render. `svgFont()` does this by falling
 * through to the raw target size, so labels are never blanked or NaN sized.
 */
export function useElementSize<T extends HTMLElement>(): [
  (node: T | null) => void,
  ElementSize | null,
] {
  const [size, setSize] = useState<ElementSize | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  // A callback ref, not useRef + useEffect. The measured node is swapped when a
  // view remounts behind the variant switcher, and a callback ref fires on that
  // swap where an effect keyed on `[]` would keep observing the detached node.
  const ref = useCallback((node: T | null) => {
    observerRef.current?.disconnect();
    observerRef.current = null;

    if (!node) return;

    const r = node.getBoundingClientRect();
    setSize({ width: r.width, height: r.height });

    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      // borderBoxSize is not populated in every engine; the rect always is.
      const { width, height } = entry.contentRect;
      // Sub-pixel churn from a scrollbar appearing would otherwise re-render on
      // every frame of a resize.
      setSize((prev) =>
        prev && Math.abs(prev.width - width) < 0.5 && Math.abs(prev.height - height) < 0.5
          ? prev
          : { width, height },
      );
    });
    observer.observe(node);
    observerRef.current = observer;
  }, []);

  useEffect(() => () => observerRef.current?.disconnect(), []);

  return [ref, size];
}
