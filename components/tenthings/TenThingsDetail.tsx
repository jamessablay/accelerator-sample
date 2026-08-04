import React, { useCallback, useState } from 'react';
import { LYKA, TEN_THINGS } from '../../data/brand';
import { TRACKING } from '../../data/type';
import type { TenThing } from '../../data/tenThingsData';
import { TEN_THINGS_CHARTS } from './charts';
import Lightbox from '../shared/Lightbox';

// -----------------------------------------------------------------------------
// The modal body for one point. Order matches the source page: stat, paragraph,
// chart, map (point 07 only), the two disclosures, then implication and test.
//
// `emphasis` is a list of substrings to bold, so the data file carries no markup
// and nothing needs dangerouslySetInnerHTML. data/__integrity.ts asserts every
// substring is actually present, because a typo would silently no-op.
// -----------------------------------------------------------------------------

/** Percentage positioned hotspots on the composite map, verbatim from the source. */
const MAP_HOTSPOTS = [
  { city: 'sydney', label: 'Sydney', left: '4.64%', top: '9.1%' },
  { city: 'melbourne', label: 'Melbourne', left: '37.89%', top: '9.1%' },
  { city: 'brisbane', label: 'Brisbane', left: '71.13%', top: '9.1%' },
  { city: 'perth', label: 'Perth', left: '4.64%', top: '52.77%' },
  { city: 'adelaide', label: 'Adelaide', left: '37.89%', top: '52.77%' },
] as const;

const HOTSPOT_SIZE = { width: '24.23%', height: '39.73%' };

/** Split `text` on each `emphasis` substring and wrap the matches in <b>. */
function renderEmphasis(text: string, emphasis?: readonly string[]): React.ReactNode {
  if (!emphasis?.length) return text;
  const escaped = emphasis.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'g'));
  return parts.map((part, i) =>
    emphasis.includes(part) ? (
      <b key={i} style={{ color: LYKA.tealDeepest }}>
        {part}
      </b>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );
}

const Disclosure: React.FC<{ summary: string; children: React.ReactNode }> = ({
  summary,
  children,
}) => (
  <details className="border-t py-1" style={{ borderColor: LYKA.mint }}>
    <summary
      className="cursor-pointer list-none py-2.5 text-micro font-bold uppercase font-mono transition-colors marker:content-none hover:opacity-70"
      style={{ letterSpacing: TRACKING.eyebrow, color: LYKA.muted }}
    >
      {summary}
    </summary>
    <div className="pb-3">{children}</div>
  </details>
);

