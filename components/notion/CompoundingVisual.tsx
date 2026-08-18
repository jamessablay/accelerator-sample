import React, { useEffect, useRef, useState } from 'react';
import { LYKA } from '../../data/brand';
import { COMPOUNDING } from '../../data/notionCoworkingData';

// -----------------------------------------------------------------------------
// Section E (left): the context compounds (slide 7).
//
// Month 1 / 3 / 6 as three growing stacks of small rounded DOM blocks: `level`
// (1 to 3) sets how many blocks a month carries, so the stacks visibly grow.
// `level` is NOT a measure, it is the deck's own three-step illustration; there
// is no figure to overstate.
//
// MINIMAL ONE-SHOT ANIMATION (decided scope). An IntersectionObserver reveals
// the blocks once, bottom to top, when the visual scrolls into view. It never
// re-runs. `prefers-reduced-motion: reduce` renders the final state immediately
// with no transition, so it degrades to a static stack.
//
// DOM, not SVG, and blocks are meaningful marks: LYKA.accentInk is 5:1 on white,
// clearing the 3:1 non-text floor.
// -----------------------------------------------------------------------------

const BLOCKS_PER_LEVEL = 2; // level 1 -> 2 blocks, 2 -> 4, 3 -> 6
const MAX_BLOCKS = 3 * BLOCKS_PER_LEVEL;

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CompoundingVisual: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  // Reduced motion starts revealed, so the observer never needs to fire.
  const [revealed, setRevealed] = useState<boolean>(() => prefersReducedMotion());
  const animate = !prefersReducedMotion();

  useEffect(() => {
    if (revealed) return;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setRevealed(true); // no observer support: show it rather than hide it
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [revealed]);

  return (
    <div ref={ref}>
      <div className="flex items-end justify-center gap-6 sm:gap-10">
        {COMPOUNDING.map((month) => {
          const count = month.level * BLOCKS_PER_LEVEL;
          return (
            <div key={month.label} className="flex flex-1 flex-col items-center">
              <div className="flex w-full max-w-[92px] flex-col-reverse gap-1.5" style={{ minHeight: 0 }}>
                {Array.from({ length: count }).map((_, i) => {
                  // Global stagger index so taller stacks keep rising after the
                  // short ones have settled, reading as accumulation over time.
                  const delay = animate ? (i / MAX_BLOCKS) * 420 : 0;
                  return (
                    <div
                      key={i}
                      className="h-5 w-full rounded-md"
                      style={{
                        backgroundColor: LYKA.accentInk,
                        opacity: revealed ? 1 : 0,
                        transform: revealed ? 'translateY(0)' : 'translateY(10px)',
                        transition: animate
                          ? `opacity 360ms var(--brand-ease) ${delay}ms, transform 360ms var(--brand-ease) ${delay}ms`
                          : 'none',
                      }}
                    />
                  );
                })}
              </div>
              <span className="mt-3 text-label font-semibold" style={{ color: LYKA.ink }}>
                {month.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompoundingVisual;
