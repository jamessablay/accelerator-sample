import React, { useCallback, useState } from 'react';
import MacroBlockPlan from '../components/mediaplan/MacroBlockPlan';
import BudgetBreakdownChart from '../components/mediaplan/BudgetBreakdownChart';
import BudgetPieChart from '../components/mediaplan/BudgetPieChart';
import ChannelDetail from '../components/mediaplan/ChannelDetail';
import Modal from '../components/shared/Modal';
import { PLAN_LAYERS, MediaRow, LayerKey, TOTAL_BUDGET, MEDIA_TOTAL, PRODUCTION } from '../data/mediaPlanData';

type ModalState =
  | { type: 'budget' }
  | { type: 'pct' }
  | { type: 'channel'; row: MediaRow; layerKey: LayerKey }
  | null;

const layerKeyForRow = (row: MediaRow): LayerKey =>
  (PLAN_LAYERS.find((l) => l.rows.includes(row))?.key ?? 'Active Consideration');

const KpiCard: React.FC<{ label: string; value: string; sub?: string }> = ({ label, value, sub }) => (
  <div className="rounded-xl border bg-white px-4 py-3 shadow-sm" style={{ borderColor: 'var(--lyka-mint)' }}>
    <p className="text-[11px] font-bold uppercase tracking-wide font-mono" style={{ color: 'var(--lyka-muted)' }}>{label}</p>
    <p className="mt-1 text-2xl md:text-3xl font-display" style={{ color: 'var(--lyka-teal-deep)' }}>{value}</p>
    {sub && <p className="text-[11px]" style={{ color: 'var(--lyka-mint-muted)' }}>{sub}</p>}
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
        <h1 className="text-4xl md:text-5xl font-display" style={{ color: 'var(--lyka-teal-deep)' }}>
          Interactive Media Plan
        </h1>
        <p className="mt-3 text-base md:text-xl text-[#143C33] max-w-4xl">
          FY26 macro block plan. Click any flighting bar for the channel detail, or the Budget header for the stacked monthly breakdown.
        </p>
      </header>

      {/* KPI strip */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total budget" value={`$${(TOTAL_BUDGET / 1_000_000).toFixed(1)}M`} sub="Incl. production" />
        <KpiCard label="Working media" value={`$${(MEDIA_TOTAL / 1_000_000).toFixed(2)}M`} />
        <KpiCard label="Production" value={`$${(PRODUCTION / 1000).toFixed(0)}k`} sub="Content production" />
        <KpiCard label="Flight" value="Nov ▸ Oct" sub="12 month FY26" />
      </div>

      <div className="mt-6">
        <MacroBlockPlan onSelectChannel={handleSelectChannel} onShowBudget={handleShowBudget} onShowPct={handleShowPct} />
      </div>

      <p className="mt-3 text-sm font-semibold text-[#143C33]">
        Total: ${(MEDIA_TOTAL / 1_000_000).toFixed(2)}M working media + ${(PRODUCTION / 1000).toFixed(0)}k production = ${(TOTAL_BUDGET / 1_000_000).toFixed(1)}M
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
            ? modal.layerKey
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
