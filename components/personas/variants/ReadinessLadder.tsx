import React, { useState } from 'react';
import { getSegmentColor, LYKA } from '../../../data/brand';
import { GAPS, TOTAL_DOG_OWNERS, formatVolume, INVERSION } from '../../../data/audienceModel';
import { TRACKING } from '../../../data/type';
import type { StageMetrics } from '../../../data/audienceModel';
import type { PersonaVizProps } from './types';

// -----------------------------------------------------------------------------
// READINESS LADDER
//
// THE ARGUMENT: two bars of the same total width, stacked. The top is sized by
// share of market, the bottom by share of Lyka customers. They invert. Ribbons
// join each stage to itself so the twist is a shape rather than a pair of
// numbers you have to hold in your head.
//
// WHY LIGHT ON TOP AND DARK BELOW
// Not decoration. Tint reads as unrealised, solid reads as realised, so the
// encoding carries the same meaning as the geometry. It is also what forces the
// `tint` / `tintInk` pair added to SegmentColorSet: at this size a dark fill
// across 49% of the width dominates everything else on the page.
//
// LAYOUT IS HTML, NOT SVG. Percentage widths, real text truncation and hover
// states are all free in flexbox, and every one of them is fiddly in SVG. Only
// the ribbon band is SVG, because only it needs geometry.
//
// The ribbon SVG uses viewBox="0 0 100 100" with preserveAspectRatio="none", so
// x coordinates ARE percentages and line up with the flex bands exactly. Safe
// here because the ribbons are straight-sided: non-uniform scaling would distort
// curves and strokes, so keep them fill-only and keep the edges straight.
// -----------------------------------------------------------------------------

/** Running [start, end] offsets in percent, for aligning the ribbon band to the bars. */
const offsets = (values: number[]): { start: number; end: number }[] => {
  let acc = 0;
  return values.map((v) => {
    const start = acc;
    acc += v;
    return { start, end: acc };
  });
};

/** Gutter between bands, in px. */
const GAP = 3;

/**
 * Band width, gutters accounted for.
 *
 * The shares sum to exactly 100%, so `width: X%` on flex children PLUS a flex gap
 * overflows the row by the total gutter width and puts a horizontal scrollbar on
 * the page. Each band gives back its share of the gutters instead.
 */
const bandWidth = (sharePct: number, bandCount: number): string =>
  `calc(${sharePct}% - ${(GAP * (bandCount - 1)) / bandCount}px)`;

interface BarProps {
  stages: StageMetrics[];
  /** Which share drives the widths. */
  metric: 'marketPct' | 'customerPct';
  hoveredKey: string | null;
  dimmedKey: (key: string) => boolean;
  onHover: (key: string | null) => void;
  onSelectStage: (key: string) => void;
}

