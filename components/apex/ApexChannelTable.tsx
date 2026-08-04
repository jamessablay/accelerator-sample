import React, { useMemo, useState } from 'react';
import { LYKA } from '../../data/brand';
import {
  ApexChannelRow,
  ApexTable,
  TIER_COLOURS,
  scoreStrength,
  SCORE_BAND_STYLES,
} from '../../data/apexData';

interface Props {
  table: ApexTable;
}

const ApexChannelTable: React.FC<Props> = ({ table }) => {
  const maxMethodC = useMemo(
    () => Math.max(...table.rows.map((r) => r.methodC)),
    [table],
  );

  return (
    <div className="mt-2 rounded-2xl bg-white shadow-sm border border-[#DBE6DC] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <colgroup>
            <col style={{ width: '17%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '8%' }} />
            <col />
          </colgroup>
          <thead>
            <tr style={{ backgroundColor: LYKA.tealDeepest }} className="text-white text-[11px] md:text-xs uppercase tracking-wider">
              <Th align="left" sub={null}>Channel</Th>
              <Th align="center" sub={null}>Tier</Th>
              <Th align="center" sub="HEAVY %">HNWT</Th>
              <Th align="center" sub="INDEX">RM</Th>
              <Th align="center" sub="SCORE">KNF</Th>
              <Th align="center" sub="INDEX">Method B</Th>
              <Th align="center" sub="ENVIRONMENT">TTD Premium</Th>
              <Th align="center" sub="INDEX">Method C</Th>
              <Th align="left" sub={null}>True Net Worth Indicator</Th>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, idx) => (
              <ChannelRow key={row.channel} row={row} maxMethodC={maxMethodC} zebra={idx % 2 === 1} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footnote */}
      <div className="px-4 md:px-6 py-3 md:py-4 text-[11px] md:text-xs text-[#5B6E64] leading-relaxed border-t border-[#DBE6DC] bg-[#F9F6F1]">
        Sources: Roy Morgan Single Source Australia Jan to Dec 2025 | KNF, Amplified Intelligence | The Trade Desk, PA Consulting Premium Media Payoff Australia 2026.
        Method C = RM index × KNF attention score × TTD premium multiplier, indexed to channel mean = 100. Stars reflect TTD premium environment rating (1 to 5). ★★★★★ = 1.35+ multiplier (strongest premium signal). Outdoor = Heavy Out & About triptile.
      </div>
    </div>
  );
};

const Th: React.FC<{ align: 'left' | 'center'; sub: string | null; children: React.ReactNode }> = ({ align, sub, children }) => (
  <th className={`px-3 md:px-4 py-3 font-semibold ${align === 'left' ? 'text-left' : 'text-center'}`}>
    <div className="leading-tight">{children}</div>
    {sub && <div className="text-[9px] md:text-[10px] font-normal opacity-80 mt-0.5">{sub}</div>}
  </th>
);

interface ChannelRowProps {
  row: ApexChannelRow;
  maxMethodC: number;
  zebra: boolean;
}

const ChannelRow: React.FC<ChannelRowProps> = ({ row, maxMethodC, zebra }) => {
  const [rowHover, setRowHover] = useState(false);
  const tier = TIER_COLOURS[row.tier];

  const methodCBand = scoreStrength(row.methodC);
  const methodCStyle = SCORE_BAND_STYLES[methodCBand];

  const barWidthPct = Math.min(100, Math.round((row.methodC / maxMethodC) * 100));
  const animatedWidth = rowHover ? barWidthPct : Math.round(barWidthPct * 0.9);

  const bgBase = zebra ? LYKA.ivory : '#ffffff';
  const bgHover = LYKA.cream;

  return (
    <tr
      onMouseEnter={() => setRowHover(true)}
      onMouseLeave={() => setRowHover(false)}
      onFocus={() => setRowHover(true)}
      onBlur={() => setRowHover(false)}
      className="transition-colors duration-200 border-t border-[#DBE6DC]"
      style={{ backgroundColor: rowHover ? bgHover : bgBase }}
    >
      <td className="px-3 md:px-4 py-3 font-medium text-[#003D33] whitespace-nowrap">
        {row.channel}
      </td>
      <td className="px-3 md:px-4 py-3 text-center">
        <TierPill tier={row.tier} />
      </td>
      <td className="px-3 md:px-4 py-3 text-center font-mono text-[#143C33]">
        {row.heavyPct.toFixed(1)}%
      </td>
      <td className="px-3 md:px-4 py-3 text-center">
        <ScorePill value={row.rmIndex} sourceKey="RM" />
      </td>
      <td className="px-3 md:px-4 py-3 text-center text-[#143C33] font-mono">
        {row.knfScore.toFixed(1)}
      </td>
      <td className="px-3 md:px-4 py-3 text-center">
        <ScorePill value={row.methodB} sourceKey="METHOD_B" />
      </td>
      <td className="px-3 md:px-4 py-3 text-center">
        <StarCell stars={row.ttdStars} multiplier={row.ttdMultiplier} />
      </td>
      <td className="px-3 md:px-4 py-3 text-center">
        <ScorePill value={row.methodC} sourceKey="METHOD_C" emphasised={rowHover} />
      </td>
      <td className="px-3 md:px-4 py-3">
        <div className="relative h-6 w-full rounded bg-[#F0F2E9] overflow-hidden">
          <div
            className="absolute top-0 left-0 bottom-0 transition-all duration-500 ease-out rounded"
            style={{
              width: `${animatedWidth}%`,
              backgroundColor: methodCStyle.border,
              opacity: 0.85,
            }}
          />
          <div
            className="absolute inset-0 flex items-center justify-end pr-2 font-mono text-xs font-semibold"
            style={{ color: rowHover ? LYKA.tealDeepest : LYKA.muted }}
          >
            {row.methodC}
          </div>
        </div>
      </td>
    </tr>
  );
};

const TierPill: React.FC<{ tier: keyof typeof TIER_COLOURS }> = ({ tier }) => {
  const [hover, setHover] = useState(false);
  const c = TIER_COLOURS[tier];
  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span
        className="inline-block px-2.5 py-1 rounded text-[10px] md:text-[11px] font-bold tracking-wider uppercase whitespace-nowrap transition-transform duration-200"
        style={{
          backgroundColor: c.bg,
          color: c.fg,
          transform: hover ? 'scale(1.05)' : 'scale(1)',
        }}
      >
        {tier}
      </span>
      {hover && (
        <Tooltip>
          <div className="font-semibold">{c.label}</div>
          <div className="text-xs opacity-90 mt-0.5">{c.description}</div>
        </Tooltip>
      )}
    </span>
  );
};

