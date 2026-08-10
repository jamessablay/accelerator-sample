import React, { useCallback, useState } from 'react';
import { LYKA, TEN_THINGS, BASIS_COLORS } from '../../data/brand';
import { TRACKING } from '../../data/type';
import type { NumbersTable, TenThing } from '../../data/tenThingsData';
import { BASIS_LABELS } from '../../data/tenThingsData';
import { TEN_THINGS_CHARTS } from './charts';
import Lightbox from '../shared/Lightbox';

// -----------------------------------------------------------------------------
// The modal body for one point.
//
// FIVE LABELLED BLOCKS since 2026-08-10, matching the dog owner source page:
//
//   What we found | Why it matters | [the basis] | What to do | What we still
//   need to test
//
// Two of those were not labelled blocks before, and the reason for changing is
// the media plan's Role of Channel lesson verbatim: A POPULATED FIELD WITH NO
// LABEL IS A MISSING FIELD.
//
//   - `learn` rendered as a bare paragraph under the stat. Read as a preamble
//     rather than as one of the findings.
//   - `worthKnowing` was collapsed inside a <details> headed "Worth knowing".
//     A field nobody opens is a field nobody reads, and this one carries the
//     caveat on five of the ten points.
//
// THE NUMBERS TABLE STAYS A DISCLOSURE, and that is not an inconsistency. It is
// a table of source figures rather than a finding, it is the one thing here a
// reader looks up rather than reads, and a collapsed <details> is exactly right
// for that. It sits last, after the two action blocks.
//
// THE CHART MOVED ABOVE THE PROSE, also matching the source. The stat and the
// chart are the evidence; the five blocks are the reading of it.
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

/** The uppercase mono label every block carries. One place, so they cannot drift. */
const BlockLabel: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = LYKA.muted,
}) => (
  <span
    className="block text-micro font-bold uppercase font-mono"
    style={{ letterSpacing: TRACKING.eyebrow, color }}
  >
    {children}
  </span>
);

/** A labelled prose block. The hairline is what separates it from the one above. */
const Block: React.FC<{ label: string; children: React.ReactNode; lead?: boolean }> = ({
  label,
  children,
  lead = false,
}) => (
  <div className="border-t pt-3" style={{ borderColor: LYKA.mint }}>
    <BlockLabel>{label}</BlockLabel>
    <p
      className={`mt-1.5 max-w-[74ch] leading-relaxed ${lead ? 'text-lead' : 'text-body'}`}
      style={{ color: LYKA.muted }}
    >
      {children}
    </p>
  </div>
);

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

const NumbersGrid: React.FC<{ table: NumbersTable }> = ({ table }) => (
  <>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-label">
        <thead>
          <tr>
            {table.columns.map((c) => (
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
          {table.rows.map((row, i) => (
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
    {table.note && (
      <p className="mt-2 text-meta italic" style={{ color: LYKA.muted }}>
        {table.note}
      </p>
    )}
  </>
);

// `React.FC` AND an annotated parameter, which looks redundant and is not.
// @types/react is not installed, so `React.FC` is `any`: that is what lets the
// call site pass `key` (pages/TenThings.tsx remounts this per point). Annotating
// the destructured parameter is what gives the body real typing. Dropping either
// half breaks something. Same pattern as the apex components.
const TenThingsDetail: React.FC<{ point: TenThing }> = ({ point }: { point: TenThing }) => {
  const [zoomed, setZoomed] = useState<string | null>(null);
  const closeZoom = useCallback(() => setZoomed(null), []);
  const ChartComponent = TEN_THINGS_CHARTS[point.chart];
  const basis = BASIS_COLORS[point.basis];
  const basisLabel = BASIS_LABELS[point.basis];

  return (
    <div>
      {/* The proof figure, with the basis pill beside it. */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="border-l-[3px] pl-4" style={{ borderColor: TEN_THINGS.seriesInk }}>
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
        <span
          className="flex-shrink-0 rounded-full px-3 py-1.5 text-micro font-bold uppercase font-mono"
          style={{
            letterSpacing: TRACKING.eyebrow,
            backgroundColor: basis.mark,
            color: basis.markInk,
          }}
        >
          {basisLabel.pill}
        </span>
      </div>

      {ChartComponent ? (
        <ChartComponent discrepancy={point.discrepancy} />
      ) : (
        <p className="text-body" style={{ color: LYKA.muted }}>
          No chart is registered for this point.
        </p>
      )}

      {/* Point 07 only. The choropleth stays a PNG: there is no Chart.js path to
          956 ABS postal area boundaries. Hotspots are the source's own
          percentages, so they track the image at any width.

          IT SURVIVED THE DOG OWNER REDRAW, which dropped it. RAV is an average
          across customers, so no population divides it and the map is still
          correct; it is also the only support for the 1.60x the copy quotes. */}
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

      <div className="mt-6 space-y-4">
        <Block label="What we found" lead>
          {renderEmphasis(point.learn, point.emphasis)}
        </Block>

        <Block label="Why it matters">{point.worthKnowing}</Block>

        {/* THE BASIS BLOCK. A left rail on a tint, deliberately NOT the filled
            card shape the two action blocks use, so five blocks in a row do not
            read as five equal cards. Same shape as the discrepancy note and the
            page's Sources strip. */}
        <div
          className="rounded-xl border-l-[3px] px-4 py-3"
          style={{ backgroundColor: basis.tint, borderColor: basis.mark }}
        >
          <BlockLabel color={basis.tintInk}>{basisLabel.block}</BlockLabel>
          <p
            className="mt-1.5 max-w-[74ch] text-body leading-relaxed"
            style={{ color: basis.tintInk }}
          >
            {point.basisNote}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div
          className="rounded-xl border p-4"
          style={{ backgroundColor: '#D6EDE7', borderColor: 'rgba(10,125,104,0.24)' }}
        >
          <BlockLabel color="#075746">What to do</BlockLabel>
          <p className="mt-1.5 text-body leading-relaxed" style={{ color: LYKA.ink }}>
            {point.implication}
          </p>
        </div>
        <div
          className="rounded-xl border p-4"
          style={{ backgroundColor: LYKA.cream, borderColor: 'rgba(246,139,31,0.3)' }}
        >
          <BlockLabel color="#8C3D24">What we still need to test</BlockLabel>
          <p className="mt-1.5 text-body leading-relaxed" style={{ color: LYKA.ink }}>
            {point.test}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <Disclosure summary={point.numbers.summary}>
          <NumbersGrid table={point.numbers} />
        </Disclosure>
        {point.numbersSecondary && (
          <Disclosure summary={point.numbersSecondary.summary}>
            <NumbersGrid table={point.numbersSecondary} />
          </Disclosure>
        )}
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
