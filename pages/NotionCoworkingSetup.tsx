import React, { useState } from 'react';
import { LYKA, OWNER_COLORS } from '../data/brand';
import { TRACKING } from '../data/type';
import {
  PAGE_EYEBROW,
  PAGE_TITLE,
  PAGE_SUBTITLE,
  PROBLEM_HEADLINE,
  PROBLEM_BODY,
  PROBLEM_QUESTION,
  SCATTERED_SOURCES,
  ONE_SHARED_SPACE,
  SHARED_SPACE_HEADLINE,
  PILLARS_HEADLINE,
  SETUP_HEADLINE,
  SETUP_STEPS,
  SETUP_FOOTNOTE,
  PRACTICE_HEADLINE,
  COMPOUNDING_HEADLINE,
  COMPOUNDING_BODY,
  COMPOUNDING_CAPTION,
  PRIVACY_HEADLINE,
  PRIVACY_POINTS,
  PRIVACY_OUTSIDERS,
  CONTRASTS_HEADLINE,
  CLOSING_HEADLINE,
  CLOSING_LEAD,
  CLOSING_STEPS,
  CLOSING_NOTE,
} from '../data/notionCoworkingData';
import SharedSpaceDiagram from '../components/notion/SharedSpaceDiagram';
import PillarCards from '../components/notion/PillarCards';
import PracticeWalkthrough from '../components/notion/PracticeWalkthrough';
import CompoundingVisual from '../components/notion/CompoundingVisual';
import BeforeAfter from '../components/notion/BeforeAfter';

// -----------------------------------------------------------------------------
// NOTION COWORKING SETUP: the seventh page.
//
// A SCROLLING page like pages/ApexBySpeed.tsx (root animate-fadeIn + pb-16
// md:pb-24), not a one-viewport frame: ten slides of narrative read top to
// bottom. Copy is all in data/notionCoworkingData.ts (house-styled once there).
//
// Sections A (the problem), D-top (setup steps), E-right (privacy) and the
// closing dark band live inline; the five richer visuals are components in
// components/notion/. Design system per docs/notion-page-plan.md section 8.
// -----------------------------------------------------------------------------

const NotionCoworkingSetup: React.FC = () => (
  <div className="animate-fadeIn pb-16 md:pb-24">
    {/* Header, following pages/TenThings.tsx. md:mr-[92px] clears the Lyka logo
        App.tsx pins top-right. */}
    <header className="md:mr-[92px]">
      <p
        className="text-micro font-bold uppercase font-mono"
        style={{ letterSpacing: TRACKING.eyebrow, color: LYKA.accentInk }}
      >
        {PAGE_EYEBROW}
      </p>
      <h1
        className="mt-1 text-2xl leading-tight font-display md:text-display"
        style={{ color: 'var(--lyka-teal-deep)' }}
      >
        {PAGE_TITLE}
      </h1>
      <p className="mt-1.5 max-w-3xl text-body md:text-lead" style={{ color: LYKA.muted }}>
        {PAGE_SUBTITLE}
      </p>
    </header>

    {/* A. THE PROBLEM (slide 2) */}
    <Section eyebrow="The problem" title={PROBLEM_HEADLINE}>
      <p className="max-w-3xl text-body md:text-lead leading-relaxed" style={{ color: LYKA.ink }}>
        {PROBLEM_BODY}
      </p>
      <ProblemVisual />
      <p
        className="mt-6 max-w-2xl text-lead font-display leading-snug"
        style={{ color: LYKA.tealDeepest }}
      >
        {PROBLEM_QUESTION}
      </p>
    </Section>

    {/* B. THE SHARED SPACE (slide 3) */}
    <Section eyebrow="The idea" title={SHARED_SPACE_HEADLINE}>
      <SharedSpaceDiagram />
    </Section>

    {/* C. FOUR PLACES (slide 4) */}
    <Section eyebrow="What lives there" title={PILLARS_HEADLINE}>
      <PillarCards />
    </Section>

    {/* D. HOW IT WORKS (slides 5 + 6) */}
    <Section eyebrow="How it works" title={SETUP_HEADLINE}>
      <SetupSteps />
      <p className="mt-5 max-w-3xl text-meta italic md:text-body" style={{ color: LYKA.muted }}>
        {SETUP_FOOTNOTE}
      </p>

      <h3 className="mt-10 text-lead font-semibold md:text-title" style={{ color: LYKA.ink }}>
        {PRACTICE_HEADLINE}
      </h3>
      <div className="mt-4">
        <PracticeWalkthrough />
      </div>
    </Section>

    {/* E. COMPOUNDS + PRIVATE (slides 7 + 8) */}
    <Section eyebrow="Why it gets better" title={COMPOUNDING_HEADLINE}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Left: compounding */}
        <div className="rounded-2xl border bg-white p-6 md:p-8" style={{ borderColor: LYKA.border }}>
          <p className="max-w-md text-body leading-relaxed" style={{ color: LYKA.ink }}>
            {COMPOUNDING_BODY}
          </p>
          <div className="mt-8">
            <CompoundingVisual />
          </div>
          <p className="mx-auto mt-6 max-w-sm text-center text-meta leading-relaxed" style={{ color: LYKA.muted }}>
            {COMPOUNDING_CAPTION}
          </p>
        </div>

        {/* Right: privacy */}
        <PrivacyPanel />
      </div>
    </Section>

    {/* F. SCATTERED -> SHARED (slide 9) */}
    <Section eyebrow="The shift" title={CONTRASTS_HEADLINE}>
      <BeforeAfter />
    </Section>

    {/* CLOSE (slide 10): a dark band, like ApexMethodology's formula bar */}
    <ClosingBand />
  </div>
);

