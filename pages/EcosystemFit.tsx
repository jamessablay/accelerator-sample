import React from 'react';
import { LYKA } from '../data/brand';
import { TRACKING } from '../data/type';
import {
  PAGE_EYEBROW,
  PAGE_TITLE,
  PAGE_INTRO_NEGATIVE,
  PAGE_INTRO_POSITIVE,
  FIT_EYEBROW,
  FIT_HEADLINE,
  PILLARS_EYEBROW,
  PILLARS_HEADLINE,
  PILLARS,
  PRINCIPLE_EYEBROW,
  PRINCIPLES,
  OUTCOME_EYEBROW,
  OUTCOME_HEADLINE,
  OUTCOMES,
} from '../data/ecosystemData';
import EcosystemDiagram from '../components/ecosystem/EcosystemDiagram';

// -----------------------------------------------------------------------------
// PLUGGING INTO THE ECOSYSTEM: the eighth page.
//
// A SCROLLING page like pages/NotionCoworkingSetup.tsx (root animate-fadeIn +
// pb-16 md:pb-24), not a one-viewport frame. It recasts the standalone
// `Plugging Into The Existing Ecosystem.html` deliverable into the app's house
// system. Copy is all in data/ecosystemData.ts (house-styled once there).
//
// Structure, mapping the source blocks:
//   Header       : the hero (eyebrow, title, negative then positive framing)
//   Section A    : the DOM/CSS hub diagram (EcosystemDiagram)
//   Section B    : the four numbered pillars (the PillarCards idiom)
//   Principle    : the source's middle band, as three pills
//   Closing band : the outcome list, on a dark tealDeepest band (deck-like)
//
// All visuals are DOM/CSS, static + hover only. No Modal, no new assets, no new
// __integrity checks. Sits last in the nav, below Notion Coworking Setup.
// -----------------------------------------------------------------------------

const EcosystemFit: React.FC = () => (
  <div className="animate-fadeIn pb-16 md:pb-24">
    {/* Header. md:mr-[92px] clears the Lyka logo App.tsx pins top-right. */}
    <header className="md:mr-[92px]">
      <p
        className="text-micro font-bold uppercase font-mono"
        style={{ letterSpacing: TRACKING.eyebrow, color: LYKA.accentInk }}
      >
        {PAGE_EYEBROW}
      </p>
      <h1
        className="mt-1 max-w-4xl text-2xl leading-tight font-display md:text-4xl"
        style={{ color: 'var(--lyka-teal-deep)' }}
      >
        {PAGE_TITLE}
      </h1>
      <p className="mt-3 max-w-3xl text-body md:text-lead leading-relaxed" style={{ color: LYKA.muted }}>
        {PAGE_INTRO_NEGATIVE}
      </p>
      <p
        className="mt-2 max-w-3xl text-body md:text-lead font-medium leading-relaxed"
        style={{ color: LYKA.ink }}
      >
        {PAGE_INTRO_POSITIVE}
      </p>
    </header>

    {/* A. HOW IT FITS TOGETHER: the hub diagram */}
    <Section eyebrow={FIT_EYEBROW} title={FIT_HEADLINE}>
      <EcosystemDiagram />
    </Section>

    {/* B. WHAT WE WOULD ACTUALLY DO: the four pillars */}
    <Section eyebrow={PILLARS_EYEBROW} title={PILLARS_HEADLINE}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        {PILLARS.map((pillar) => (
          <PillarCard key={pillar.number} pillar={pillar} />
        ))}
      </div>
    </Section>

    {/* THE PRINCIPLE: a light band of three pills, between B and the close */}
    <PrincipleBand />

    {/* THE OUTCOME: the dark closing band, deck-like */}
    <OutcomeBand />
  </div>
);

// -----------------------------------------------------------------------------
// Section shell: mono eyebrow + display heading, matching NotionCoworkingSetup.
// -----------------------------------------------------------------------------

const Section: React.FC<{ eyebrow: string; title: string; children: React.ReactNode }> = ({
  eyebrow,
  title,
  children,
}) => (
  <section className="mt-12 md:mt-16">
    <p
      className="text-micro font-bold uppercase font-mono"
      style={{ letterSpacing: TRACKING.eyebrow, color: LYKA.accentInk }}
    >
      {eyebrow}
    </p>
    <h2
      className="mt-1 text-2xl leading-tight font-display md:text-4xl"
      style={{ color: 'var(--lyka-teal-deep)' }}
    >
      {title}
    </h2>
    <div className="mt-6">{children}</div>
  </section>
);

