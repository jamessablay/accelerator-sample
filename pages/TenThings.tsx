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
// LAYOUT ARITHMETIC, because it is tight and someone will change it. With the
// sidebar expanded a tile is about 171x259 at 1280, 203x252 at 1440, 222x267 at
// 1536 and 272x242 at 1920. That is why TenThing carries a short `cardHeadline`
// alongside the full `headline`.
//
// THOSE SIZES ARE A RANGE, NOT A CONSTANT, and that is the whole reason the type
// steps. Note the range is no longer monotonic: a tile gets SHORTER as the
// viewport grows, because it is sized by its content and a wider tile needs
// fewer headline lines. Re-measure after any change here.
//
// The height is now the content's, not a tuned number. Six of them are gone
// (`h-full`, two `max-h` caps, three `min-h` floors); see the grid note below
// for why, and do not add one back.
//
// The frame is `overflow-y-auto`, NOT `overflow-hidden`. A fixed frame is a
// design intent, not a licence to clip: the last pass found `overflow-hidden`
// destroying 102px of content at 200% zoom, a WCAG 1.4.4 failure. This degrades
// to a scrollbar instead of deleting things.
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
      <header className="flex-shrink-0 pb-3 md:mr-[92px]">
        <p
          className="text-micro font-bold uppercase font-mono"
          style={{ letterSpacing: TRACKING.eyebrow, color: LYKA.accentInk }}
        >
          Where will growth come from
        </p>
        <h1
          className="mt-1 text-2xl leading-tight font-display md:text-display"
          style={{ color: 'var(--lyka-teal-deep)' }}
        >
          Ten things the data says
        </h1>
        <p className="mt-1.5 max-w-4xl text-body md:text-lead" style={{ color: LYKA.muted }}>
          Ten answers, measured against dog owners wherever that is possible. Open any one for the
          chart behind it, the implication and the test, then step straight through to the next.
        </p>
        {/* The legend decodes the tile rail, which is the one thing on the grid
            encoded in colour alone. The About button sits with it rather than
            beside the h1 so the whole basis story is one cluster. */}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
          <BasisKey basis="dogOwner" />
          <BasisKey basis="noDenominator" />
          <button
            ref={aboutRef}
            type="button"
            onClick={() => setAboutOpen(true)}
            aria-haspopup="dialog"
            className="rounded-full border px-3 py-1 text-micro font-bold uppercase font-mono transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A7D68]"
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

      {/* THE GRID IS CONTENT SIZED AND CENTRED, and that is the fix for empty
          looking tiles.

          Whitespace INSIDE a card reads as a mistake; the same whitespace
          around a centred grid reads as margin. So the grid never grows past
          what its tiles need and the surplus becomes page margin instead.

          This replaced a hand tuned ceiling. It used to be `h-full` between a
          `min-h` floor and a `max-h` cap, six numbers across three breakpoints,
          and the cap was set well above the content: at 1920 it pinned a tile at
          272x355 holding 266px, so 89px of every card was a hole, split by
          `items-center` into two 45px gaps either side of the headline. Growing
          the type cannot fix that, because a wider tile needs FEWER lines, so
          the taller it gets the emptier it reads.

          HOW IT SIZES, because it looks like it should collapse. `grid-rows-N`
          is `repeat(N, minmax(0, 1fr))`, and with `h-full` gone this grid's
          height is indefinite, so per CSS Grid 12.7.1 each `fr` track resolves
          from the MAX CONTENT CONTRIBUTION of the items crossing it, taking the
          maximum across all flexible tracks. Columns are sized first and are
          definite (`w-full` plus `max-w`), so the headline's wrapped height is
          known by the time rows are sized.

          Both rows therefore land on the tallest card in the WHOLE grid, not on
          their own row's tallest, which is what keeps the 5 x 2 block a
          rectangle: point 01 needs five headline lines and point 08 four, so
          independently sized rows would leave row 2 sitting 24px short.

          IT ALSO CANNOT CLIP, which the old floors existed to prevent and three
          times failed to (1280x720 by 11px, 1440x700 by 13px, and a `roomy:`
          type step raised without its floor). A content sized row grows to what
          it needs and this frame, already `overflow-y-auto`, scrolls when the
          viewport is shorter. Do not reintroduce a `max-h` here.

          `m-auto` on a flex child, NOT `items-center`: margin auto centres
          without the overflow clipping that align-items causes in a scroll
          container, and this container scrolls by design (see the frame note
          above). */}
      <div className="flex min-h-0 flex-1 overflow-y-auto custom-scrollbar">
        <div className="m-auto grid w-full max-w-[1180px] grid-cols-2 grid-rows-5 gap-2.5 sm:grid-cols-3 sm:grid-rows-4 lg:grid-cols-5 lg:grid-rows-2 2xl:max-w-[1400px]">
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
        className="mt-3 flex flex-shrink-0 items-start gap-2.5 rounded-xl border-l-[3px] px-4 py-2.5"
        style={{ backgroundColor: LYKA.cream, borderColor: TEN_THINGS.warnFill }}
      >
        <span
          className="mt-px flex-shrink-0 text-micro font-bold uppercase font-mono"
          style={{ letterSpacing: TRACKING.eyebrow, color: '#8C3D24' }}
        >
          Sources
        </span>
        <span className="text-meta leading-relaxed" style={{ color: LYKA.ink }}>
          {TEN_THINGS_SOURCES}
          {/* ON THE PAGE, NOT IN A COMMENT. Two charts estimate dog owners below
              region level, inside a deck whose whole argument is that it uses
              the honest denominator, so the disclosure has to be visible.

              THE SHORT FORM, because the full one cost 82px of strip and pushed
              the grid's scroll at 1280x720 from 45px to 160px. The full text is
              in the About dialog, with the rest of the methodology. */}
          <span className="mt-0.5 block italic" style={{ color: LYKA.muted }}>
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
        maxWidth="max-w-3xl"
        eyebrow="What this version is"
        title="About this basis"
      >
        <div className="space-y-6">
          {TEN_THINGS_ABOUT.map((section) => (
            <section key={section.heading}>
              <h3 className="text-title font-display" style={{ color: LYKA.tealDeepest }}>
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
            <h3 className="text-title font-display" style={{ color: LYKA.tealDeepest }}>
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
