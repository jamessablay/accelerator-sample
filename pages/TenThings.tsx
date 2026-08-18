import React, { useCallback, useMemo, useRef, useState } from 'react';
import { LYKA, TEN_THINGS, BASIS_COLORS } from '../data/brand';
import { TRACKING } from '../data/type';
import {
  BASIS_LABELS,
  TEN_THINGS_ABOUT,
  TEN_THINGS_ESTIMATE_NOTE,
  TEN_THINGS_POINTS,
  TEN_THINGS_SOURCES,
} from '../data/tenThingsData';
import type { TenThingBasis } from '../data/tenThingsData';
import TenThingsCard from '../components/tenthings/TenThingsCard';
import TenThingsDetail from '../components/tenthings/TenThingsDetail';
import Modal from '../components/shared/Modal';

// -----------------------------------------------------------------------------
// Ten Things The Data Says.
//
// A ONE VIEWPORT FRAME, like Personas and Consumer Journey, not a scrolling page
// like APEX. Ten findings on one screen is the point of a "ten things" page in a
// room: you can see the whole argument before you open any of it.
//
// LAYOUT ARITHMETIC, MEASURED IN CHROME ON 2026-08-17, not derived. Every figure
// below came out of a real headless render at that viewport, because the numbers
// this comment used to carry had been calibrated against a rendering that no
// longer existed and were wrong by a factor of nearly two.
//
//   viewport     tile        min-content   frame    result
//   1280x720     170x315        641          407     scrolls 234
//   1280x800     170x315        641          487     scrolls 154
//   1366x768     187x315        641          455     scrolls 186
//   1440x900     202x297        606          567     scrolls 39
//   1536x864     221x268        549          549     FILLS
//   1920x1080    298x376        765          765     FILLS
//
// ⚠ 1440x900 SCROLLS BY 39px AND THAT IS THE PRICE OF THE TYPE INCREASE, taken
// knowingly on 2026-08-17. The tile headline went 16 to 18 and the stat label 13
// to 14, which is what was asked for; it fitted at 1440 before and does not now.
// The remaining lever is copy, and it is precise: the label floor is three lines
// at 1440 because of exactly TWO tiles, 04 and 07, whose labels run 53 and 51
// characters. Shorten those two to about 45 and the floor drops to two lines
// there, worth 36px, which closes it. Everything else is already at the 16px
// prose floor and 14px of padding.
//
// TILE HEIGHT IS NOW THE FRAME'S WHERE THERE IS ROOM, so read the `min-content`
// column as the height the tiles WOULD take on their own and the difference from
// `frame` as the surplus the tracks absorb. At 1920 that surplus is 274px and
// the tile goes 235 to 372, which is a 58% increase and all of it lands in the
// headline block as space above and below the centred text. That is the accepted
// cost of the fill: see the grid note below.
//
// ⚠ 1536x864 HAS 14px OF HEADROOM, WHICH IS THE TIGHTEST IN THE TABLE AND IS
// NOT AN ACCIDENT OF THE VIEWPORT LIST. It is tight because the h1 steps to 48
// at 1400 while the tile is still only 218 wide there, so that row pays for the
// heading with the least column width to absorb it. Anything that adds height to
// the header or the tile lands here first, and it is the row that flips from
// filling to scrolling. Re-measure THIS ROW after any change.
//
// ⚠ IT DOES NOT FIT ON A 768px TALL SCREEN AND CANNOT BE MADE TO WITHOUT CUTTING
// COPY. The chrome is not the problem: at 1366x768 the header is 172 and the
// sources strip 70, so the grid already has 451 of 768 and needs 560. Closing
// 109px means 55px off each tile row, and the tile is down to 14px of padding,
// the 16px prose floor and a three line stat label. The remaining levers are
// content: shorten the four longest `statLabel` strings so the floor can drop to
// two lines (about 34px), or shorten the longest `cardHeadline` by a line
// (about 44px). Both are copy decisions, so they are flagged rather than taken.
//
// THE RANGE IS NOT MONOTONIC, and that is the whole reason the type steps: a
// tile gets SHORTER as the viewport grows, because it is sized by its content
// and a wider tile needs fewer headline lines. Re-measure after any change here.
//
// The height is the content's, not a tuned number. Six numbers are gone
// (`h-full`, two `max-h` caps, three `min-h` floors); see the grid note below
// for why, and do not add one back.
//
// The frame is `overflow-y-auto`, NOT `overflow-hidden`. A fixed frame is a
// design intent, not a licence to clip: an earlier pass found `overflow-hidden`
// destroying 102px of content at 200% zoom, a WCAG 1.4.4 failure. This degrades
// to a scrollbar instead of deleting things, which is also what makes the two
// short viewports above a degradation rather than a defect.
//
// ONE MODAL, ONE CHART. Rendering a chart on each tile would construct ten
// Chart.js instances and ten ResizeObservers on page load.
//
// THE DOG OWNER BASIS (2026-08-10). Five of the ten points divide by a
// population and were redrawn against Roy Morgan's dog owner counts; the other
// five are rates, counts or a time series. Each tile's left rail carries which,
// the legend below the lede decodes the two colours, and the two page level
// sections the source added open from the "About this basis" button rather than
// sitting on the grid: seeing all ten at once is the point of this page and
// there is no room for four paragraphs above it.
// -----------------------------------------------------------------------------