// -----------------------------------------------------------------------------
// B. Pillar card: the PillarCards idiom (white card, mint hairline, accentInk top
// rule that thickens on hover, big Poppins number, title, italic lede, body).
// -----------------------------------------------------------------------------

const ACCENT = LYKA.accentInk;

const PillarCard: React.FC<{ pillar: (typeof PILLARS)[number] }> = ({ pillar }) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <article
      onMouseEnter={() => setFocused(true)}
      onMouseLeave={() => setFocused(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      tabIndex={0}
      className={`relative rounded-2xl border bg-white shadow-sm outline-none transition-all duration-300 ease-out focus-visible:ring-2 ${
        focused ? '-translate-y-1 shadow-[0_18px_40px_-16px_rgba(0,86,72,0.28)]' : ''
      }`}
      style={{ borderColor: focused ? ACCENT : LYKA.border, ['--tw-ring-color' as string]: ACCENT }}
    >
      <div
        className="absolute left-0 right-0 top-0 rounded-t-2xl transition-all duration-300"
        style={{ height: focused ? '8px' : '4px', backgroundColor: ACCENT }}
      />
      <div className="px-5 pb-6 pt-7 md:px-7">
        <div className="flex items-baseline gap-3">
          <span className="text-figure font-display leading-none md:text-display" style={{ color: ACCENT }}>
            {pillar.number}
          </span>
          <h3 className="text-lead font-semibold md:text-title" style={{ color: LYKA.tealDeepest }}>
            {pillar.title}
          </h3>
        </div>
        <p className="mt-3 text-body font-medium" style={{ color: LYKA.ink }}>
          {pillar.lede}
        </p>
        {pillar.body.map((para) => (
          <p key={para} className="mt-2.5 text-body leading-relaxed" style={{ color: LYKA.muted }}>
            {para}
          </p>
        ))}
      </div>
    </article>
  );
};

// -----------------------------------------------------------------------------
// The principle band: light card, three pills. Deliberately light so the page
// has a single dark endpoint (the outcome band), not two adjacent dark blocks.
// -----------------------------------------------------------------------------

const PrincipleBand: React.FC = () => (
  <section
    className="mt-12 rounded-2xl border px-6 py-8 text-center md:mt-16 md:px-10"
    style={{ backgroundColor: LYKA.cream, borderColor: LYKA.border }}
  >
    <p
      className="text-micro font-bold uppercase font-mono"
      style={{ letterSpacing: TRACKING.eyebrow, color: LYKA.accentInk }}
    >
      {PRINCIPLE_EYEBROW}
    </p>
    <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
      {PRINCIPLES.map((p) => (
        <span
          key={p}
          className="rounded-full border px-5 py-2.5 text-body font-display md:text-lead"
          style={{ borderColor: ACCENT, color: LYKA.tealDeepest, backgroundColor: '#FFFFFF' }}
        >
          {p}
        </span>
      ))}
    </div>
  </section>
);

// -----------------------------------------------------------------------------
// The outcome band: dark tealDeepest close (like NotionCoworkingSetup's
// ClosingBand and ApexMethodology's formula bar), the five outcome points.
// -----------------------------------------------------------------------------

const OutcomeBand: React.FC = () => (
  <section
    className="mt-12 rounded-2xl px-6 py-8 shadow-[0_18px_40px_-16px_rgba(0,86,72,0.28)] md:mt-16 md:px-10 md:py-10"
    style={{ backgroundColor: LYKA.tealDeepest }}
  >
    <p className="text-micro font-bold uppercase font-mono text-white/60" style={{ letterSpacing: TRACKING.eyebrow }}>
      {OUTCOME_EYEBROW}
    </p>
    <h2 className="mt-1 max-w-3xl text-2xl font-display leading-tight text-white md:text-4xl">
      {OUTCOME_HEADLINE}
    </h2>
    <ul className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-x-8">
      {OUTCOMES.map((o) => (
        <li key={o} className="flex gap-3 text-body text-white/85 md:text-lead">
          <span
            className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full"
            style={{ backgroundColor: LYKA.accent }}
          />
          <span>{o}</span>
        </li>
      ))}
    </ul>
  </section>
);

export default EcosystemFit;
