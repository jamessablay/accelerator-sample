import React, { useState } from 'react';
import { LYKA, lighten } from '../../data/brand';
import { apexMethodologySources, ApexSourceKey } from '../../data/apexData';

const ApexMethodology: React.FC = () => {
  const [activeSource, setActiveSource] = useState<ApexSourceKey | null>(null);

  const isActive = (key: ApexSourceKey) => activeSource === null || activeSource === key;
  const isFocused = (key: ApexSourceKey) => activeSource === key;

  return (
    <section className="mt-8">
      {/* Formula bar */}
      <div
        className="rounded-2xl px-4 md:px-8 py-5 md:py-6 shadow-[0_12px_28px_-12px_rgba(0,86,72,0.22)]"
        style={{ backgroundColor: LYKA.tealDeepest }}
      >
        {/* The formula matches the tool and the export decks' slide 6:
            RM INDEX x KNF SCORE x TTD/PAC PREMIUM = TRUE NET WORTH INDEX.
            The old intermediate "TABLE 1" pill was the Method B step, whose
            table (slide 3) this page does not carry. */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 text-white">
          {apexMethodologySources.map((src, i) => (
            <React.Fragment key={src.key}>
              {i > 0 && <FormulaOp symbol="×" />}
              <FormulaPill
                label={src.pillLabel}
                sub={src.pillSubLabel}
                colour={src.accent}
                isFocused={isFocused(src.key)}
                isDimmed={activeSource !== null && !isFocused(src.key)}
                onEnter={() => setActiveSource(src.key)}
                onLeave={() => setActiveSource(null)}
              />
            </React.Fragment>
          ))}
          <FormulaOp symbol="=" />
          <FormulaStaticPill label="TRUE NET WORTH INDEX" sub="The full premium index" emphasised />
        </div>
      </div>

      {/* Source cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {apexMethodologySources.map((src) => {
          const focused = isFocused(src.key);
          const dimmed = activeSource !== null && !focused;
          return (
            <article
              key={src.key}
              onMouseEnter={() => setActiveSource(src.key)}
              onMouseLeave={() => setActiveSource(null)}
              onFocus={() => setActiveSource(src.key)}
              onBlur={() => setActiveSource(null)}
              tabIndex={0}
              className={`relative rounded-2xl bg-white shadow-sm border outline-none focus-visible:ring-2 transition-all duration-300 ease-out cursor-default ${
                focused ? '-translate-y-1 shadow-[0_18px_40px_-16px_rgba(0,86,72,0.28)]' : ''
              } ${dimmed ? 'opacity-60' : 'opacity-100'}`}
              style={{
                borderColor: focused ? src.accent : 'rgba(0,86,72,0.08)',
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 rounded-t-2xl transition-all duration-300"
                style={{
                  height: focused ? '8px' : '4px',
                  backgroundColor: src.accent,
                }}
              />
              <div className="pt-7 pb-6 px-5 md:px-6">
                <div
                  className="text-3xl md:text-4xl tracking-wide leading-none"
                  style={{ color: src.accent }}
                >
                  {src.number}
                </div>
                <h3 className="mt-3 text-base md:text-lg font-semibold text-[#003D33]">
                  {src.title}
                </h3>
                <p className="mt-1 text-xs md:text-sm italic text-[#5B6E64]">
                  {src.subtitle}
                </p>
                <ul className="mt-4 space-y-2">
                  {src.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2 text-sm text-[#143C33]">
                      <span
                        className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: src.accent }}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

interface FormulaPillProps {
  label: string;
  sub: string;
  colour: string;
  isFocused: boolean;
  isDimmed: boolean;
  onEnter: () => void;
  onLeave: () => void;
}

const FormulaPill: React.FC<FormulaPillProps> = ({ label, sub, colour, isFocused, isDimmed, onEnter, onLeave }: FormulaPillProps) => {
  // The raw source accents cannot carry text on the dark bar: #1d8a6b is
  // 2.85:1 on tealDeepest, under even the 3:1 non-text floor, and filling the
  // pill with the accent puts white on #10B193 at 2.2:1. So the label prints
  // in a LIGHTENED accent (all three clear AA on the bar), and focus brightens
  // it to white over a translucent lift instead of filling with the accent.
  // This was invisible while the page sat behind the placeholder; it opened
  // on 2026-08-07 and was measured then.
  const barText = lighten(colour, 0.35);
  return (
    <button
      type="button"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className={`group relative px-4 md:px-5 py-2 md:py-2.5 rounded-lg text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
        isFocused ? 'scale-105 shadow-[0_12px_28px_-12px_rgba(0,86,72,0.22)]' : ''
      } ${isDimmed ? 'opacity-50' : 'opacity-100'}`}
      style={{
        backgroundColor: isFocused ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${isFocused ? barText : 'rgba(255,255,255,0.15)'}`,
      }}
    >
      <div className="text-sm md:text-base font-bold tracking-wider" style={{ color: isFocused ? '#ffffff' : barText }}>
        {label}
      </div>
      <div className="text-[10px] md:text-xs text-white/70 mt-0.5">{sub}</div>
    </button>
  );
};

const FormulaStaticPill: React.FC<{ label: string; sub: string; emphasised?: boolean }> = ({ label, sub, emphasised }) => (
  <div
    className="px-4 md:px-5 py-2 md:py-2.5 rounded-lg text-left"
    style={{
      backgroundColor: emphasised ? 'rgba(232,21,27,0.12)' : 'rgba(255,255,255,0.05)',
      border: `1px solid ${emphasised ? 'rgba(232,21,27,0.55)' : 'rgba(255,255,255,0.15)'}`,
    }}
  >
    <div
      className={`text-sm md:text-base font-bold tracking-wider whitespace-nowrap`}
      style={{ color: emphasised ? LYKA.orange : '#ffffff' }}
    >
      {label}
    </div>
    <div className="text-[10px] md:text-xs text-white/70 mt-0.5">{sub}</div>
  </div>
);

const FormulaOp: React.FC<{ symbol: string }> = ({ symbol }) => (
  <span className="text-xl md:text-2xl text-white/60 select-none">{symbol}</span>
);

export default ApexMethodology;
