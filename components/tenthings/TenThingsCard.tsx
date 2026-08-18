import React from 'react';
import { LYKA, TEN_THINGS, BASIS_COLORS } from '../../data/brand';
import { TRACKING } from '../../data/type';
import type { TenThing } from '../../data/tenThingsData';

// -----------------------------------------------------------------------------
// One tile in the 5 x 2 grid.
//
// ⚠ REBUILT 2026-08-17 TO FIT. Ten findings on one screen is the point of this
// page, and it had stopped being true: measured in Chrome across six viewports,
// the grid overflowed its frame by 161px at 1920x1080 and by 650px at 1536x864,
// and the ten hairlines that are supposed to sit within 1px of each other were
// 37 to 54px apart. Everything below is a consequence of those measurements. The
// numbers quoted are real, not derived.
//
// TWO ZONES, EACH OWNING ITS OWN PADDING. The card is `p-0`: the body pads
// itself and the footer pads itself. That is what lets the footer carry a fill
// to the tile edges without the negative margin trick, and what lets the two
// zones step their padding at different breakpoints without the bleed and the
// padding drifting out of agreement.
//
// THE HEADLINE IS THE FLEX CHILD. It takes the slack so the hairline and the
// stat below it land at the same height across a row, which is what makes ten
// tiles read as one grid rather than ten boxes.
//
// It uses `cardHeadline`, not `headline`. The full argument does not fit a
// column of this width. The answer to "it does not fit" is to shorten the copy,
// never to drop below the prose floor in theme/house.ts.
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
      // The border is the hover affordance rather than the shadow doing all the
      // work: this deck uses hairlines where other systems use elevation, so
      // brightening the hairline to the accent is the move that belongs to it.
      // Both are on `transition-colors`/`transform`, never on `all`, so the rail
      // width animating alongside cannot drag layout properties with it.
      className="group relative flex h-full min-h-0 flex-col overflow-hidden rounded-card border bg-white p-0 text-left shadow-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-brand-accent-text hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{ borderColor: LYKA.mint }}
    >
      {/* THE RAIL CARRIES THE BASIS, AND IT COSTS NOTHING IN HEIGHT.

          Coloured by which denominator the point divides by, which is exactly
          what the source page encodes on its own left border. That placement was
          chosen over a pill in the badge row for one measured reason: the grid
          has no `max-h` and no `min-h`, so rows size from max content
          contribution and ANY new element grows all ten tiles.

          Colour alone is not a label, so the decode lives in two places that do
          have room: the legend beside the page h1, and the pill in the modal.

          HOVER WIDENS IT RATHER THAN FADING IT IN, since it is always visible.
          Width, not colour, so the basis reading never changes under the
          pointer, and the rail is absolutely positioned so nothing reflows. It
          spans both zones, which is why it is on the card and not on the body. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 z-10 w-1 transition-[width] duration-300 group-hover:w-1.5 group-focus-visible:w-1.5"
        style={{ backgroundColor: BASIS_COLORS[point.basis].mark }}
      />

      {/* ZONE 1: the finding, on white. */}
      <span className="flex min-h-0 flex-1 flex-col px-tight pb-3 pt-tight">
        <span className="mb-2 flex flex-shrink-0 items-center gap-2.5">
          <span
            className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-control text-micro font-bold tabular-nums"
            style={{ backgroundColor: LYKA.tealDeepest, color: LYKA.pageBg }}
          >
            {point.id}
          </span>
          <span
            className="min-w-0 truncate text-micro font-bold uppercase font-mono"
            style={{ letterSpacing: TRACKING.eyebrow, color: LYKA.muted }}
          >
            {point.category}
          </span>
          {/* THE OPEN AFFORDANCE. The tile is a button that opens a dialog and
              nothing said so: the only cue was the cursor, which is invisible in
              a screenshot and absent entirely to a keyboard user until focus
              lands.

              `aria-hidden` because `aria-haspopup="dialog"` on the button already
              announces the behaviour; a second announcement would be noise.
              `ml-auto` rather than absolute positioning so it can never overlap a
              long category label, it just pushes against it. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-auto h-4 w-4 flex-shrink-0 -translate-x-1 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
            style={{ color: LYKA.accentInk }}
          >
            <path d="M5 12h13M12 5l7 7-7 7" />
          </svg>
        </span>

        {/* Takes the slack, so the rule below lands level across the row.

            CENTRED IN THAT SLACK, not pinned to the top. Pinned top, the
            leftover reads as a hole; centred, the same space reads as generous.
            Same fix and same reason as the market band heading in
            ReadinessLadder.

            ⚠ THE `2xl:text-figure` STEP IS GONE, AND IT WAS THE SINGLE WORST
            THING ON THIS PAGE. It was calibrated when a `max-w` cap pinned the
            tile at 272px from 1536 up. The cap was removed, so at 1536x864 the
            tile is 218px wide and the step put 30px type into it: the headline
            block alone measured 297px and the grid overflowed by 650px, its
            worst reading of any viewport, INCLUDING the ones with less room.
            The scale runs 16 / 18 / 22 now, and the step points are where the
            column is actually wide enough to carry them.

            `text-balance` is height neutral by definition: the algorithm
            minimises the longest line SUBJECT TO the line count normal wrapping
            would produce, so it redistributes words without adding or removing
            one. What it buys is ten headlines that stop ending in a lone
            orphaned word, which is most of what made the grid read as ragged.
            Chrome ignores it past six lines, so the failure mode is a silent
            no-op rather than a broken tile.

            NOT `overflow-hidden`, and that is a fix rather than an omission. A
            tight line height can make a line box SHORTER than the font's own
            metrics, so the first line's inline box starts above this block and
            the last line's ends below it whatever the line count. Measure ink,
            not boxes, if this is revisited: a Range rect is the font metric box
            and reports overflow that may not be inked. */}
        <span
          className="flex min-h-0 flex-1 items-center text-balance text-lead font-semibold leading-snug"
          style={{ color: LYKA.tealDeepest }}
        >
          {point.cardHeadline}
        </span>
      </span>

      {/* ZONE 2: the evidence, on the secondary surface.

          A FILL, NOT JUST A HAIRLINE, because at the top of the scale the
          headline and the stat value are one step apart and an ink change alone
          was not separating them. The finding reads on white and the proof reads
          on ivory, so the two stop competing without either having to shrink.
          Contrast on the new ground was checked rather than assumed:
          `seriesInk` 4.70:1 and `muted` 5.05:1, both AA. */}
      <span
        className="block flex-shrink-0 border-t px-tight py-3"
        style={{ borderColor: LYKA.mint, backgroundColor: LYKA.ivory }}
      >
        {/* ONE LINE. A stat value that wraps makes this block taller and lifts
            its hairline out of line with the rest of the row, which the label's
            min height cannot compensate for. Shorten the value rather than
            letting it wrap.

            IT STEPS NOW, and that is what makes the rule enforceable rather than
            aspirational. At a flat `figure` 30 the longest value, "Aggregate
            only" at 14 characters, needed about 224px inside a 122px column at
            1280 and wrapped every time. */}
        <span
          className="block text-lead font-bold leading-tight tabular-nums roomy:text-title"
          style={{ color: TEN_THINGS.seriesInk }}
        >
          {point.statValue}
        </span>
        {/* ⚠ THIS LABEL IS NO LONGER AN UPPERCASE MONO EYEBROW, AND THAT IS THE
            FIX FOR THE HAIRLINES.

            Measured: the labels were taking FIVE lines at 1280 and four at 1440
            against a floor set at four and three, so on every viewport below
            1920 several tiles blew past the floor, their footers grew, and the
            ten rules ended up 37 to 54px apart. The floor cannot be raised to
            meet that, because the number of lines depends on the column width
            and the column width depends on the viewport.

            So the cause was removed instead. Uppercase DM Mono is the widest
            text this deck can set: a monospace advance is uniform and wide, and
            uppercase has none of the narrow lowercase forms. It is the right
            face for a two word eyebrow, which is what the category above is, and
            the wrong one for "retention across inner metro dwelling quartiles:
            flat" at 53 characters. In `meta` 13 in the body face the same string
            sets in roughly half the width.

            THE FLOOR IS MEASURED, NOT DERIVED, and this is the one place a
            `2xl:` step survives on this tile. Counting the label's own line
            boxes, which ignore the floor, per tile per width:

              1280  [2,2,3,3,3,3,3,2,3,3]   1440  [2,2,2,3,2,2,3,2,2,2]
              1366  [2,2,3,3,3,2,3,2,3,3]   1536  [2,2,2,2,2,2,2,2,2,2]
                                            1920  [1,1,2,2,2,2,2,1,2,2]

            So three lines is real up to 1440 and dead weight from 1536, where
            dropping the floor to two returns 18px per tile and 36px of grid.
            Note 1440 needs the third line for exactly TWO tiles, 04 and 07,
            whose labels are 53 and 51 characters; shortening those two to about
            45 would let the step move down to `roomy:` and buy the same 36px
            there. That is a copy decision, so it is flagged rather than taken.

            ⚠ The other `2xl:` steps on this tile were removed for causing the
            1536 blow up, and this one is the opposite case: it REDUCES height at
            a width where the measurement says the content has already stopped
            needing it. Do not read it as a licence to reintroduce the others. */}
        <span
          className="mt-1 block min-h-[3.9em] text-balance text-label leading-[1.3] 2xl:min-h-[2.6em]"
          style={{ color: LYKA.muted }}
        >
          {point.statLabel}
        </span>
      </span>
    </button>
  ),
);

TenThingsCard.displayName = 'TenThingsCard';

export default TenThingsCard;