type ScoreSource = 'RM' | 'METHOD_B' | 'METHOD_C';

interface ScorePillProps {
  value: number;
  sourceKey: ScoreSource;
  emphasised?: boolean;
}

const ScorePill: React.FC<ScorePillProps> = ({ value, sourceKey, emphasised }) => {
  const [hover, setHover] = useState(false);
  const band = scoreStrength(value);
  const s = SCORE_BAND_STYLES[band];
  const tooltip = SCORE_TOOLTIPS[sourceKey];

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        type="button"
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        className={`inline-block px-3 py-1 rounded-full text-xs md:text-sm font-bold font-mono transition-all duration-200 focus:outline-none focus-visible:ring-2 ${
          emphasised ? 'ring-2 ring-offset-1' : ''
        }`}
        style={{
          border: `1.5px solid ${s.border}`,
          backgroundColor: s.bg,
          color: s.fg,
        }}
      >
        {value}
      </button>
      {hover && (
        <Tooltip>
          <div className="font-semibold">{tooltip.title}</div>
          <div className="text-xs opacity-90 mt-0.5">{tooltip.body}</div>
          <div className="text-[10px] opacity-70 mt-1">
            Band: {band === 'strong' ? 'strong (≥120)' : band === 'mid' ? 'mid (90 to 119)' : 'weak (under 90)'}
          </div>
        </Tooltip>
      )}
    </span>
  );
};

