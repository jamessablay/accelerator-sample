import React from 'react';
import { LYKA, TEN_THINGS } from '../../data/brand';
import { TRACKING } from '../../data/type';
import type { TenThing } from '../../data/tenThingsData';

// -----------------------------------------------------------------------------
// One tile in the 5 x 2 grid.
//
// THE HEADLINE IS THE FLEX CHILD, deliberately. It takes the slack so the
// hairline and the stat below it land at the same height across a row, which is
// what makes ten tiles read as one grid rather than ten boxes. The source page
// did the same thing and its comment said why.
//
// It uses `cardHeadline`, not `headline`. At 1440 with the sidebar expanded a
// tile is about 200px wide and at 1280 it is about 170px, so the full argument
// does not fit. The answer to "it does not fit" is to shorten the copy, never to
// drop below the 14px prose floor in data/type.ts.
//
// NO CHART RENDERS HERE. Ten live Chart.js instances plus ten ResizeObservers on
// page load is the wrong trade, and it is not what the source did either.
// -----------------------------------------------------------------------------

interface TenThingsCardProps {
  point: TenThing;
  onOpen: () => void;
}

const TenThingsCard = React.forwardRef<HTMLButtonElement, TenThingsCardProps>(
  ({ point, onOpen }, ref) => (
    <button
      ref={ref}
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="group relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl border bg-white p-3 text-left transition-transform duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A7D68]"
      style={{ borderColor: LYKA.mint, boxShadow: '0 1px 2px rgba(0,86,72,0.05)' }}
    >
      {/* The accent rail. Opacity, not a colour swap, so nothing shifts on hover. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[3px] rounded-l-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus:opacity-100"
        style={{ backgroundColor: TEN_THINGS.seriesInk }}
      />

      <span className="mb-2 flex flex-shrink-0 items-center gap-2">
        <span
          className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-md text-micro font-bold font-display"
          style={{ backgroundColor: LYKA.tealDeepest, color: LYKA.pageBg }}
        >
          {point.id}
        </span>
        <span
          className="truncate text-micro font-bold uppercase font-mono"
          style={{ letterSpacing: TRACKING.eyebrow, color: LYKA.muted }}
        >
          {point.category}
        </span>
      </span>

      {/* Takes the slack, so the rule below lands level across the row.

          CENTRED IN THAT SLACK, not pinned to the top. A tile in the 5 x 2 grid
          is about 203 x 339 at 1440, and a four line headline leaves roughly
          120px over. Pinned top, that reads as a hole; centred, the same space
          reads as generous. Same fix and same reason as the market band heading
          in ReadinessLadder. */}
      <span
        className="flex min-h-0 flex-1 items-center overflow-hidden text-body font-semibold leading-snug lg:text-lead"
        style={{ color: LYKA.tealDeepest }}
      >
        {point.cardHeadline}
      </span>

      <span
        className="mt-2 block flex-shrink-0 border-t pt-2"
        style={{ borderColor: LYKA.mint }}
      >
        {/* ONE LINE. A stat value that wraps makes this block taller and lifts
            its hairline out of line with the rest of the row, which the label's
            min height cannot compensate for. The tile is about 147px of content
            width at 1280, so roughly 15 characters at this size. Shorten the
            value rather than letting it wrap. */}
        <span
          className="block text-title font-bold leading-tight font-display tabular-nums 2xl:text-figure"
          style={{ color: TEN_THINGS.seriesInk }}
        >
          {point.statValue}
        </span>
        {/* MIN HEIGHT OF THREE LINES, and it is what keeps the hairlines level.
            The headline taking the slack is only half the job: the block BELOW
            the rule also varies, because these labels wrap to two or three
            lines, and a taller label pushes its rule up. Floor them all at the
            tallest and every rule in a row lands at the same y. The source page
            did the same thing with min-height on its own stat label. If a label
            ever needs four lines, shorten it rather than raising this. */}
        <span
          className="mt-1 block min-h-[4.05em] text-micro uppercase font-mono leading-snug"
          style={{ letterSpacing: TRACKING.eyebrow, color: LYKA.muted }}
        >
          {point.statLabel}
        </span>
      </span>
    </button>
  ),
);

TenThingsCard.displayName = 'TenThingsCard';

export default TenThingsCard;