// -----------------------------------------------------------------------------
// Section shell: mono eyebrow + display heading, consistent per section.
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
// A. Problem visual: four scattered source chips converge into one space.
//
// Each chip carries a skewed resting rotation/offset via inline style, driven by
// hover STATE (not a CSS :hover rule) so it never fights an inline transform:
// the specificity trap the ladder and strip both hit. Hovering a chip
// straightens and lifts it.
// -----------------------------------------------------------------------------

const CHIP_TRANSFORMS = [
  'rotate(-6deg) translateY(-4px)',
  'rotate(4deg) translateY(6px)',
  'rotate(-3deg) translateY(8px)',
  'rotate(7deg) translateY(-2px)',
];

const ProblemVisual: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="mt-8 flex flex-col items-center gap-6 md:flex-row md:gap-4">
      {/* Scattered chips */}
      <div className="flex flex-1 flex-wrap items-center justify-center gap-3">
        {SCATTERED_SOURCES.map((label, i) => {
          const on = hovered === i;
          return (
            <span
              key={label}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-default select-none rounded-xl border px-4 py-2.5 text-body transition-all duration-300"
              style={{
                borderColor: on ? LYKA.accentInk : LYKA.mint,
                backgroundColor: on ? '#FFFFFF' : LYKA.ivory,
                color: on ? LYKA.tealDeepest : LYKA.muted,
                transform: on ? 'rotate(0deg) translateY(-2px)' : CHIP_TRANSFORMS[i],
                boxShadow: on ? '0 12px 28px -16px rgba(0,86,72,0.28)' : 'none',
              }}
            >
              {label}
            </span>
          );
        })}
      </div>

      {/* Arrow */}
      <div className="flex items-center justify-center" style={{ color: LYKA.mintMuted }}>
        <svg className="h-6 w-6 rotate-90 md:rotate-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </div>

      {/* One shared space */}
      <div className="flex flex-1 justify-center">
        <div
          className="rounded-2xl px-8 py-6 text-center shadow-[0_18px_40px_-16px_rgba(0,86,72,0.28)]"
          style={{ backgroundColor: LYKA.tealDeepest }}
        >
          <span className="text-lead font-display text-white md:text-title">{ONE_SHARED_SPACE}</span>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// D-top. The three setup steps as a numbered horizontal strip.
// -----------------------------------------------------------------------------

const SetupSteps: React.FC = () => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
    {SETUP_STEPS.map((step) => (
      <div key={step.number} className="rounded-2xl border bg-white p-5 md:p-6" style={{ borderColor: LYKA.border }}>
        <div className="flex items-baseline gap-3">
          <span className="text-figure font-display leading-none" style={{ color: LYKA.accentInk }}>
            {step.number}
          </span>
          <h4 className="text-lead font-semibold" style={{ color: LYKA.ink }}>
            {step.title}
          </h4>
        </div>
        <p className="mt-2 text-body leading-relaxed" style={{ color: LYKA.muted }}>
          {step.body}
        </p>
      </div>
    ))}
  </div>
);

