import React, { useCallback, useState } from 'react';
import MacroBlockPlan from '../components/mediaplan/MacroBlockPlan';
import BudgetBreakdownChart from '../components/mediaplan/BudgetBreakdownChart';
import BudgetPieChart from '../components/mediaplan/BudgetPieChart';
import ChannelDetail from '../components/mediaplan/ChannelDetail';
import Modal from '../components/shared/Modal';
import { PLAN_LAYERS, MediaRow, LayerKey, MEDIA_TOTAL } from '../data/mediaPlanData';
import { LYKA } from '../data/brand';
import { TRACKING } from '../data/type';

type ModalState =
  | { type: 'budget' }
  | { type: 'pct' }
  | { type: 'channel'; row: MediaRow; layerKey: LayerKey }
  | null;

const layerKeyForRow = (row: MediaRow): LayerKey =>
  (PLAN_LAYERS.find((l) => l.rows.includes(row))?.key ?? 'SHOW IT');

/**
 * A KPI card: uppercase mono title, hero figure, supporting sub line.
 *
 * All three sizes come from data/type.ts tokens rather than arbitrary px, and
 * both greys clear AA on the white card. Three things here were fixed on
 * 2026-08-05 after the strip was reported as hard to read, and each one is a
 * rule rather than a taste call:
 *
 * 1. THE SUB LINE WAS `LYKA.mintMuted` #A9C3B4 AT 1.88:1, which misses AA 4.5:1
 *    and even the 3:1 non-text floor. It is `LYKA.muted` #5B6E64 at 5.44:1 now.
 *    That token is fill and border only; see its comment in brand.ts.
 * 2. The sub line is sentence case prose, so it cannot sit at `micro` 11 (which
 *    type.ts reserves for uppercase mono eyebrows). `meta` 12 is the sanctioned
 *    footnote step.
 * 3. The title went `micro` 11 to `label` 13. 13 is the largest step that still
 *    reads as an eyebrow: `body` 14 is the prose floor, above which it starts
 *    competing with the figure. Tracking moves with it, from Tailwind's
 *    `tracking-wide` 0.025em to `TRACKING.caps` 0.06em, because
 *    `TRACKING.eyebrow` 0.08em is calibrated for `micro`.
 *
 * `font-medium` on the title and `font-semibold` on the figure are REAL loaded
 * faces. The old `font-bold` asked for DM Mono 700, which index.html does not
 * load (400 and 500 only), so the browser was synthesising it; the figure
 * carried no weight class at all and rendered in Poppins Regular.
 */
const KpiCard: React.FC<{ label: string; value: string; sub?: string }> = ({ label, value, sub }) => (
  <div className="rounded-xl border bg-white px-4 py-3 shadow-sm" style={{ borderColor: LYKA.mint }}>
    <p className="font-mono text-label font-medium uppercase" style={{ letterSpacing: TRACKING.caps, color: LYKA.muted }}>{label}</p>
    {/* mt-1.5, not mt-1: the token line box is tighter than Tailwind's text-2xl. */}
    <p className="mt-1.5 text-figure md:text-display font-semibold tabular-nums" style={{ color: LYKA.tealDeepest }}>{value}</p>
    {sub && <p className="mt-0.5 text-meta" style={{ color: LYKA.muted }}>{sub}</p>}
  </div>
);

const InteractiveMediaPlan: React.FC = () => {
  const [modal, setModal] = useState<ModalState>(null);

  const handleSelectChannel = useCallback((row: MediaRow) => {
    setModal({ type: 'channel', row, layerKey: layerKeyForRow(row) });
  }, []);
  const handleShowBudget = useCallback(() => setModal({ type: 'budget' }), []);
  const handleShowPct = useCallback(() => setModal({ type: 'pct' }), []);
  const handleClose = useCallback(() => setModal(null), []);

  return (
    <div className="animate-fadeIn pb-16 md:pb-24">
      <header className="flex-shrink-0">
        <h1 className="text-4xl md:text-5xl" style={{ color: 'var(--brand-ink-deepest)' }}>
          Interactive Media Plan
        </h1>
        <p className="mt-3 text-base md:text-xl text-[#143C33] max-w-4xl">
          12 month macro block plan, October to September. Click any flighting bar for the channel detail, or the Budget header for the stacked monthly breakdown.
        </p>
      </header>

      {/* KPI strip. THREE CARDS, not four: the Channels card ("23 | 10 Lyka in
          house") was removed on client direction 2026-08-06. Its two derived
          counts went with it, since nothing else read them.

          THE COLUMN COUNT HAS TO MOVE WITH THE CARD COUNT. Three cards left in
          a `md:grid-cols-4` track would sit two thirds of the way across with a
          dead fourth column, which reads as a card that failed to load rather
          than as one that was removed. Below `sm:` they stack one up rather
          than the old two up, because 3 in a 2 column grid orphans the last. */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <KpiCard label="SPEED managed media" value={`$${(MEDIA_TOTAL / 1_000_000).toFixed(1)}M`} sub="Working media" />
        <KpiCard label="Flight" value="Oct ▸ Sep" sub="12 months" />
        <KpiCard label="Funnel stages" value="5" sub="SHOW IT ▸ SHARE IT" />
      </div>

      <div className="mt-6">
        <MacroBlockPlan onSelectChannel={handleSelectChannel} onShowBudget={handleShowBudget} onShowPct={handleShowPct} />
      </div>

      <p className="mt-3 text-sm font-semibold text-[#143C33]">
        Total: ${(MEDIA_TOTAL / 1_000_000).toFixed(1)}M SPEED managed media | Lyka in house channels (green) are flighted alongside and funded by Lyka
      </p>

      <Modal
        isOpen={modal !== null}
        onClose={handleClose}
        title={
          modal?.type === 'channel'
            ? modal.row.channel
            : modal?.type === 'pct'
            ? 'Budget Percentage Distribution'
            : 'Total Monthly Budget Breakdown'
        }
        subtitle={
          modal?.type === 'channel'
            ? `${modal.layerKey}${modal.row.owner === 'lyka' ? ' | Lyka in house' : ''}`
            : modal?.type === 'pct'
            ? 'Budget allocation by media channel'
            : 'Stacked by media channel'
        }
        maxWidth="max-w-5xl"
      >
        {modal?.type === 'channel' ? (
          <ChannelDetail row={modal.row} layerKey={modal.layerKey} />
        ) : modal?.type === 'pct' ? (
          <BudgetPieChart />
        ) : (
          <BudgetBreakdownChart />
        )}
      </Modal>
    </div>
  );
};

export default InteractiveMediaPlan;
