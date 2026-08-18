import React, { useState } from 'react';
import { LYKA } from '../../data/brand';
import { PILLARS } from '../../data/notionCoworkingData';

// -----------------------------------------------------------------------------
// Section C: the four places (slide 4).
//
// Styled like ApexMethodology's source cards: white card, mint hairline, accent
// top rule, big font-display number, title, blurb, bullet list with accent dots.
// Bullets are ALWAYS visible (decided scope: no expand, no modal). Hover is
// emphasis only: the card lifts and its top rule thickens, matching the apex
// cards, but the content never changes.
//
// One accent, LYKA.accentInk (5:1 on white), across all four. The pillars are
// peers, not a ramp, so a single page-identity teal reads better than four hues.
// -----------------------------------------------------------------------------

const ACCENT = LYKA.accentInk;

const PillarCards: React.FC = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
      {PILLARS.map((pillar) => {
        const focused = hovered === pillar.id;
        return (
          <article
            key={pillar.id}
            onMouseEnter={() => setHovered(pillar.id)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(pillar.id)}
            onBlur={() => setHovered(null)}
            tabIndex={0}
            className={`relative rounded-2xl border bg-white shadow-sm outline-none transition-all duration-300 ease-out focus-visible:ring-2 ${
              focused ? '-translate-y-1 shadow-[0_18px_40px_-16px_rgba(0,86,72,0.28)]' : ''
            }`}
            style={{ borderColor: focused ? ACCENT : LYKA.border }}
          >
            <div
              className="absolute left-0 right-0 top-0 rounded-t-2xl transition-all duration-300"
              style={{ height: focused ? '8px' : '4px', backgroundColor: ACCENT }}
            />
            <div className="px-5 pb-6 pt-7 md:px-6">
              <div
                className="text-figure leading-none tracking-wide md:text-display"
                style={{ color: ACCENT }}
              >
                {pillar.number}
              </div>
              <h3 className="mt-3 text-lead font-semibold" style={{ color: LYKA.tealDeepest }}>
                {pillar.title}
              </h3>
              <p className="mt-1 text-meta italic md:text-body" style={{ color: LYKA.muted }}>
                {pillar.blurb}
              </p>
              <ul className="mt-4 space-y-2">
                {pillar.items.map((item) => (
                  <li key={item} className="flex gap-2 text-body" style={{ color: LYKA.ink }}>
                    <span
                      className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: ACCENT }}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default PillarCards;
