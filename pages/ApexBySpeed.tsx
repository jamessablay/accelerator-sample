import React, { useState, useCallback } from 'react';
import { apexTables, ApexTableKey, APEX_ABOUT } from '../data/apexData';
import ApexMethodology from '../components/apex/ApexMethodology';
import ApexChannelTable from '../components/apex/ApexChannelTable';
import ApexGrowthQuadrant from '../components/apex/ApexGrowthQuadrant';

// REAL LYKA SINCE 2026-08-07. Two Roy Morgan Single Source audiences
// (Conflicted Troubleshooters, Mindful Researchers), exported from the APEX by
// SPEED Tool as the two decks in the project folder. See data/apexData.ts for
// provenance and the derivation.
//
// Structure mirrors the tool's report shell: top level VIEW tabs (About | True
// Net Worth Index | Growth Quadrant), then a persona tab strip inside the two
// data views. The two data views are the decks' slide 4 and slide 5.

type ApexView = 'ABOUT' | 'SCORECARD' | 'QUADRANT';

const VIEW_TABS: { key: ApexView; label: string; sub: string }[] = [
  { key: 'ABOUT', label: 'About', sub: 'The method' },
  { key: 'SCORECARD', label: 'True Net Worth Index', sub: 'Reach x Attention x Premium' },
  { key: 'QUADRANT', label: 'Growth Quadrant', sub: 'Where to invest' },
];

const ApexBySpeed: React.FC = () => {
  const [view, setView] = useState<ApexView>('ABOUT');
  // The audience selection survives a view switch on purpose: comparing the
  // same persona's table and quadrant is the natural reading path.
  const [activeTable, setActiveTable] = useState<ApexTableKey>('CONFLICTED_TROUBLESHOOTERS');

  const handleSelect = useCallback((key: ApexTableKey) => {
    setActiveTable(key);
  }, []);

  const table = apexTables[activeTable];

  return (
    <div className="animate-fadeIn pb-16 md:pb-24">
      {/* Header: APEX logo + the export decks' own tagline */}
      <header className="flex flex-col gap-3">
        <img
          src="/images/apex-by-speed-logo.png"
          alt="APEX by SPEED"
          className="block h-auto w-[220px] md:w-[300px]"
        />
        <p className="text-base md:text-xl max-w-4xl" style={{ color: 'var(--brand-ink-muted)' }}>
          True Net Worth Index | Media Channel Effectiveness. Three independent data sources combined
          into one score per channel, for two Lyka audiences.
        </p>
      </header>

      {/* View tabs, modelled on the tool's report shell */}
      <div className="mt-8 flex flex-wrap gap-1.5 border-b pb-3" style={{ borderColor: 'var(--brand-hairline)' }}>
        {VIEW_TABS.map((t) => {
          const active = view === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setView(t.key)}
              className="px-3 md:px-4 py-2.5 rounded-md text-left transition-colors duration-200 focus:outline-none focus-visible:ring-2"
              style={{
                backgroundColor: active ? 'var(--brand-ink-deepest)' : 'transparent',
                color: active ? '#fff' : 'var(--brand-ink)',
              }}
            >
              <span className="text-sm font-semibold">{t.label}</span>
              <span className={`ml-2 text-xs hidden md:inline ${active ? 'text-white/70' : ''}`} style={active ? undefined : { color: 'var(--brand-ink-muted)' }}>
                {t.sub}
              </span>
            </button>
          );
        })}
      </div>

      {view === 'ABOUT' && (
        <div className="mt-6">
          {/* Positioning card, from the tool's About tab. Client supplied copy. */}
          <div className="rounded-2xl bg-white shadow-sm border p-6 md:p-8" style={{ borderColor: 'var(--brand-hairline)' }}>
            {/* Two columns so the copy uses the card's full width without a 150+
                character line. Stacks below lg, where one column is the right
                measure. */}
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-x-10 gap-y-4 items-start">
              <div>
                <h2
                  className="font-mono text-[11px] font-medium uppercase tracking-[0.08em]"
                  style={{ color: 'var(--brand-accent-text)' }}
                >
                  {APEX_ABOUT.eyebrow}
                </h2>
                <p className="mt-2 text-2xl md:text-3xl leading-tight" style={{ color: 'var(--brand-ink-deepest)' }}>
                  {APEX_ABOUT.headline}
                </p>
                <p className="mt-4 text-base md:text-lg font-semibold" style={{ color: 'var(--brand-ink)' }}>
                  {APEX_ABOUT.lead}
                </p>
              </div>
              <p className="leading-relaxed lg:mt-1" style={{ color: 'var(--brand-ink-muted)' }}>
                {APEX_ABOUT.body}
              </p>
            </div>
          </div>

          {/* Formula bar + the three source cards */}
          <ApexMethodology />
        </div>
      )}

      {(view === 'SCORECARD' || view === 'QUADRANT') && (
        <>
          {/* Persona tab strip, shared by both data views */}
          <div className="mt-6 mb-6 flex flex-wrap gap-2 border-b pb-3" style={{ borderColor: 'var(--brand-hairline)' }}>
            {(Object.keys(apexTables) as ApexTableKey[]).map((key) => {
              const t = apexTables[key];
              const isSelected = activeTable === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelect(key)}
                  className={`px-5 py-2.5 text-sm md:text-base font-semibold rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 whitespace-nowrap ${
                    isSelected ? 'text-white' : 'hover:bg-[#F0F2E9]'
                  }`}
                  style={isSelected ? { backgroundColor: 'var(--brand-accent-text)' } : { color: 'var(--brand-ink)' }}
                >
                  <span>{t.label}</span>
                  <span className={`ml-2 text-xs ${isSelected ? 'text-white/80' : ''}`} style={isSelected ? undefined : { color: 'var(--brand-ink-muted)' }}>
                    {t.populationLabel}
                  </span>
                </button>
              );
            })}
          </div>

          {view === 'SCORECARD' && (
            <>
              <h2 className="text-3xl md:text-4xl" style={{ color: 'var(--brand-ink-deepest)' }}>
                Channel Scorecard
              </h2>
              <p className="mt-2 mb-4 text-sm md:text-base max-w-3xl" style={{ color: 'var(--brand-ink-muted)' }}>
                {table.subtitle}, indexed to channel mean = 100. Hover any row to see its True Net Worth bar
                extend to scale. Hover the score pills and stars for the underlying logic.
              </p>
              <ApexChannelTable key={activeTable} table={table} />
            </>
          )}

          {view === 'QUADRANT' && <ApexGrowthQuadrant table={table} />}
        </>
      )}
    </div>
  );
};

export default ApexBySpeed;