const SCORE_TOOLTIPS: Record<ScoreSource, { title: string; body: string }> = {
  RM: {
    title: 'RM Index',
    body: 'Roy Morgan: HNWT heavy% ÷ All 14+ heavy% × 100. Index 100 = population average. Higher = HNWT over indexes this channel.',
  },
  METHOD_B: {
    title: 'Method B Index',
    body: 'RM Index × KNF attention score, indexed to channel mean = 100. Baseline reach × attention before the premium overlay.',
  },
  METHOD_C: {
    title: 'Method C, True Net Worth Indicator',
    body: 'RM Index × KNF attention score × TTD premium multiplier, indexed to channel mean = 100. The full APEX score.',
  },
};

const StarCell: React.FC<{ stars: number; multiplier: number }> = ({ stars, multiplier }) => {
  const [hover, setHover] = useState(false);
  const filled = Math.max(0, Math.min(5, stars));
  const empty = 5 - filled;

  const goldFilled = LYKA.tangerine;
  const goldEmpty = LYKA.mint;

  return (
    <span
      className="relative inline-flex flex-col items-center"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        type="button"
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        className="flex flex-col items-center focus:outline-none focus-visible:ring-2 rounded px-1.5 py-0.5"
      >
        <span
          className="leading-none transition-transform duration-200"
          style={{ transform: hover ? 'scale(1.15)' : 'scale(1)', letterSpacing: '1px' }}
        >
          <span style={{ color: goldFilled }}>{'★'.repeat(filled)}</span>
          <span style={{ color: goldEmpty }}>{'☆'.repeat(empty)}</span>
        </span>
        <span className="font-mono text-[11px] mt-0.5 text-[#5B6E64]">×{multiplier.toFixed(2)}</span>
      </button>
      {hover && (
        <Tooltip wide>
          <div className="font-semibold">TTD premium environment</div>
          <div className="text-xs opacity-90 mt-0.5">
            ×{multiplier.toFixed(2)} multiplier ({filled} of 5).
          </div>
          <div className="text-xs opacity-90 mt-1">{starOutcome(multiplier)}</div>
        </Tooltip>
      )}
    </span>
  );
};

const starOutcome = (m: number): string => {
  if (m >= 1.40) return 'Streaming TV: 3.5× aspirational, 2.4× quality perception vs non premium.';
  if (m >= 1.35) return 'Premium digital news: 14× brand popularity, 12.4× relevance vs non premium.';
  if (m >= 1.20) return 'Premium audio: 2.3× innovative, 1.6× relevant vs non premium.';
  if (m >= 1.15) return 'Above mean premium signal. Strong environment quality.';
  if (m >= 1.05) return 'OOH conservative. TTD does not score OOH directly.';
  if (m >= 1.00) return 'Channel mean. Neutral premium signal.';
  return 'Cluttered feeds. TTD finds premium perceptions are diminished.';
};

const Tooltip: React.FC<{ children: React.ReactNode; wide?: boolean }> = ({ children, wide }) => (
  <span
    role="tooltip"
    className={`absolute z-30 left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 rounded-lg text-white text-xs shadow-[0_18px_40px_-16px_rgba(0,86,72,0.28)] pointer-events-none ${
      wide ? 'w-64' : 'w-56'
    }`}
    style={{ backgroundColor: LYKA.tealDeepest }}
  >
    {children}
    <span
      className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
      style={{
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderTop: `6px solid ${LYKA.tealDeepest}`,
      }}
    />
  </span>
);

export default ApexChannelTable;
