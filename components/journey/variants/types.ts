import type React from 'react';
import type { JourneyType } from '../../../types';
import type { JourneyMetrics } from '../../../data/journeyModel';

// -----------------------------------------------------------------------------
// One contract, four views of the same five journeys.
// -----------------------------------------------------------------------------

export type JourneyVariantId = 'table' | 'spine' | 'tension' | 'strip';

export interface JourneyVizProps {
  /** All five, ordered up the readiness ladder. Only `tension` uses them all. */
  journeys: JourneyMetrics[];
  /** The journey currently selected in the tab strip. */
  active: JourneyMetrics;
  onSelectJourney: (type: JourneyType) => void;
  /** Jump to another view. `tension` uses it to hand off into `spine`. */
  onRequestVariant?: (id: JourneyVariantId) => void;
}

export interface JourneyVariantDef {
  id: JourneyVariantId;
  label: string;
  hint: string;
  /**
   * False renders the 90 word journey-dynamic paragraph inline, as the original
   * page does. True moves it behind a disclosure, which is most of the header
   * height saved. The baseline keeps it inline so the comparison is fair.
   */
  compactHeader: boolean;
  /** True when the view shows all five journeys, so the tab strip is redundant. */
  showsAllJourneys: boolean;
  Component: React.FC<JourneyVizProps>;
}
