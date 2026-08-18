import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { LYKA } from '../../data/brand';
import { TRACKING } from '../../data/type';
import { useElementSize } from '../../hooks/useElementSize';
import { ECOSYSTEM_HUB, CONNECTIONS, FIT_CAPTION } from '../../data/ecosystemData';

// -----------------------------------------------------------------------------
// Section A: the four connections into Lyka's ecosystem (the source's SVG hub
// diagram, rebuilt as DOM cards + a measured SVG connector overlay).
//
// The cards and hub are DOM (the gap-matrix precedent), laid out on a CSS grid so
// they stack cleanly below lg. On lg the four corner cards fan into the central
// hub with CURVED TIES, faithful to the original deck, so the diagram reads as
// four connections rather than a grid of cards beside a box.
//
// The ties are a DECORATIVE SVG overlay: it carries no text, so none of the
// svgFont / type apparatus is pulled in. Its endpoints are MEASURED from the real
// card and hub rects (the MindsetFlow measure-then-draw pattern via
// useElementSize), so they stay aligned across sidebar collapse, resize and
// font-load reflow. The page's animate-fadeIn transform shifts the wrapper, hub
// and cards together, so relative coordinates are unaffected and no timing wait
// is needed.
//
// Ties are an lg-only device: below lg the hub goes full width / the cards stack,
// so the corner geometry does not exist and no ties are drawn.
//
// Layout. DOM order is [hub, ...four cards]. Responsive placement only:
//   base : one column, hub first then the four cards.
//   md   : two columns, hub spanning the top row, then a 2 x 2 of cards.
//   lg   : three columns, the hub in the centre spanning both rows, one card in
//          each corner, so it reads as a hub with four spokes.
//
// The hub is dark and dominant and NEVER dims. Hovering a connection card lifts it
// and thickens its accent rule (the PillarCards idiom) while the others dim, and
// its tie brightens while the other three ties dim (the ApexMethodology /
// SharedSpaceDiagram focus/dim pattern).
// -----------------------------------------------------------------------------

const ACCENT = LYKA.accentInk;

// Corner placement on lg, matched to DOM order (card 0..3). Middle column is the
// hub, so cards take columns 1 and 3.
const LG_PLACEMENT = [
  'lg:col-start-1 lg:row-start-1',
  'lg:col-start-3 lg:row-start-1',
  'lg:col-start-1 lg:row-start-2',
  'lg:col-start-3 lg:row-start-2',
];

interface Tie {
  id: string;
  d: string;
  cardX: number;
  cardY: number;
  hubX: number;
  hubY: number;
}

// Push each dot this far off its block, into the gutter, so it reads as a plug
// entering the gap rather than a dot stuck to an edge.
const DOT_INSET = 4;
const DOT_R = 4;

