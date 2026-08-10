import React, { useState } from 'react';
import { LYKA } from '../../data/brand';
import { CONTRASTS } from '../../data/notionCoworkingData';

// Small local arrow. currentColor so the row hover can drive its colour.
const Arrow: React.FC = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

// -----------------------------------------------------------------------------
// Section F (top): from scattered to shared (slide 9).
//
// Five static before -> after rows. Before is muted (the old way), after is teal
// (the shared space). Hover emphasises the whole row: the after cell lifts and
// deepens, the before cell fades a touch further. No stateful interaction beyond
// hover (decided scope).
//
// The arrow stacks to a downward chevron below sm, where the two cells sit one
// above the other.
// -----------------------------------------------------------------------------

const BeforeAfter: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {CONTRASTS.map((row, i) => {
        const on = hovered === i;
        return (
          <div
            key={row.before}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="grid grid-cols-1 items-stretch gap-2 sm:grid-cols-[1fr_auto_1fr]"
          >
            {/* Before */}
            <div
              className="rounded-xl border px-4 py-3 text-body transition-all duration-300"
              style={{
                borderColor: LYKA.mint,
                backgroundColor: LYKA.ivory,
                color: LYKA.muted,
                opacity: on ? 0.7 : 1,
              }}
            >
              {row.before}
            </div>

            {/* Connector: right arrow on sm+, down chevron when stacked */}
            <div className="flex items-center justify-center" style={{ color: on ? LYKA.accentInk : LYKA.mintMuted }}>
              <span className="hidden transition-colors duration-300 sm:block">
                <Arrow />
              </span>
              <span className="block rotate-90 transition-colors duration-300 sm:hidden">
                <Arrow />
              </span>
            </div>

            {/* After */}
            <div
              className={`rounded-xl border px-4 py-3 text-body font-semibold transition-all duration-300 ${
                on ? '-translate-y-0.5 shadow-[0_12px_28px_-16px_rgba(0,86,72,0.28)]' : ''
              }`}
              style={{
                borderColor: on ? LYKA.accentInk : LYKA.mint,
                backgroundColor: on ? LYKA.accentInk : '#FFFFFF',
                color: on ? '#FFFFFF' : LYKA.tealDeepest,
              }}
            >
              {row.after}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BeforeAfter;
