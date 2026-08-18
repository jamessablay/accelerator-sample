import React from 'react';
import { LYKA, TEN_THINGS } from '../../data/brand';
import { TRACKING } from '../../data/type';

// -----------------------------------------------------------------------------
// The frame every Ten Things chart sits in.
//
// Generalises the one in components/mediaplan/ChannelDetail.tsx: a mint hairline
// on a cream mat with a fixed pixel height. Lyka uses borders where other brands
// use shadows.
//
// THE HEIGHT IS THE FRAME'S JOB. Every chart runs maintainAspectRatio: false, and
// a canvas in a height-less parent collapses to zero with no error.
// -----------------------------------------------------------------------------

interface TenThingsChartProps {
  /** DM Mono eyebrow. Usually the point's category. */
  eyebrow?: string;
  /**
   * The argument the chart makes, not the variable it plots. Optional: on points
   * whose finding headline already carries the argument (05, 06), the client asked
   * for this second in-card heading to be dropped, so the h3 is skipped when unset.
   */
  title?: string;
  /** Optional italic sub line, matching ChannelDetail's "Spend by month, Nov to Oct". */
  subtitle?: string;
  /**
   * Under the canvas. Source notes, and the two matplotlib arrow callouts that
   * were deliberately pulled out of the canvas so they can reflow.
   */
  caption?: React.ReactNode;
  /**
   * Set whenever an axis does not start at zero.
   *
   * Not decoration. Five of the nine source charts truncate an axis, and in an
   * interactive deck a reader hovers a tooltip and never reads the axis label.
   * Making the note a prop makes it structurally required rather than remembered.
   */
  truncatedAxis?: string;
  /**
   * Rendered when the copy and the chart disagree. Never used to reconcile them.
   * See the `discrepancy` field on TenThing.
   */
  discrepancy?: string;
  /** Canvas box height in px. */
  height?: number;
  /** Two canvases side by side. Point 01 only. */
  panels?: 1 | 2;
  children: React.ReactNode;
}

const TenThingsChart: React.FC<TenThingsChartProps> = ({
  eyebrow,
  title,
  subtitle,
  caption,
  truncatedAxis,
  discrepancy,
  height = 340,
  panels = 1,
  children,
}) => (
  <figure className="m-0">
    {eyebrow && (
      <div className="mb-2 flex items-center gap-2.5">
        <span
          className="h-px w-6 flex-shrink-0"
          style={{ backgroundColor: TEN_THINGS.seriesInk }}
          aria-hidden="true"
        />
        <span
          className="text-micro font-bold uppercase font-mono"
          style={{ letterSpacing: TRACKING.eyebrow, color: LYKA.muted }}
        >
          {eyebrow}
        </span>
      </div>
    )}

    {title && (
      <h3 className="text-title" style={{ color: LYKA.tealDeepest }}>
        {title}
      </h3>
    )}
    {subtitle && (
      <p className="text-body italic mt-0.5 mb-2" style={{ color: LYKA.muted }}>
        {subtitle}
      </p>
    )}

    <div
      className={`mt-2 rounded-card border p-3 ${
        panels === 2 ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''
      }`}
      style={{ borderColor: LYKA.mint, backgroundColor: LYKA.pageBg, height }}
    >
      {children}
    </div>

    {(caption || truncatedAxis || discrepancy) && (
      <figcaption className="mt-2 text-meta leading-relaxed" style={{ color: LYKA.muted }}>
        {caption}
        {truncatedAxis && <span className="block mt-1 italic">Axis note: {truncatedAxis}</span>}
        {discrepancy && (
          <span
            className="mt-2 block rounded-control border-l-[3px] px-3 py-2"
            style={{ backgroundColor: LYKA.cream, borderColor: LYKA.tangerine }}
          >
            <span
              className="mb-0.5 block text-micro font-bold uppercase font-mono"
              style={{ letterSpacing: TRACKING.eyebrow, color: '#8C3D24' }}
            >
              Check before presenting
            </span>
            <span style={{ color: LYKA.ink }}>{discrepancy}</span>
          </span>
        )}
      </figcaption>
    )}
  </figure>
);

export default TenThingsChart;