const EcosystemDiagram: React.FC = () => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [isLg, setIsLg] = useState(false);
  const [ties, setTies] = useState<Tie[]>([]);
  const [box, setBox] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const hubRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [sizeRef, size] = useElementSize<HTMLDivElement>();

  // Attach both the measuring ref (for the ResizeObserver re-render) and our own
  // handle (for getBoundingClientRect) to the same grid element.
  const setWrap = useCallback(
    (node: HTMLDivElement | null) => {
      wrapRef.current = node;
      sizeRef(node);
    },
    [sizeRef],
  );

  // lg is Tailwind's 1024px, the same breakpoint that makes the grid 3-column.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setIsLg(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    const hub = hubRef.current;
    if (!wrap || !hub) return;
    const W = wrap.getBoundingClientRect();
    setBox({ w: W.width, h: W.height });

    if (!isLg) {
      setTies([]);
      return;
    }

    const H = hub.getBoundingClientRect();
    const hubCentreX = H.left + H.width / 2 - W.left;
    const hubCentreY = H.top + H.height / 2 - W.top;

    const next: Tie[] = [];
    cardRefs.current.forEach((card, i) => {
      const conn = CONNECTIONS[i];
      if (!card || !conn) return;
      const C = card.getBoundingClientRect();
      const cardCentreX = C.left + C.width / 2 - W.left;
      const cardCentreY = C.top + C.height / 2 - W.top;
      const isLeft = cardCentreX < hubCentreX;
      const isTop = cardCentreY < hubCentreY;

      // Card end: the hub-facing edge at the card's vertical centre, nudged into
      // the gutter. Hub end: the near edge, fanned to 0.3 / 0.7 of hub height.
      const cardX = (isLeft ? C.right - W.left : C.left - W.left) + (isLeft ? DOT_INSET : -DOT_INSET);
      const cardY = cardCentreY;
      const hubX = (isLeft ? H.left - W.left : H.right - W.left) + (isLeft ? -DOT_INSET : DOT_INSET);
      const hubY = H.top - W.top + H.height * (isTop ? 0.3 : 0.7);

      const dx = hubX - cardX;
      const dir = Math.sign(dx) || 1;
      const handle = Math.abs(dx) * 0.5;
      const d = `M ${cardX} ${cardY} C ${cardX + dir * handle} ${cardY}, ${hubX - dir * handle} ${hubY}, ${hubX} ${hubY}`;
      next.push({ id: conn.id, d, cardX, cardY, hubX, hubY });
    });
    setTies(next);
  }, [isLg]);

  // Re-measure after layout and whenever the wrapper size changes (sidebar
  // toggle, viewport resize, font-load reflow all move the cards).
  useLayoutEffect(() => {
    measure();
  }, [measure, size]);

  // Belt and braces: fonts loading after first paint reflows the cards.
  useEffect(() => {
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) measure();
    });
    return () => {
      cancelled = true;
    };
  }, [measure]);

  const anyHover = hovered !== null;

  return (
    <div>
      <div
        ref={setWrap}
        className="relative grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:grid-rows-2 lg:items-stretch lg:gap-x-12 lg:gap-y-6"
      >
        {/* Connector ties. Behind the cards (z-0), visible only in the gutters. */}
        {isLg && ties.length > 0 && (
          <svg
            aria-hidden="true"
            width={box.w}
            height={box.h}
            className="pointer-events-none absolute left-0 top-0 z-0 overflow-visible"
          >
            {ties.map((t) => {
              const on = hovered === t.id;
              const dim = anyHover && !on;
              const opacity = on ? 1 : dim ? 0.22 : 0.7;
              return (
                <g key={t.id} className="transition-opacity duration-300" style={{ opacity }}>
                  <path
                    d={t.d}
                    fill="none"
                    stroke={ACCENT}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                    style={{ strokeWidth: on ? 2.5 : 1.5 }}
                  />
                  <circle cx={t.cardX} cy={t.cardY} r={DOT_R} fill={ACCENT} />
                  <circle cx={t.hubX} cy={t.hubY} r={DOT_R} fill={ACCENT} />
                </g>
              );
            })}
          </svg>
        )}

        {/* The hub. Full width below lg via col-span; centred and row-spanning on lg. */}
        <div
          ref={hubRef}
          className="relative z-10 rounded-2xl px-6 py-6 text-center shadow-[0_18px_40px_-16px_rgba(0,86,72,0.28)] md:col-span-2 lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:flex lg:flex-col lg:justify-center"
          style={{ backgroundColor: LYKA.tealDeepest }}
        >
          <p
            className="text-micro font-bold uppercase font-mono text-white/55"
            style={{ letterSpacing: TRACKING.eyebrow }}
          >
            {ECOSYSTEM_HUB.eyebrow}
          </p>
          <p className="mt-2 text-lead leading-tight text-white md:text-title">
            {ECOSYSTEM_HUB.title}
          </p>
          <ul className="mx-auto mt-4 max-w-xs space-y-1.5">
            {ECOSYSTEM_HUB.items.map((item) => (
              <li key={item} className="text-meta leading-relaxed text-white/80 md:text-body">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* The four connection cards. */}
        {CONNECTIONS.map((c, i) => {
          const focused = hovered === c.id;
          const dimmed = hovered !== null && !focused;
          return (
            <article
              key={c.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              onMouseEnter={() => setHovered(c.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(c.id)}
              onBlur={() => setHovered(null)}
              tabIndex={0}
              className={`relative z-10 rounded-2xl border bg-white px-5 py-5 outline-none transition-all duration-300 ease-out focus-visible:ring-2 ${LG_PLACEMENT[i]} ${
                focused ? '-translate-y-1 shadow-[0_18px_40px_-16px_rgba(0,86,72,0.28)]' : ''
              } ${dimmed ? 'opacity-60' : 'opacity-100'}`}
              style={{ borderColor: focused ? ACCENT : LYKA.border, ['--tw-ring-color' as string]: ACCENT }}
            >
              <div
                className="absolute left-0 right-0 top-0 rounded-t-2xl transition-all duration-300"
                style={{ height: focused ? '6px' : '3px', backgroundColor: ACCENT }}
              />
              <h3 className="mt-1 text-body font-semibold md:text-lead" style={{ color: LYKA.tealDeepest }}>
                {c.title}
              </h3>
              <p className="mt-1.5 text-meta leading-relaxed md:text-body" style={{ color: LYKA.muted }}>
                {c.body}
              </p>
            </article>
          );
        })}
      </div>

      <p
        className="mx-auto mt-6 max-w-2xl text-center text-body leading-relaxed"
        style={{ color: LYKA.accentInk }}
      >
        {FIT_CAPTION}
      </p>
    </div>
  );
};

export default EcosystemDiagram;
