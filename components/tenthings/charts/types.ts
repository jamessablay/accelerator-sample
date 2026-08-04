import type React from 'react';

/**
 * Every Ten Things chart takes the same single prop.
 *
 * Numeric series come from data/tenThingsSeries.ts, not from props, so a chart
 * cannot be handed the wrong numbers. `discrepancy` is the one thing the record
 * knows and the chart does not: it is set when the card stat and the chart do
 * not agree, and the frame renders it visibly.
 */
export interface TenThingChartProps {
  discrepancy?: string;
}

export type TenThingChartComponent = React.FC<TenThingChartProps>;
