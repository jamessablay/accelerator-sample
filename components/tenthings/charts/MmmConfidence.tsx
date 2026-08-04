import React from 'react';
import { LYKA, TEN_THINGS } from '../../../data/brand';
import { TRACKING } from '../../../data/type';
import { MMM_CONFIDENCE } from '../../../data/tenThingsSeries';
import TenThingsChart from '../TenThingsChart';
import type { TenThingChartProps } from './types';

// -----------------------------------------------------------------------------
// Point 08. DELIBERATELY NOT A CHART.
//
// The source draws three descending matplotlib bars. There is no numeric axis,
// the y label is the literal string "confidence in the claim", and the three
// values are words: Established, Contested, Not identified. The bar heights
// encode nothing. It is a slide graphic that matplotlib was pressed into
// drawing.
//
// On canvas it would inherit every cost of a chart (unselectable text, no
// reflow, an aria-label that has to recite the whole thing) and none of the
// benefits. Three HTML rows instead.
//
// `level` drives only the fill. Colour carries the SAME information as the
// position in the list, so it is redundant, not load bearing:
//   3 established    seriesInk  4.89:1, white label at 4.9:1
//   2 contested      warnFill   2.35:1, so the label MUST be seriesDeep (5.03:1),
//                               never white, which is 2.43:1
//   1 not identified inertFill  1.82:1, so it carries a benchmark hairline
// -----------------------------------------------------------------------------

interface Tone {
  fill: string;
  ink: string;
  border: string;
}

const TONES: Record<number, Tone> = {
  3: { fill: TEN_THINGS.seriesInk, ink: LYKA.pageBg, border: TEN_THINGS.seriesInk },
  2: { fill: TEN_THINGS.warnFill, ink: TEN_THINGS.seriesDeep, border: TEN_THINGS.warnFill },
  1: { fill: TEN_THINGS.inertFill, ink: TEN_THINGS.seriesDeep, border: TEN_THINGS.benchmark },
};

const MmmConfidence: React.FC<TenThingChartProps> = ({ discrepancy }) => (
  <TenThingsChart
    eyebrow="Channel"
    title="The model proves the total. It cannot yet split the credit."
    subtitle="What the MMM supports, claim by claim"
    height={286}
    discrepancy={discrepancy}
    caption={
      <>
        Not a chart. The source drew this as three bars whose heights encode nothing, so it is set
        as text here instead. Confidence is the model's, not ours.
      </>
    }
  >
    <ul className="flex h-full list-none flex-col justify-center gap-2.5 p-0">
      {MMM_CONFIDENCE.map((row) => {
        const tone = TONES[row.level] ?? TONES[1];
        return (
          <li
            key={row.claim}
            className="flex flex-col gap-2 rounded-lg border bg-white px-3.5 py-3 sm:flex-row sm:items-center sm:gap-4"
            style={{ borderColor: LYKA.mint }}
          >
            <div className="min-w-0 flex-1">
              <p
                className="text-body font-semibold leading-snug"
                style={{ color: LYKA.tealDeepest }}
              >
                {row.claim}
              </p>
              <p className="mt-0.5 text-meta leading-snug" style={{ color: LYKA.muted }}>
                {row.note}
              </p>
            </div>
            <span
              className="flex-shrink-0 self-start rounded-full border px-3 py-1 text-micro font-bold uppercase font-mono sm:self-center"
              style={{
                backgroundColor: tone.fill,
                color: tone.ink,
                borderColor: tone.border,
                letterSpacing: TRACKING.eyebrow,
              }}
            >
              {row.status}
            </span>
          </li>
        );
      })}
    </ul>
  </TenThingsChart>
);

export default MmmConfidence;
