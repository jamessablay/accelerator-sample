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
      className="group relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl border bg-white p-2.5 text-left transition-transform duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A7D68]"
      style={{ borderColor: LYKA.mint, boxShadow: '0 1px 2px rgba(0,86,72,0.05)' }}
    >
      {/* The accent rail. Opacity, not a colour swap, so nothing shifts on hover. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[3px] rounded-l-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus:opacity-100"
        style={{ backgroundColor: TEN_THINGS.seriesInk }}
      />

      <span className="mb-1.5 flex flex-shrink-0 items-center gap-2">
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
      {/* `roomy:` (1400px) is the step up, NOT `xl:`. With the sidebar out, a
          1280 viewport is the tightest layout this tile ever sees, about 10px of
          slack on the worst card, and Tailwind's `xl:` fires at exactly 1280.
          Using it would have enlarged the type precisely where there is no room.
          See the screens note in index.html. */}
      {/* NOT `overflow-hidden`, and that is a fix rather than an omission.

          A line box is SHORTER THAN ITS OWN FONT METRICS here: `figure` sets
          `line-height: 1`, and DM Sans wants about 1.29em (ascent 24px plus
          descent 7px at 24px). So the first line's inline box starts about 4px
          above this block and the last line's ends about 3px below it, whatever
          the line count. That overflow was invisible while the box had 89px of
          slack to absorb it. Once the grid became content sized the box fits its
          line boxes exactly, `overflow-hidden` started clipping the metrics, and
          measured against real ink the descender on the last line lost 2px.

          The 3 to 4px lands in the 6px of empty margin above and below (the
          badge row's `mb-1.5` and this block's `mt-1.5`), so nothing collides,
          and the amount is a font constant rather than a function of the copy.
          The CARD still clips, which is what `rounded-xl` and the absolute
          accent rail need; this element does not have to.

          Measure ink, not boxes, if this is ever revisited: a Range rect is the
          font metric box and reports overflow that may not be inked, and
          `TextMetrics.actualBoundingBoxDescent` is what settled it. */}
      <span
        className="flex min-h-0 flex-1 items-center text-body font-semibold leading-snug lg:text-lead roomy:text-title 2xl:text-figure"
        style={{ color: LYKA.tealDeepest }}
      >
        {point.cardHeadline}
      </span>

      <span
        className="mt-1.5 block flex-shrink-0 border-t pt-1.5"
        style={{ borderColor: LYKA.mint }}
      >
        {/* ONE LINE. A stat value that wraps makes this block taller and lifts
            its hairline out of line with the rest of the row, which the label's
            min height cannot compensate for. The tile is about 147px of content
            width at 1280, so roughly 15 characters at this size. Shorten the
            value rather than letting it wrap. */}
        {/* `2xl:` HERE, but `roomy:` on the headline above, and the difference
            is measured rather than arbitrary. The headline can wrap, so it grows
            as soon as there is width to absorb it. This cannot wrap, so it can
            only grow once the tile is at its WIDEST, which is what
            `2xl:max-w-[1400px]` on the grid steps: 228px at `roomy:` to 272px
            from 1536 up. (That used to read "which the grid cap pins at 228px";
            the height cap is gone, the width cap does the same job here.)

            Stepping it at `roomy:` was tried and broke a row: "Aggregate only"
            is the one non numeric value here and at 24px in the 203px tile of a
            1440 screen it took a second line, pushing this tile's stat block
            82px to 106px and its hairline 24px out of line with its
            neighbours. */}
        <span
          className="block text-title font-bold leading-tight font-display tabular-nums 2xl:text-figure"
          style={{ color: TEN_THINGS.seriesInk }}
        >
          {point.statValue}
        </span>
        {/* A MIN HEIGHT OF THE TALLEST LABEL, and it is what keeps the hairlines
            level. The headline taking the slack is only half the job: the block
            BELOW the rule also varies, because these labels wrap, and a taller
            label pushes its rule up. Floor them all at the tallest and every
            rule in a row lands at the same y. The source page did the same thing
            with min-height on its own stat label.

            `4.05em` is three lines at `leading-snug` (3 x 1.35), `2.7em` is two.
            The floor STEPS WITH THE TILE WIDTH, because the tallest label is a
            function of the column: the longest is point 04's 52 characters, and
            at `micro` 11px DM Mono with 0.08em tracking a column fits about 20
            characters at 1280, 27 at `roomy:` and 33 from 1536 up. So it wraps
            to three lines below 1536 and two at or above it.

            `2xl:` ONLY. At `roomy:` the width cap is still 1180, so a tile is
            228px and 52 characters do not fit two lines; stepping it there
            un-levels a row. If a label ever needs four lines at 1280, or three
            at 1920, shorten the label rather than raising either value. */}
        <span
          className="mt-1 block min-h-[4.05em] text-micro uppercase font-mono leading-snug 2xl:min-h-[2.7em]"
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