const TenThingsDetail: React.FC<{ point: TenThing }> = ({ point }) => {
  const [zoomed, setZoomed] = useState<string | null>(null);
  const closeZoom = useCallback(() => setZoomed(null), []);
  const ChartComponent = TEN_THINGS_CHARTS[point.chart];

  return (
    <div>
      {/* The proof figure. */}
      <div className="mb-5 border-l-[3px] pl-4" style={{ borderColor: TEN_THINGS.seriesInk }}>
        <span
          className="block text-figure font-bold leading-none font-display tabular-nums"
          style={{ color: TEN_THINGS.seriesInk }}
        >
          {point.statValue}
        </span>
        <span
          className="mt-1.5 block text-micro uppercase font-mono"
          style={{ letterSpacing: TRACKING.eyebrow, color: LYKA.muted }}
        >
          {point.statLabel}
        </span>
      </div>

      <p className="mb-5 max-w-[74ch] text-lead leading-relaxed" style={{ color: LYKA.muted }}>
        {renderEmphasis(point.learn, point.emphasis)}
      </p>

      {ChartComponent ? (
        <ChartComponent discrepancy={point.discrepancy} />
      ) : (
        <p className="text-body" style={{ color: LYKA.muted }}>
          No chart is registered for this point.
        </p>
      )}

      {/* Point 07 only. The choropleth stays a PNG: there is no Chart.js path to
          956 ABS postal area boundaries. Hotspots are the source's own
          percentages, so they track the image at any width. */}
      {point.mapImage && (
        <figure className="m-0 mt-6">
          <div
            className="relative overflow-hidden rounded-xl border p-2"
            style={{ borderColor: LYKA.mint, backgroundColor: '#FFFFFF' }}
          >
            <img src={point.mapImage.src} alt={point.mapImage.alt} className="block h-auto w-full" />
            {MAP_HOTSPOTS.map((h) => {
              const city = point.mapImage?.cities?.[h.city];
              if (!city) return null;
              return (
                <button
                  key={h.city}
                  type="button"
                  onClick={() => setZoomed(city)}
                  aria-label={`Enlarge the ${h.label} map`}
                  className="group absolute cursor-zoom-in rounded-lg border-2 border-transparent bg-transparent p-0 transition-colors hover:border-[#0A7D68] hover:bg-[#10B193]/15 focus:border-[#0A7D68] focus:bg-[#10B193]/15 focus:outline-none"
                  style={{ left: h.left, top: h.top, ...HOTSPOT_SIZE }}
                >
                  <span
                    className="pointer-events-none absolute bottom-2 left-1/2 translate-x-[-50%] translate-y-1 whitespace-nowrap rounded-md px-2.5 py-1 text-micro font-mono uppercase opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100"
                    style={{
                      backgroundColor: LYKA.tealDeepest,
                      color: LYKA.pageBg,
                      letterSpacing: TRACKING.eyebrow,
                    }}
                  >
                    {h.label}
                  </span>
                </button>
              );
            })}
          </div>
          <figcaption className="mt-2 text-meta leading-relaxed" style={{ color: LYKA.muted }}>
            {point.mapImage.caption}
            <span className="mt-1 block italic">
              The map ramp is the source rendering and is not the Lyka palette. It cannot be
              recoloured without the original notebook and the ABS boundary data.
            </span>
          </figcaption>
        </figure>
      )}

      <div className="mt-6">
        <Disclosure summary={point.numbers.summary}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-label">
              <thead>
                <tr>
                  {point.numbers.columns.map((c) => (
                    <th
                      key={c}
                      scope="col"
                      className="px-2.5 py-2 text-left text-micro font-medium uppercase font-mono"
                      style={{
                        backgroundColor: LYKA.tealDeepest,
                        color: LYKA.pageBg,
                        letterSpacing: TRACKING.eyebrow,
                      }}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {point.numbers.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className="border-b px-2.5 py-1.5 tabular-nums"
                        style={{ borderColor: LYKA.mint, color: LYKA.ink }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {point.numbers.note && (
            <p className="mt-2 text-meta italic" style={{ color: LYKA.muted }}>
              {point.numbers.note}
            </p>
          )}
        </Disclosure>

        <Disclosure summary="Worth knowing">
          <p className="max-w-[74ch] text-body leading-relaxed" style={{ color: LYKA.muted }}>
            {point.worthKnowing}
          </p>
        </Disclosure>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div
          className="rounded-xl border p-4"
          style={{ backgroundColor: '#D6EDE7', borderColor: 'rgba(10,125,104,0.24)' }}
        >
          <span
            className="block text-micro font-bold uppercase font-mono"
            style={{ letterSpacing: TRACKING.eyebrow, color: '#075746' }}
          >
            Implication
          </span>
          <p className="mt-1.5 text-body leading-relaxed" style={{ color: LYKA.ink }}>
            {point.implication}
          </p>
        </div>
        <div
          className="rounded-xl border p-4"
          style={{ backgroundColor: LYKA.cream, borderColor: 'rgba(246,139,31,0.3)' }}
        >
          <span
            className="block text-micro font-bold uppercase font-mono"
            style={{ letterSpacing: TRACKING.eyebrow, color: '#8C3D24' }}
          >
            Test
          </span>
          <p className="mt-1.5 text-body leading-relaxed" style={{ color: LYKA.ink }}>
            {point.test}
          </p>
        </div>
      </div>

      <Lightbox
        src={zoomed}
        alt="Postcode value map, enlarged"
        onClose={closeZoom}
        hint="Click anywhere or press Escape to close the map"
      />
    </div>
  );
};

export default TenThingsDetail;
