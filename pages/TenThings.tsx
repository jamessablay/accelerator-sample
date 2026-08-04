import React, { useCallback, useMemo, useRef, useState } from 'react';
import { LYKA, TEN_THINGS } from '../data/brand';
import { TRACKING } from '../data/type';
import { TEN_THINGS_POINTS, TEN_THINGS_SOURCES } from '../data/tenThingsData';
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
// sidebar expanded the grid gets about 1056px at 1440 and about 896px at 1280,
// so a tile is roughly 200 x 320 and 170 x 290. That is why TenThing carries a
// short `cardHeadline` alongside the full `headline`.
//
// The frame is `overflow-y-auto`, NOT `overflow-hidden`. A fixed frame is a
// design intent, not a licence to clip: the last pass found `overflow-hidden`
// destroying 102px of content at 200% zoom, a WCAG 1.4.4 failure. This degrades
// to a scrollbar instead of deleting things.
//
// ONE MODAL, ONE CHART. Rendering a chart on each tile would construct ten
// Chart.js instances and ten ResizeObservers on page load.
// -----------------------------------------------------------------------------

const TenThings: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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
          Ten answers. Open any one for the chart behind it, the implication and the test, then
          step straight through to the next.
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid h-full min-h-[520px] grid-cols-2 grid-rows-5 gap-2.5 sm:grid-cols-3 sm:grid-rows-4 lg:grid-cols-5 lg:grid-rows-2">
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
        </span>
      </div>

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
