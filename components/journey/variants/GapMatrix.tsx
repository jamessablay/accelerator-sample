import React, { useMemo, useState } from 'react';
import Modal from '../../shared/Modal';
import GapBar from '../GapBar';
import {
  LYKA,
  FOCUS,
  getSegmentColor,
  gapWash,
  GAP_INK,
  GAP_SCALE_MAX,
  GAP_POSITIVE_HUE,
  GAP_NEGATIVE_HUE,
} from '../../../data/brand';
// MEDIA_FOCUS_NOTE is deliberately NOT imported: it names the colour green, and
// this view marks with a dashed outline instead. See its docblock.
import { isFocusCell, isFocusStage, MEDIA_FOCUS_LABEL } from '../../../data/mediaFocus';
import { TRACKING } from '../../../data/type';
import {
  JOURNEY_STAGE_NAMES,
  parseScoreData,
  isTruncatedDescriptor,
  findUniversalStageShift,
  findLevelCells,
} from '../../../data/journeyModel';
import type { JourneyMetrics } from '../../../data/journeyModel';
import type { JourneyVizProps } from './types';

// -----------------------------------------------------------------------------
// GAP MATRIX. Five journeys down, five stages across, all 25 cells at once.
//
// THE ARGUMENT, and why this is not another Compare. The five raw curves are the
// SAME SHAPE: every journey rises into Contemplation, dips at Preparation, peaks
// at Action and falls at Maintenance, and rational climbs monotonically to
// Preparation in all five. Five small multiples of that is five copies of one
// curve at different heights, which is what Compare already shows. "The
// trajectories differ" is not a finding this data supports.
//
// What differs is the GAP. Its five trajectories are genuinely distinct:
// whipsaw, deep and flat, spike then settle, shallow and tight, high with one
// dip. `scores[].gap` has been computed for all 25 cells since journeyModel was
// written and plotted by nothing until now.
//
// Read ACROSS a row for one journey's arc. Read DOWN a column for how the five
// differ at the same moment. The second read is the one no other view offers.
//
// -----------------------------------------------------------------------------
// EVERY NUMBER ON THIS SCREEN IS DERIVED, which makes this the most exposed view
// in the app on the honesty constraint. Compare shows study curves plus a
// derived bar; this shows 25 derived numbers and zero study numbers. The note is
// therefore element two in the DOM, above the scroll fold by construction, and
// the cell pop-up shows both study values beside the gap so the arithmetic is
// inspectable rather than asserted.
//
// THE TWO FINDINGS ARE DERIVED AT RUNTIME, not written down. See
// findUniversalStageShift and findLevelCells in data/journeyModel.ts. Change a
// score and the copy changes with it, or disappears. It can never state a
// finding the data no longer supports.
//
// -----------------------------------------------------------------------------
// DOM, NOT SVG, deliberately. An SVG here would inherit the whole svgFont plus
// useElementSize plus MIN_COMPENSATED_WIDTH apparatus that exists because a
// declared SVG fontSize is not a rendered size. A CSS grid gets real CSS px for
// free, which is also why the minimum-font-size check passes by construction.
//
// ONE ROW PER <div>, NOT ONE FLAT 25 CHILD GRID. This is structural, not
// stylistic. In a flat grid a journey with four stages does not leave a hole:
// every subsequent cell slides up one and the entire grid is off by one, fully
// populated with real numbers under the wrong headers, with nothing on screen
// saying so. A row wrapper makes that physically impossible.
//
// AND THE AXIS IS INDEXED, NOT MAPPED. We walk JOURNEY_STAGE_NAMES and look the
// stage up by title, so a renamed or reordered stage renders an explicit empty
// cell in the RIGHT column instead of shifting its neighbours.
//
// -----------------------------------------------------------------------------
// ⚠ THE MEDIA FOCUS MARK IS DELIBERATELY NOT THE WASH THE OTHER FOUR VIEWS USE.
//
// Two separate reasons, and both are about this view specifically.
//
// FIRST, THE FILL IS THE DATUM. Every cell is already coloured by `gapWash(g)`,
// so laying a green over the marked ones does not add emphasis, it changes 6 of
// the 25 readings. The wash appears only on the column HEADERS, which carry no
// value.
//
// SECOND, `FOCUS.edge` IS BYTE FOR BYTE `GAP_NEGATIVE_HUE`. Both are #0A7D68,
// because both were derived from the same Lyka accent ink for good reasons in
// their own files. An outline in it would put the ramp's "reason ahead" colour
// around a cell that might sit at the opposite end of that ramp. So the cells
// take a DASHED outline in GAP_INK, which is the ink already printing a number
// in all 25: it introduces no hue, and a dash reads as annotation.
//
// If FOCUS.edge is ever changed, this stops being a collision and the reasoning
// above stops applying. The first reason still does.
// -----------------------------------------------------------------------------