/** One swatch and its label. The tile rail's decode, since colour is not a label. */
const BasisKey: React.FC<{ basis: TenThingBasis }> = ({ basis }) => (
  <span className="flex items-center gap-1.5">
    <span
      aria-hidden="true"
      className="h-3 w-[3px] flex-shrink-0 rounded-sm"
      style={{ backgroundColor: BASIS_COLORS[basis].mark }}
    />
    <span
      className="text-micro font-bold uppercase font-mono"
      style={{ letterSpacing: TRACKING.eyebrow, color: LYKA.muted }}
    >
      {BASIS_LABELS[basis].pill}
    </span>
  </span>
);

const TenThings: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const aboutRef = useRef<HTMLButtonElement | null>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = openIndex === null ? null : TEN_THINGS_POINTS[openIndex];

  // FOCUS RETURNS TO THE TILE, and the page owns that rather than the Modal.
  //
  // Modal restores focus to whatever `document.activeElement` was when it
  // opened, which is right for a pointer click (the browser focuses a button on
  // mousedown) and wrong for anything that opens the dialog without focusing
  // first. The page knows exactly which tile was opened, so it can be certain
  // where focus belongs. The rAF puts this after Modal's own restore, which runs
  // during effect cleanup, so this one wins.
  const close = useCallback(() => {
    setOpenIndex((i) => {
      if (i !== null) requestAnimationFrame(() => cardRefs.current[i]?.focus());
      return null;
    });
  }, []);
  const goPrev = useCallback(
    () => setOpenIndex((i) => (i === null || i <= 0 ? i : i - 1)),
    [],
  );
  const goNext = useCallback(
    () => setOpenIndex((i) => (i === null || i >= TEN_THINGS_POINTS.length - 1 ? i : i + 1)),
    [],
  );

  const position = useMemo(
    () => (openIndex === null ? undefined : `${TEN_THINGS_POINTS[openIndex]?.id} / 10`),
    [openIndex],
  );

  const closeAbout = useCallback(() => {
    setAboutOpen(false);
    requestAnimationFrame(() => aboutRef.current?.focus());
  }, []);

  return (
    <div className="animate-fadeIn flex h-full flex-col">
      <header className="flex-shrink-0 pb-4 md:mr-[92px]">
        <p
          className="text-micro font-bold uppercase font-mono"
          style={{ letterSpacing: TRACKING.eyebrow, color: LYKA.accentInk }}
        >
          Where will growth come from
        </p>
        {/* THE SAME CLASS STRING AS THE PERSONAS h1 IN ITS DEFAULT VIEW, on
            purpose and character for character. 22 / 30 / 48.

            These two headings are meant to match, and they have drifted twice
            already, because matching was expressed as two independent size
            declarations that someone then had to keep in agreement. Expressed as
            one shared string it cannot drift: if either page's step points move,
            copy the string, do not re-derive it.

            The 48 costs 15.3px of header height at `roomy:` and up, measured,
            and header height comes straight out of the tile grid below. It is
            paid for out of the sources strip rather than out of the heading. See
            the fit table at the top of this file. */}
        <h1
          className="mt-1 text-title leading-tight md:text-figure roomy:text-display"
          style={{ color: 'var(--brand-ink-deepest)' }}
        >
          Ten things the data says
        </h1>
        {/* THE RHYTHM DOES NOT STEP WITH THE HEADING, and that is what pays for
            the heading. A `roomy:` set of larger gaps was tried and measured at
            +20px of header, which at 1536x864 was the difference between the
            grid fitting and scrolling by 10px. A 48px heading is already doing
            the work that extra space around it would do, so the gaps stay flat
            and the size step keeps its room.

            The lede is `body` on a tighter measure. It was `md:text-lead`,
            which wrapped it to two 28.8px lines, and it is a standfirst rather
            than the argument. */}
        <p className="mt-2 max-w-3xl text-body" style={{ color: LYKA.muted }}>
          Ten answers, measured against dog owners wherever that is possible. Open any one for the
          chart behind it, the implication and the test, then step straight through to the next.
        </p>
        {/* The legend decodes the tile rail, which is the one thing on the grid
            encoded in colour alone. The About button sits with it rather than
            beside the h1 so the whole basis story is one cluster.

            A HAIRLINE SEPARATES THE LEGEND FROM THE CONTROL, rather than a
            container around either. The row holds two different kinds of thing,
            a decode and a button, and at a uniform `gap-x-4` they read as one
            list of three. Boxing the two keys would have paired them correctly
            and made a static bordered pill sitting beside a real one, which
            reads as a disabled button. A rule costs nothing and says the same.

            The button's padding grew with the type scale so it and the eyebrows
            share a baseline. `sm:` on the divider because it is the first thing
            that should go when the row wraps. */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <BasisKey basis="dogOwner" />
          <BasisKey basis="noDenominator" />
          <span
            aria-hidden="true"
            className="hidden h-4 w-px flex-shrink-0 sm:block"
            style={{ backgroundColor: LYKA.mint }}
          />
          <button
            ref={aboutRef}
            type="button"
            onClick={() => setAboutOpen(true)}
            aria-haspopup="dialog"
            className="rounded-full border px-3.5 py-1.5 text-micro font-bold uppercase font-mono transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              letterSpacing: TRACKING.eyebrow,
              borderColor: LYKA.mint,
              color: LYKA.accentInk,
            }}
          >
            About this basis
          </button>
        </div>
      </header>

      {/* THE GRID FILLS ITS FRAME, AND IS ALLOWED TO GROW PAST IT.

          ⚠ THIS REVERSES THE 2026-08-04 DECISION, ON REQUEST. That pass made the
          grid content sized and centred on the argument that whitespace INSIDE a
          card reads as a mistake while the same whitespace around a centred grid
          reads as margin. The trade is now taken the other way: fill the tile
          and accept the interior space. Read the note below before undoing
          either direction, because both are defensible and each fixes what the
          other causes.

          `min-h-full`, NOT `h-full`, AND THE DIFFERENCE IS THE WHOLE SAFETY
          MARGIN. `h-full` is what the 2026-08-04 pass removed, and it is what
          allowed the three documented clips: a fixed height forces the tracks
          to fit whether the content does or not. `min-h-full` sets a FLOOR. When
          the frame is taller than the content the `fr` tracks take the surplus
          and the tiles grow, which is the ask; when the content is taller than
          the frame the grid grows past the floor and the frame, already
          `overflow-y-auto`, scrolls. It can fill without being able to clip.

          `m-auto` IS GONE, and it was the only thing holding the old behaviour.
          As a flex child the grid stretches by default, so the auto margins were
          what kept it at content height and centred the surplus as page margin.
          With the width caps already removed there was no horizontal free space
          left for them to centre either, so they did nothing else.

          ⚠ THE ROWS SPELL OUT `minmax(min-content,1fr)` AND BOTH HALVES OF
          THAT ARE LOAD BEARING. Tailwind's `grid-rows-N` is
          `repeat(N, minmax(0, 1fr))`, and a ZERO minimum against a definite
          grid height lets a track shrink below its content. Measured with the
          stock utility at 1280x720: the tracks split the frame evenly at 193px
          each, the headline box collapsed from the 130px its text needs to
          31px, ALL TEN headlines overflowed, 2.4px of ink escaped the tile and
          `overflow-hidden` swallowed the rest. The fit report was a false pass.

          `1fr` on its own does not fix it either, which is the part worth
          knowing. `1fr` means `minmax(auto, 1fr)`, and an `auto` minimum is the
          item's AUTOMATIC MINIMUM SIZE, which CSS Sizing defines as zero for an
          item whose overflow is not `visible`. The tile is `overflow-hidden`,
          for its corner radius and its absolute rail, so it opts itself out of
          the protection. The floor has to be named explicitly.

          With it named: under the floor the grid box is definite and the tracks
          split it evenly, so the tiles grow to fill; above it each track
          resolves from the MAX CONTENT CONTRIBUTION of the items crossing it,
          taking the maximum across all flexible tracks, so the grid grows and
          the frame scrolls. Columns are sized first and are definite (`w-full`),
          so the headline's wrapped height is known by the time rows are sized.
          Both regimes give both rows the same height, which is what keeps the
          5 x 2 block a rectangle.

          Both rows therefore land on the tallest card in the WHOLE grid, not on
          their own row's tallest, which is what keeps the 5 x 2 block a
          rectangle: point 01 needs five headline lines and point 08 four, so
          independently sized rows would leave row 2 sitting 24px short.

          IT ALSO CANNOT CLIP, which the old floors existed to prevent and three
          times failed to (1280x720 by 11px, 1440x700 by 13px, and a `roomy:`
          type step raised without its floor). A content sized row grows to what
          it needs and this frame, already `overflow-y-auto`, scrolls when the
          viewport is shorter. Do not reintroduce a `max-h` here.

          ⚠ `self-start` IS NOT COSMETIC, IT IS WHAT MAKES THE LAST ROW
          REACHABLE. Without it the grid is a stretched flex item, so its box is
          pinned to the frame's height and the taller row tracks simply overflow
          it. That overflow is not fully added to the frame's scrollable area:
          measured at 1366x768, the frame offered 87px of scroll against 109px
          of content, leaving the bottom 22px of the last row unreachable at any
          scroll position. `self-start` lets the grid size to its content above
          the floor, so what scrolls matches what is there.

          THE FRAME STILL SCROLLS RATHER THAN CLIPS, which is the property the
          old `m-auto` was protecting and which `min-h-full` preserves for the
          same reason: nothing here ever sets a maximum. */}
      {/* FLUID SINCE 2026-08-17. The two width caps, `max-w-[1180px]` and
          `2xl:max-w-[1400px]`, are gone, so the grid takes the full content
          column at every width.

          Why they existed, and why that reasoning expired. The caps were added
          when the tiles read as mostly empty: a wider tile needs FEWER headline
          lines, so at the old type scale growing the viewport made every card
          emptier, and centring a capped grid at least made the leftover read as
          margin rather than as a hole. The type scale is substantially larger
          now and the interior padding is generous, so content fills the tile it
          is given and the cap was holding the grid narrower than the page for no
          remaining reason.

          The caps only ever BOUND above roughly a 1564px viewport (content width
          is viewport minus the 320px sidebar minus 64px of page padding), so
          this changes nothing at 1280 or 1440 and widens a tile from about 272
          to about 294 at 1920.

          `w-full` still makes the columns definite, which is the precondition
          the row sizing note above depends on: columns are sized first, so the
          wrapped headline height is known by the time the `fr` rows resolve. */}
      <div className="flex min-h-0 flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid min-h-full w-full self-start grid-cols-2 grid-rows-[repeat(5,minmax(min-content,1fr))] gap-3 sm:grid-cols-3 sm:grid-rows-[repeat(4,minmax(min-content,1fr))] lg:grid-cols-5 lg:grid-rows-[repeat(2,minmax(min-content,1fr))]">
          {TEN_THINGS_POINTS.map((point, i) => (
            <TenThingsCard
              key={point.id}
              point={point}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              onOpen={() => setOpenIndex(i)}
            />
          ))}
        </div>
      </div>

      <div
        // COMPACT ON PURPOSE. This strip measured 89.4px, which is 12% of a
        // 720px viewport spent on a footnote while the grid above it could not
        // fit. It keeps both disclosures, at `meta` on tight leading.
        className="mt-3 flex flex-shrink-0 items-start gap-2.5 rounded-card border-l-[3px] px-3.5 py-1.5"
        style={{ backgroundColor: LYKA.cream, borderColor: TEN_THINGS.warnFill }}
      >
        <span
          className="mt-px flex-shrink-0 text-micro font-bold uppercase font-mono"
          style={{ letterSpacing: TRACKING.eyebrow, color: '#8C3D24' }}
        >
          Sources
        </span>
        <span className="text-meta leading-snug" style={{ color: LYKA.ink }}>
          {TEN_THINGS_SOURCES}
          {/* ON THE PAGE, NOT IN A COMMENT. Two charts estimate dog owners below
              region level, inside a deck whose whole argument is that it uses
              the honest denominator, so the disclosure has to be visible.

              THE SHORT FORM, because the full one cost 82px of strip and pushed
              the grid's scroll at 1280x720 from 45px to 160px. The full text is
              in the About dialog, with the rest of the methodology. */}
          {' '}
          <span className="italic" style={{ color: LYKA.muted }}>
            {TEN_THINGS_ESTIMATE_NOTE.short}
          </span>
        </span>
      </div>

      {/* PASSES NEITHER onPrev NOR onNext, and that is load bearing. Modal gates
          its stepper on `onPrev !== undefined || onNext !== undefined`, so
          passing `null` (which the point dialog below does, to render the
          chevrons disabled at the ends) would put a dead stepper on this one. */}
      <Modal
        isOpen={aboutOpen}
        onClose={closeAbout}
        // The SAME width as the point dialog below. This page opens two modals
        // and they were 3xl and 5xl, so the card visibly resized depending on
        // which one you had opened. The prose inside is capped at 74ch of its
        // own accord, so the extra width lands as margin rather than as a long
        // measure.
        maxWidth="max-w-5xl"
        eyebrow="What this version is"
        title="About this basis"
      >
        <div className="space-y-6">
          {TEN_THINGS_ABOUT.map((section) => (
            <section key={section.heading}>
              <h3 className="text-title" style={{ color: LYKA.tealDeepest }}>
                {section.heading}
              </h3>
              {section.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="mt-2 max-w-[74ch] text-body leading-relaxed"
                  style={{ color: LYKA.muted }}
                >
                  {p}
                </p>
              ))}
            </section>
          ))}
          <section className="border-t pt-4" style={{ borderColor: LYKA.mint }}>
            <h3 className="text-title" style={{ color: LYKA.tealDeepest }}>
              A note on the two postcode grain charts
            </h3>
            <p
              className="mt-2 max-w-[74ch] text-body leading-relaxed"
              style={{ color: LYKA.muted }}
            >
              {TEN_THINGS_ESTIMATE_NOTE.full}
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <BasisKey basis="dogOwner" />
              <BasisKey basis="noDenominator" />
            </div>
          </section>
        </div>
      </Modal>

      <Modal
        isOpen={active !== null}
        onClose={close}
        maxWidth="max-w-5xl"
        eyebrow={active ? `${active.category} | point ${Number(active.id)} of 10` : undefined}
        title={active?.headline}
        position={position}
        onPrev={openIndex !== null && openIndex > 0 ? goPrev : null}
        onNext={
          openIndex !== null && openIndex < TEN_THINGS_POINTS.length - 1 ? goNext : null
        }
      >
        {active ? <TenThingsDetail key={active.id} point={active} /> : null}
      </Modal>
    </div>
  );
};

export default TenThings;