const MarketBar: React.FC<BarProps & PersonaVizProps> = ({
  stages,
  hoveredKey,
  dimmedKey,
  onHover,
  onSelectStage,
  onSelectPersona,
  selectedPersonaId,
}) => (
  // A flex SHARE of the box, not a viewport clamp. `min-h` keeps it usable on a
  // short screen; `max-h` stops the heading and the chips drifting absurdly far
  // apart on a tall one, and the slack it gives back flows to the ribbon, which
  // is the element that most rewards height.
  <div className="flex w-full flex-[8] min-h-[150px] max-h-[300px] gap-[3px]">
    {stages.map((stage) => {
      const c = getSegmentColor(stage.key);
      const isDim = dimmedKey(stage.key);
      // Bands narrower than this cannot hold the stage name beside the figure.
      const nameFits = stage.marketPct >= 12;
      return (
        <div
          key={stage.key}
          className="relative flex flex-col rounded-lg overflow-hidden cursor-pointer transition-opacity duration-300"
          style={{
            width: bandWidth(stage.marketPct, stages.length),
            backgroundColor: c.tint,
            opacity: isDim ? 0.35 : 1,
            outline: hoveredKey === stage.key ? `2px solid ${c.base}` : 'none',
            outlineOffset: '-2px',
          }}
          onMouseEnter={() => onHover(stage.key)}
          onMouseLeave={() => onHover(null)}
          onClick={(e) => {
            e.stopPropagation();
            onSelectStage(stage.key);
          }}
        >
          {/* Stage heading.
              The figure is `figure` (24), down from 30. Compressing the top of
              the scale is what pays for the chips below: at 30 against a 9.5px
              label the range inside one band was 3.2:1, which is not hierarchy,
              it is one shout and one whisper. 24 against `meta` is 2:1, and the
              6px saved per band is most of what the two-line chip needs.

              `flex-1 justify-center`, because the band's HEIGHT encodes nothing
              (width carries the share). Once the ladder fills a tall screen the
              leftover height inside a band is pure padding, and pinning the
              heading to the top left a visible hole above the chips. Centred, the
              same slack reads as generous spacing.

              The 2xl step is the one place type is viewport responsive. On a
              1920 boardroom screen these bands are 1500px of canvas and the fixed
              scale started to look lost in them. It is confined to the two
              largest roles in this view; the reading floor never moves. */}
          <div className="flex flex-1 min-h-0 flex-col justify-center px-2.5 pt-2.5 pb-1 min-w-0">
            <div
              className={`font-display font-semibold leading-tight truncate ${
                nameFits ? 'text-lead 2xl:text-title' : 'text-label 2xl:text-body'
              }`}
              style={{ color: c.tintInk }}
            >
              {nameFits ? stage.label : stage.key}
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span
                className="font-display text-figure 2xl:text-[32px] font-bold leading-none"
                style={{ color: c.tintInk }}
              >
                {stage.marketPct}%
              </span>
              {stage.marketVolume !== null && (
                <span
                  className="font-mono text-meta 2xl:text-label tracking-tight"
                  style={{ color: c.tintInk, opacity: 0.85 }}
                >
                  {formatVolume(stage.marketVolume)}
                </span>
              )}
            </div>
          </div>

          {/* Persona chips, split across the band by their own market share. */}
          <div className="mt-auto flex gap-[3px] p-[3px]">
            {stage.personas.map((pm) => {
              const isSelected = selectedPersonaId === pm.persona.id;
              return (
                <button
                  key={pm.persona.id}
                  className="persona-chip min-w-0 rounded px-2 py-1.5 text-left focus:outline-none"
                  style={{
                    width: bandWidth(
                      (pm.marketPct / stage.marketPct) * 100,
                      stage.personas.length,
                    ),
                    // THE RESTING FILL IS A CUSTOM PROPERTY, NOT backgroundColor.
                    // An inline `background-color` outranks any stylesheet rule,
                    // so .persona-chip:hover could never override it. The ring
                    // still appeared, because nothing sets box-shadow inline, and
                    // that is the trap: hover looked like it worked while half of
                    // it silently did not. Handing both states to the stylesheet
                    // removes the specificity fight rather than winning it with
                    // !important. The flow's chips are unaffected: an SVG `fill`
                    // presentation attribute loses to CSS, which inline style
                    // does not.
                    ['--chip-bg' as string]: isSelected ? c.base : 'rgba(255,255,255,0.62)',
                    // Hover and focus, applied by .persona-chip in index.html.
                    // Token derived, no new hexes: an unselected chip washes
                    // further toward white, which can only IMPROVE contrast with
                    // its dark tintInk, and a selected one lifts base to the
                    // `hover` token that exists for exactly this. The ring is the
                    // band's own hover colour, so a chip and its band highlight
                    // the same way; on a selected chip it flips light, because
                    // base on hover is two neighbouring darks.
                    ['--chip-hover-bg' as string]: isSelected ? c.hover : 'rgba(255,255,255,0.95)',
                    ['--chip-hover-ring' as string]: isSelected ? c.tint : c.base,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPersona(pm.persona);
                  }}
                  title={`${pm.persona.name} | ${pm.persona.marketShare} of market | ${pm.persona.customerShare} of Lyka customers`}
                >
                  {/* TWO LINES, NOT THREE. The third line carried
                      `0.27x | Medium`, which is already in the detail panel and
                      in this button's own title tooltip. Deleting it rather than
                      enlarging it is what let lines 1 and 2 clear the 12px floor
                      inside the same vertical budget.
                      The figures are bare percentages because the narrowest band
                      (Ready, 11% of 1048px, so a ~90px chip) cannot hold
                      "22% mkt | 6% cust" at 12px. The two bars are labelled
                      "Share of market" and "Share of Lyka customers", so the
                      axis carries the meaning; the full string is in the tooltip. */}
                  <div
                    className="text-label 2xl:text-body font-semibold leading-tight truncate"
                    style={{ color: isSelected ? c.ink : c.tintInk }}
                  >
                    {pm.persona.name}
                  </div>
                  <div
                    className="font-mono text-meta 2xl:text-label leading-tight mt-0.5 truncate"
                    style={{ color: isSelected ? c.ink : c.tintInk, opacity: 0.88 }}
                  >
                    {pm.marketPct}% | {pm.customerPct}%
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    })}
  </div>
);

const ReadinessLadder: React.FC<PersonaVizProps> = (props) => {
  const { stages, selectedStageKey, selectedPersonaId, onSelectStage } = props;
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const marketOffsets = offsets(stages.map((s) => s.marketPct));
  const customerOffsets = offsets(stages.map((s) => s.customerPct));

  const hasSelection = !!selectedStageKey || selectedPersonaId !== null;
  const selectedStageOfPersona = selectedPersonaId
    ? stages.find((s) => s.personas.some((p) => p.persona.id === selectedPersonaId))?.key ?? null
    : null;
  const activeKey = selectedStageKey ?? selectedStageOfPersona;
  const dimmedKey = (key: string) => hasSelection && activeKey !== null && key !== activeKey;

  // Gap header bands span the MARKET axis, because the split describes where
  // people sit in the market, not where Lyka's customers came from.
  const gapSpans = GAPS.map((gap) => {
    const idxs = gap.stageKeys
      .map((k) => stages.findIndex((s) => s.key === k))
      .filter((i) => i >= 0);
    const start = Math.min(...idxs.map((i) => marketOffsets[i].start));
    const end = Math.max(...idxs.map((i) => marketOffsets[i].end));
    return { gap, start, width: end - start };
  });

  return (
    // FILLS THE BOX, both axes. The bars used to be `clamp(a, Nvh, b)` with a
    // fixed ceiling, so on anything taller than about 900px the whole ladder
    // stopped growing and floated in the middle of an empty page. The three bars
    // are `flex` shares of whatever height is left after the fixed chrome, with
    // px floors so a short viewport still gets a usable ladder rather than
    // slivers. Width cap went 1180 to 1600 for the same reason.
    <div
      className="w-full h-full max-w-[1600px] mx-auto flex flex-col min-h-0"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Total */}
      <div
        className="rounded-lg px-4 py-2 mb-3 text-center flex-shrink-0"
        style={{ backgroundColor: LYKA.tealDeepest }}
      >
        <span
          className="font-mono text-micro uppercase text-white/85"
          style={{ letterSpacing: TRACKING.eyebrow }}
        >
          Total Australian dog owners
        </span>
        {TOTAL_DOG_OWNERS !== null && (
          <span className="ml-3 font-display text-title font-bold text-white">
            {formatVolume(TOTAL_DOG_OWNERS)}
          </span>
        )}
      </div>

      {/* Belief gap | Friction gap.
          68px, up from 52. Two reasons: the rationale line is `meta` now, and
          the title row wraps. THE FRICTION BAND IS ONLY 26% WIDE, about 248px of
          content, and "Friction gap" plus "26% market | 82% customers" needs
          roughly 258px on one line, so it used to spill past the band edge. */}
      <div className="relative h-[68px] mb-2 flex-shrink-0">
        {gapSpans.map(({ gap, start, width }) => (
          <div
            key={gap.id}
            className="absolute top-0 h-full rounded-lg border px-3 py-1.5 flex flex-col justify-center"
            style={{
              left: `${start}%`,
              width: `calc(${width}% - ${GAP}px)`,
              backgroundColor: gap.id === 'belief' ? LYKA.cream : LYKA.peach,
              borderColor: LYKA.mint,
            }}
          >
            {/* `flex-wrap`: on the narrow Friction band the figures drop to their
                own line rather than overrunning. Both spans stay nowrap so a
                figure pair never breaks mid-string. */}
            <div className="flex flex-wrap items-baseline gap-x-2 min-w-0">
              <span
                className="font-display text-body font-bold whitespace-nowrap"
                style={{ color: LYKA.tealDeepest }}
              >
                {gap.label}
              </span>
              <span
                className="font-mono text-meta whitespace-nowrap"
                style={{ color: LYKA.muted }}
              >
                {gap.marketPct}% market | {gap.customerPct}% customers
              </span>
            </div>
            <div className="text-meta leading-tight truncate" style={{ color: LYKA.muted }}>
              {gap.rationale}
            </div>
          </div>
        ))}
      </div>

      {/* Market bar */}
      <div className="flex items-center justify-between mb-1 flex-shrink-0">
        <span
          className="font-mono text-micro uppercase"
          style={{ color: LYKA.accentInk, letterSpacing: TRACKING.eyebrow }}
        >
          Share of market
        </span>
        {/* Carries the index legend for BOTH bars, which is what lets the
            customer bands below print a bare "0.18x". At 1280 the 9% bands are
            about 64px of content and "0.18x index" does not fit at `meta`. */}
        <span className="font-mono text-meta" style={{ color: LYKA.muted }}>
          Band width = share of market | Nx = conversion index
        </span>
      </div>
      <MarketBar
        {...props}
        metric="marketPct"
        hoveredKey={hoveredKey}
        dimmedKey={dimmedKey}
        onHover={setHoveredKey}
      />

      {/* Ribbons. Straight sided, so preserveAspectRatio="none" is safe.
          UNCAPPED on purpose: it is the flex item that absorbs whatever the two
          bars give back, because the twist between market and customers is the
          argument of the whole view and it reads better the taller it is. */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full flex-[7] min-h-[90px] block"
        aria-hidden="true"
      >
        {stages.map((stage, i) => {
          const c = getSegmentColor(stage.key);
          const m = marketOffsets[i];
          const cu = customerOffsets[i];
          const isDim = dimmedKey(stage.key);
          return (
            <path
              key={stage.key}
              d={`M ${m.start} 0 L ${m.end} 0 L ${cu.end} 100 L ${cu.start} 100 Z`}
              fill={c.base}
              opacity={isDim ? 0.07 : hoveredKey === stage.key ? 0.42 : 0.2}
              style={{ transition: 'opacity 300ms' }}
            />
          );
        })}
      </svg>

      {/* Customer bar.
          Floor is 92: the stack is now 24 + 13 + 12 rather than 28 + 11.5 + 9.5,
          and these bands are `overflow-hidden`, so an overrun clips silently
          rather than showing itself. Capped for the same reason as the market
          bar: its content is centred and fixed, so past a point extra height is
          just a bigger empty block. */}
      <div className="flex w-full flex-[5] min-h-[92px] max-h-[200px] gap-[3px]">
        {stages.map((stage) => {
          const c = getSegmentColor(stage.key);
          const isDim = dimmedKey(stage.key);
          return (
            <div
              key={stage.key}
              // px-2, not px-3. The two 9% bands give about 56px of content at
              // 1280 and "Unaware" needs roughly 50px at `label`.
              className="relative rounded-lg overflow-hidden cursor-pointer flex flex-col justify-center px-2 transition-opacity duration-300"
              style={{
                width: bandWidth(stage.customerPct, stages.length),
                backgroundColor: c.base,
                opacity: isDim ? 0.35 : 1,
                outline: hoveredKey === stage.key ? `2px solid ${LYKA.tealDeepest}` : 'none',
                outlineOffset: '-2px',
              }}
              onMouseEnter={() => setHoveredKey(stage.key)}
              onMouseLeave={() => setHoveredKey(null)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectStage(stage.key);
              }}
              title={`${stage.label} | ${stage.customerPct}% of Lyka customers | ${stage.conversionIndex.toFixed(2)}x conversion index`}
            >
              <div
                className="font-display text-figure 2xl:text-[32px] font-bold leading-none"
                style={{ color: c.ink }}
              >
                {stage.customerPct}%
              </div>
              <div
                className="text-label 2xl:text-body font-semibold leading-tight truncate mt-1"
                style={{ color: c.ink, opacity: 0.95 }}
              >
                {stage.key}
              </div>
              <div
                className="font-mono text-meta 2xl:text-label leading-tight truncate"
                style={{ color: c.ink, opacity: 0.85 }}
              >
                {stage.conversionIndex.toFixed(2)}x
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-start justify-between mt-1.5 gap-4 flex-shrink-0">
        <span
          className="font-mono text-micro uppercase"
          style={{ color: LYKA.accentInk, letterSpacing: TRACKING.eyebrow }}
        >
          Share of Lyka customers
        </span>
        <span
          className="text-meta text-right leading-snug max-w-[52%]"
          style={{ color: LYKA.muted }}
        >
          The friction gap is <strong>{INVERSION.marketPct}%</strong> of the market and{' '}
          <strong>{INVERSION.customerPct}%</strong> of Lyka&apos;s customers. Lyka converts where
          belief already exists.
        </span>
      </div>
    </div>
  );
};

export default ReadinessLadder;