const signed = (n: number) => (n > 0 ? `+${n}` : String(n));

/** The ramp, as a CSS gradient. Symmetric, because the encoding is symmetric. */
const RAMP_GRADIENT =
  `linear-gradient(90deg, ${gapWash(-GAP_SCALE_MAX)} 0%, ${gapWash(-18)} 40%, ` +
  `${gapWash(0)} 50%, ${gapWash(18)} 60%, ${gapWash(GAP_SCALE_MAX)} 100%)`;

/** Shared row height. Steps with the box, and the numeral steps with it. */
const ROW_H = 'min-h-[56px] roomy:min-h-[64px] 2xl:min-h-[72px]';

interface CellRef {
  journeyIndex: number;
  stageIndex: number;
}

const GapMatrix: React.FC<JourneyVizProps> = ({
  journeys,
  active,
  onSelectJourney,
  onRequestVariant,
}) => {
  const [hover, setHover] = useState<CellRef | null>(null);
  const [open, setOpen] = useState<CellRef | null>(null);

  // Both findings, and the observed range for the legend. All from the data.
  const universal = useMemo(() => findUniversalStageShift(journeys), [journeys]);
  const levelCells = useMemo(() => findLevelCells(journeys), [journeys]);
  const range = useMemo(() => {
    const all = journeys.flatMap((j) => j.scores.map((s) => s.gap));
    return { lo: Math.min(...all), hi: Math.max(...all) };
  }, [journeys]);

  /**
   * The cell for a journey at a stage, looked up BY TITLE rather than by index.
   * Returns null when the journey does not carry that stage at all.
   */
  const cellAt = (j: JourneyMetrics, stageName: string) => {
    const i = j.stages.findIndex((s) => s.title === stageName);
    if (i === -1 || !j.scores[i]) return null;
    return { index: i, stage: j.stages[i], score: j.scores[i] };
  };

  const openJourney = open ? journeys[open.journeyIndex] : null;
  const openCell =
    openJourney && open ? cellAt(openJourney, JOURNEY_STAGE_NAMES[open.stageIndex]) : null;

  const modalEmotional = openCell ? parseScoreData(openCell.stage.emotionalScore) : null;
  const modalRational = openCell ? parseScoreData(openCell.stage.rationalScore) : null;

  return (
    <div className="animate-fadeIn h-full flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
      {/* ---- Header strip: eyebrow and the ramp legend ---- */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 mb-1.5 flex-shrink-0">
        <span
          className="font-mono text-micro font-bold uppercase"
          style={{ color: LYKA.accentInk, letterSpacing: TRACKING.eyebrow }}
        >
          Gap matrix | five journeys by five stages
        </span>
        <span className="flex items-center gap-2 text-meta" style={{ color: LYKA.muted }}>
          <span>Reason ahead</span>
          <span
            className="h-2.5 w-32 rounded-full border"
            style={{ background: RAMP_GRADIENT, borderColor: LYKA.mint }}
            aria-hidden="true"
          />
          <span>Feeling ahead</span>
          <span className="font-mono">
            observed {range.lo} to {signed(range.hi)}
          </span>
        </span>
      </div>

      {/* ---- The derived note. ELEMENT TWO, so it cannot fall below a fold. ---- */}
      <p
        className="text-meta leading-snug mb-2 flex-shrink-0 max-w-5xl"
        style={{ color: LYKA.muted }}
      >
        Derived by SPEED, not a study rating: gap is emotional minus rational. Positive means
        feeling runs ahead of reason, negative means reason runs ahead. The 50 underlying
        emotional and rational scores are the study&apos;s own 0 to 100 ratings, and every cell
        shows both. The scale is symmetric to plus or minus {GAP_SCALE_MAX}. Dashed cells mark
        Contemplation and Preparation on the three journeys media is addressing.
      </p>

      {/* ---- The matrix ---- */}
      <div
        className="rounded-2xl border overflow-hidden flex-shrink-0"
        style={{ borderColor: LYKA.mint, boxShadow: LYKA.shadow }}
      >
        {/* Column headers. Same grid template as every row below. */}
        <div
          className="grid gap-px"
          style={{
            backgroundColor: LYKA.mint,
            gridTemplateColumns: `minmax(140px, 15%) repeat(${JOURNEY_STAGE_NAMES.length}, minmax(0, 1fr))`,
          }}
        >
          <div
            className="px-2.5 py-2 flex items-end"
            style={{ backgroundColor: LYKA.cream }}
          >
            <span
              className="font-mono text-micro font-bold uppercase"
              style={{ color: LYKA.muted, letterSpacing: TRACKING.eyebrow }}
            >
              Journey
            </span>
          </div>
          {JOURNEY_STAGE_NAMES.map((name, c) => (
            <div
              key={name}
              data-stage-header={name}
              className="relative px-2.5 py-2 flex items-center gap-2 transition-colors"
              style={{
                backgroundColor: hover?.stageIndex === c
                  ? LYKA.mint
                  : isFocusStage(name)
                    ? FOCUS.wash
                    : LYKA.cream,
              }}
            >
              {/* The header is the ONE surface in this view that carries no
                  datum, so the wash and the rule are safe here. See the ⚠ note
                  in the header about why they are not safe on the cells. */}
              {isFocusStage(name) && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[3px]"
                  style={{ backgroundColor: FOCUS.edge }}
                />
              )}
              <span
                className="text-label font-bold truncate"
                title={name}
                style={{ color: LYKA.tealDeepest }}
              >
                {name}
              </span>
              {isFocusStage(name) && (
                <span
                  className="flex-shrink-0 rounded px-1 py-0.5 font-mono text-[9px] font-bold uppercase"
                  style={{ backgroundColor: FOCUS.tagBg, color: FOCUS.tagInk }}
                  title={MEDIA_FOCUS_LABEL}
                >
                  Focus
                </span>
              )}
              {/* The marker moves with the finding, because both read the same
                  derived value. It is never a hardcoded column index. */}
              {universal?.stageIndex === c && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-[3px]"
                  style={{ backgroundColor: LYKA.accentInk }}
                />
              )}
            </div>
          ))}
        </div>

        {/* One div per row. See the header note: this is what stops a short row
            smearing its neighbours across the whole grid. */}
        {journeys.map((j, r) => {
          const colour = getSegmentColor(j.segmentKey);
          const isActive = j.type === active.type;
          return (
            <div
              key={j.type}
              data-journey-row={j.type}
              className="grid gap-px"
              style={{
                backgroundColor: LYKA.mint,
                gridTemplateColumns: `minmax(140px, 15%) repeat(${JOURNEY_STAGE_NAMES.length}, minmax(0, 1fr))`,
                marginTop: 1,
              }}
            >
              {/* Row header. Selecting does NOT change view: the page heading,
                  the task and the dynamic all update while all five stay up. */}
              <button
                type="button"
                onClick={() => onSelectJourney(j.type)}
                title={`Show ${j.meta.title} in the page heading`}
                className={`relative pl-4 pr-2.5 py-2 text-left flex items-center ${ROW_H} transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset`}
                style={{
                  backgroundColor: isActive
                    ? colour.tint
                    : hover?.journeyIndex === r
                      ? LYKA.cream
                      : '#FFFFFF',
                  // Focus ring in the journey's own colour, never the default blue.
                  '--tw-ring-color': colour.base,
                }}
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 inset-y-0"
                  style={{ width: isActive ? 6 : 4, backgroundColor: colour.base }}
                />
                <span
                  className="text-label font-bold leading-tight"
                  style={{ color: isActive ? colour.tintInk : LYKA.tealDeepest }}
                >
                  {j.meta.title}
                </span>
              </button>

              {JOURNEY_STAGE_NAMES.map((stageName, c) => {
                const cell = cellAt(j, stageName);
                if (!cell) {
                  // An explicit hole in the RIGHT column, never a shifted grid.
                  return (
                    <div
                      key={stageName}
                      className={`px-2.5 py-2.5 flex items-center ${ROW_H}`}
                      style={{ backgroundColor: '#FFFFFF' }}
                    >
                      {/* muted, not mintMuted: 1.88:1 on white. Quiet is a job
                          for a smaller size, never for sub-AA ink. */}
                      <span className="text-meta" style={{ color: LYKA.muted }}>
                        no data
                      </span>
                    </div>
                  );
                }
                const g = cell.score.gap;
                return (
                  <button
                    key={stageName}
                    type="button"
                    data-journey={j.type}
                    data-stage={stageName}
                    data-gap={g}
                    className={`gap-cell relative px-2.5 py-2.5 text-left flex flex-col justify-center gap-1.5 ${ROW_H}`}
                    style={{
                      // Resting fill goes through the stylesheet, NOT inline.
                      // See the .gap-cell block in index.html for why.
                      ['--cell-bg' as string]: gapWash(g),
                      ['--cell-ring' as string]: colour.base,
                    }}
                    onMouseEnter={() => setHover({ journeyIndex: r, stageIndex: c })}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover({ journeyIndex: r, stageIndex: c })}
                    onBlur={() => setHover(null)}
                    onClick={() => {
                      onSelectJourney(j.type);
                      setOpen({ journeyIndex: r, stageIndex: c });
                    }}
                    aria-label={`${j.meta.title}, ${stageName}. Emotional ${cell.score.emotional}, rational ${cell.score.rational}, derived gap ${signed(g)}.${
                      isFocusCell(j.type, stageName) ? ` ${MEDIA_FOCUS_LABEL}.` : ''
                    }`}
                  >
                    {/* Media focus, drawn as a DASHED OUTLINE IN THE CELL'S OWN
                        INK. Not the wash, and not FOCUS.edge. See the ⚠ note in
                        the file header: the fill here is the datum, and
                        FOCUS.edge is byte for byte GAP_NEGATIVE_HUE, so an edge
                        in it would read as the ramp's "reason ahead" end
                        wrapping a cell that may be at the opposite end. GAP_INK
                        already prints the number in all 25 cells, so it adds no
                        hue at all, and dashes read as annotation rather than as
                        data. */}
                    {isFocusCell(j.type, stageName) && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-[2px]"
                        style={{ border: `2px dashed ${GAP_INK}` }}
                      />
                    )}
                    <span
                      className="font-mono text-label roomy:text-body 2xl:text-lead font-bold"
                      style={{ color: GAP_INK }}
                    >
                      {signed(g)}
                    </span>
                    {g === 0 ? (
                      // A zero wash is indistinguishable from an empty cell, and
                      // a zero bar has no length, so level is its own mark.
                      <span
                        aria-hidden="true"
                        className="relative h-1.5 rounded-full"
                        style={{ backgroundColor: 'rgba(0,61,51,0.07)' }}
                      >
                        <span
                          className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 rounded-full"
                          style={{ backgroundColor: LYKA.tealDeepest }}
                        />
                      </span>
                    ) : (
                      <GapBar
                        gap={g}
                        track="rgba(0,61,51,0.07)"
                        className="relative h-1.5 rounded-full"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* ---- The two findings. Both derived, both navigable. ---- */}
      <div className="mt-2 grid grid-cols-1 roomy:grid-cols-2 gap-2 flex-shrink-0">
        <div
          className="rounded-2xl border px-3.5 py-2.5"
          style={{ backgroundColor: LYKA.ivory, borderColor: LYKA.mint }}
        >
          <p
            className="font-mono text-micro font-bold uppercase"
            style={{ color: LYKA.accentInk, letterSpacing: TRACKING.eyebrow }}
          >
            Read down a column
          </p>
          {universal ? (
            <>
              <p className="mt-1.5 text-body leading-snug" style={{ color: LYKA.ink }}>
                The gap moves toward {universal.towardReason ? 'reason' : 'feeling'} at{' '}
                <strong>{universal.stageName}</strong> in all {journeys.length} journeys. They
                differ in level, not in direction.
              </p>
              <p className="mt-1 font-mono text-meta" style={{ color: LYKA.muted }}>
                {universal.deltas.map((d) => `${d.label} ${signed(d.delta)}`).join(' | ')}
              </p>
            </>
          ) : (
            <p className="mt-1.5 text-body leading-snug" style={{ color: LYKA.ink }}>
              No stage moves the same way in all {journeys.length} journeys.
            </p>
          )}
        </div>

        <div
          className="rounded-2xl border px-3.5 py-2.5"
          style={{ backgroundColor: LYKA.ivory, borderColor: LYKA.mint }}
        >
          <p
            className="font-mono text-micro font-bold uppercase"
            style={{ color: LYKA.accentInk, letterSpacing: TRACKING.eyebrow }}
          >
            Where the two sides are level
          </p>
          {levelCells.length === 0 ? (
            <p className="mt-1.5 text-body leading-snug" style={{ color: LYKA.ink }}>
              No cell is exactly level.
            </p>
          ) : (
            <>
              <p className="mt-1.5 text-body leading-snug" style={{ color: LYKA.ink }}>
                {levelCells.length === 1
                  ? 'One cell sits at exactly zero.'
                  : new Set(levelCells.map((c) => c.caughtUp)).size > 1
                    ? `${levelCells.length} cells sit at exactly zero, and they are not the same thing.`
                    : `${levelCells.length} cells sit at exactly zero, and both arrive from the same side.`}
              </p>
              <div className="mt-1.5 flex flex-col gap-1">
                {levelCells.map((c) => (
                  <button
                    key={`${c.journey.type}-${c.stageName}`}
                    type="button"
                    onClick={() => {
                      onSelectJourney(c.journey.type);
                      setOpen({ journeyIndex: c.row, stageIndex: c.col });
                    }}
                    className="text-left text-meta leading-snug rounded px-1 -mx-1 transition-colors hover:bg-white focus:outline-none focus-visible:ring-2"
                    style={{
                      color: LYKA.ink,
                      // Focus ring in the journey's own colour, never the default blue.
                      '--tw-ring-color': getSegmentColor(c.journey.segmentKey).base,
                    }}
                  >
                    <strong>{c.journey.meta.label}</strong> at {c.stageName}: both {c.score}.{' '}
                    {c.caughtUp === 'reason'
                      ? 'Reason has caught up with feeling.'
                      : 'Feeling has caught up with reason.'}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ---- Cell pop-up ---- */}
      <Modal
        isOpen={open !== null && openCell !== null}
        onClose={() => setOpen(null)}
        maxWidth="max-w-3xl"
        eyebrow={openJourney ? openJourney.meta.title : undefined}
        title={openCell ? openCell.stage.title : undefined}
        subtitle={openCell?.stage.definition}
        position={open ? `${open.stageIndex + 1} / ${JOURNEY_STAGE_NAMES.length}` : undefined}
        // The stepper walks the ROW, which is "read across a row" made keyboard
        // native. Null rather than undefined at the ends, so the button renders
        // disabled instead of vanishing.
        onPrev={
          open && open.stageIndex > 0
            ? () => setOpen({ ...open, stageIndex: open.stageIndex - 1 })
            : null
        }
        onNext={
          open && open.stageIndex < JOURNEY_STAGE_NAMES.length - 1
            ? () => setOpen({ ...open, stageIndex: open.stageIndex + 1 })
            : null
        }
      >
        {openCell && modalEmotional && modalRational && openJourney ? (
          <div>
            {/* The encoding, reprised wide, so the pop-up teaches the grid. */}
            <div
              className="rounded-2xl border px-4 py-3"
              style={{ backgroundColor: LYKA.ivory, borderColor: LYKA.mint }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span
                  className="font-mono text-micro font-bold uppercase"
                  style={{ color: LYKA.accentInk, letterSpacing: TRACKING.eyebrow }}
                >
                  Derived gap: emotional minus rational
                </span>
                <span
                  className=" text-figure font-bold tabular-nums"
                  style={{ color: GAP_INK }}
                >
                  {signed(openCell.score.gap)}
                </span>
              </div>
              {openCell.score.gap === 0 ? (
                <div
                  className="relative h-3 rounded-full mt-2"
                  style={{ backgroundColor: LYKA.cream }}
                >
                  <span
                    className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 rounded-full"
                    style={{ backgroundColor: LYKA.tealDeepest }}
                  />
                </div>
              ) : (
                <GapBar gap={openCell.score.gap} className="relative h-3 rounded-full mt-2" />
              )}
              <div
                className="mt-1 flex justify-between font-mono text-meta"
                style={{ color: LYKA.muted }}
              >
                <span>Reason ahead, to -{GAP_SCALE_MAX}</span>
                <span>0</span>
                <span>Feeling ahead, to +{GAP_SCALE_MAX}</span>
              </div>
            </div>

            {/* The two STUDY values, verbatim. This is the payload of the cell. */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { hue: GAP_POSITIVE_HUE, name: 'Emotional', parsed: modalEmotional },
                { hue: GAP_NEGATIVE_HUE, name: 'Rational', parsed: modalRational },
              ].map((s) => (
                <div key={s.name} className="pl-3 border-l-[3px]" style={{ borderColor: s.hue }}>
                  <p
                    className="font-mono text-micro font-bold uppercase"
                    style={{ color: s.hue, letterSpacing: TRACKING.eyebrow }}
                  >
                    {s.name} {s.parsed.value}
                  </p>
                  <p className="mt-1.5 text-lead leading-relaxed" style={{ color: LYKA.ink }}>
                    {s.parsed.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Honest about a defect in the source deck rather than papering over it. */}
            {(isTruncatedDescriptor(modalEmotional.label) ||
              isTruncatedDescriptor(modalRational.label)) && (
              <p className="mt-4 text-meta" style={{ color: LYKA.muted }}>
                Note: a score descriptor for this stage is cut off in the source deck. Shown as
                supplied, not completed.
              </p>
            )}

            {onRequestVariant && (
              <div className="mt-6 pt-4 border-t" style={{ borderColor: LYKA.mint }}>
                <button
                  type="button"
                  onClick={() => {
                    onSelectJourney(openJourney.type);
                    setOpen(null);
                    onRequestVariant('spine');
                  }}
                  className="rounded-full px-4 py-2 text-label font-semibold transition-colors focus:outline-none focus-visible:ring-2"
                  style={{ backgroundColor: LYKA.tealDark, color: '#FFFFFF' }}
                >
                  Open the full {openJourney.meta.title} journey
                </button>
              </div>
            )}
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default GapMatrix;
