import React, { useState, useCallback } from 'react';
import { apexTables, ApexTableKey } from '../data/apexData';
import ApexMethodology from '../components/apex/ApexMethodology';
import ApexChannelTable from '../components/apex/ApexChannelTable';

const ApexBySpeed: React.FC = () => {
  const [activeTable, setActiveTable] = useState<ApexTableKey>('HNWT_DOMESTIC');

  const handleSelect = useCallback((key: ApexTableKey) => {
    setActiveTable(key);
  }, []);

  const table = apexTables[activeTable];

  return (
    <div className="animate-fadeIn pb-16 md:pb-24">
      {/* Header: APEX logo + tagline */}
      <header className="flex flex-col gap-3">
        <img
          src="/images/apex-by-speed-logo.png"
          alt="APEX by SPEED"
          className="block h-auto w-[220px] md:w-[300px]"
        />
        {/* Deliberately NOT "Lyka's media channel scorecard". The methodology is
            SPEED's and carries over, but the two audience tables below are still
            a Hamilton Island HNWT traveller Roy Morgan pull. Claiming them as
            Lyka's would present affluent traveller media consumption as dog
            owner media consumption, inside a panel that cites Roy Morgan Single
            Source by name. Restore the client claim only once the tables hold a
            real Lyka pull. */}
        <p className="text-base md:text-xl max-w-4xl" style={{ color: 'var(--lyka-muted)' }}>
          The SPEED media channel scorecard. Three independent data sources combined into one True Net Worth Indicator.
        </p>
      </header>

      {/* Methodology */}
      <ApexMethodology />

      {/* Section heading for tables */}
      <div className="mt-12 md:mt-14">
        <h2 className="text-3xl md:text-4xl font-display" style={{ color: 'var(--lyka-teal-deep)' }}>
          Channel Scorecard
        </h2>
        <p className="mt-2 text-sm md:text-base max-w-3xl" style={{ color: 'var(--lyka-muted)' }}>
          {table.subtitle}. Hover any row to see its True Net Worth bar extend to scale. Hover the score pills and stars for the underlying logic.
        </p>

        {/* Audience-provenance notice. Load bearing, not decoration. */}
        <div
          className="mt-5 flex items-start gap-3 rounded-xl border-l-[3px] px-4 py-3 max-w-3xl"
          style={{ backgroundColor: 'var(--lyka-cream)', borderColor: 'var(--lyka-tangerine)' }}
        >
          <div>
            <p
              className="font-mono text-[10px] font-medium uppercase tracking-[0.22em]"
              style={{ color: '#8C3D24' }}
            >
              Placeholder audience
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: 'var(--lyka-ink)' }}>
              The channel constants below are SPEED&apos;s and carry over unchanged. The two audience
              definitions and their index figures are a prior travel audience, retained only to keep the
              page functional. They are not Lyka data. Both tables need one Roy Morgan Single Source pull
              against agreed Lyka audience definitions: 13 channels, heavy reach percentage and index.
              Every other column recomputes from those.
            </p>
          </div>
        </div>
      </div>

      {/* Domestic | International tab strip */}
      <div className="my-6 flex flex-wrap gap-2 border-b pb-3 pt-2" style={{ borderColor: 'var(--lyka-mint)' }}>
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
              style={isSelected ? { backgroundColor: 'var(--lyka-teal-deep)' } : { color: 'var(--lyka-ink)' }}
            >
              <span>{t.label}</span>
              <span className={`ml-2 text-xs ${isSelected ? 'text-white/80' : ''}`} style={isSelected ? undefined : { color: 'var(--lyka-muted)' }}>
                {t.populationLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active table */}
      <ApexChannelTable key={activeTable} table={table} />
    </div>
  );
};

export default ApexBySpeed;