// -----------------------------------------------------------------------------
// E-right. Privacy: two owners inside a bordered boundary, other clients outside
// marked no access (slide 8).
// -----------------------------------------------------------------------------

const PrivacyPanel: React.FC = () => (
  <div className="rounded-2xl border bg-white p-6 md:p-8" style={{ borderColor: LYKA.border }}>
    <h3 className="text-lead font-semibold md:text-title" style={{ color: LYKA.ink }}>
      {PRIVACY_HEADLINE}
    </h3>

    {/* Boundary: the two owners are inside; other clients sit outside it. */}
    <div className="mt-5">
      <div
        className="rounded-2xl border-2 border-dashed p-4"
        style={{ borderColor: LYKA.accentInk, backgroundColor: LYKA.ivory }}
      >
        <p className="mb-3 text-micro font-bold uppercase font-mono" style={{ letterSpacing: TRACKING.eyebrow, color: LYKA.accentInk }}>
          Your space
        </p>
        <div className="flex flex-wrap gap-2">
          <OwnerChip label="Lyka" owner="lyka" />
          <OwnerChip label="SPEED" owner="speed" />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {PRIVACY_OUTSIDERS.map((label, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-meta"
            style={{ borderColor: LYKA.mint, backgroundColor: LYKA.cream, color: LYKA.muted }}
          >
            {label}
            <span
              className="rounded px-1.5 py-0.5 text-micro font-bold uppercase font-mono"
              style={{ letterSpacing: TRACKING.eyebrow, backgroundColor: '#FFFFFF', color: LYKA.muted, border: `1px solid ${LYKA.mint}` }}
            >
              No access
            </span>
          </span>
        ))}
      </div>
    </div>

    <ul className="mt-6 space-y-2.5">
      {PRIVACY_POINTS.map((point) => (
        <li key={point} className="flex gap-2 text-body leading-relaxed" style={{ color: LYKA.ink }}>
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ backgroundColor: LYKA.accentInk }} />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  </div>
);

const OwnerChip: React.FC<{ label: string; owner: 'lyka' | 'speed' }> = ({ label, owner }) => (
  <span
    className="rounded-lg px-4 py-2 text-body font-semibold"
    style={{ backgroundColor: OWNER_COLORS[owner].base, color: OWNER_COLORS[owner].ink }}
  >
    {label}
  </span>
);

// -----------------------------------------------------------------------------
// Closing dark band (slide 10). Ends the page dark, deck-like, on tealDeepest.
// -----------------------------------------------------------------------------

const ClosingBand: React.FC = () => (
  <section
    className="mt-12 rounded-2xl px-6 py-8 shadow-[0_18px_40px_-16px_rgba(0,86,72,0.28)] md:mt-16 md:px-10 md:py-10"
    style={{ backgroundColor: LYKA.tealDeepest }}
  >
    <p className="text-micro font-bold uppercase font-mono text-white/60" style={{ letterSpacing: TRACKING.eyebrow }}>
      Getting started
    </p>
    <h2 className="mt-1 text-2xl font-display leading-tight text-white md:text-4xl">{CLOSING_HEADLINE}</h2>
    <p className="mt-2 max-w-2xl text-body text-white/80 md:text-lead">{CLOSING_LEAD}</p>

    <div className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
      {CLOSING_STEPS.map((step) => (
        <div
          key={step.number}
          className="rounded-xl px-4 py-4"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          <div className="flex items-baseline gap-2">
            <span className="text-lead font-display leading-none text-white/70">{step.number}</span>
            <h4 className="text-body font-semibold text-white md:text-lead">{step.title}</h4>
          </div>
          <p className="mt-1.5 text-meta leading-relaxed text-white/75 md:text-body">{step.body}</p>
        </div>
      ))}
    </div>

    <p className="mt-6 text-body font-semibold" style={{ color: LYKA.accent }}>
      {CLOSING_NOTE}
    </p>
  </section>
);

export default NotionCoworkingSetup;
