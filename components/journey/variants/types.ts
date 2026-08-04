import type React from 'react';
import type { JourneyType } from '../../../types';
import type { JourneyMetrics } from '../../../data/journeyModel';

// -----------------------------------------------------------------------------
// One contract, five views of the same five journeys.
// -----------------------------------------------------------------------------

export type JourneyVariantId = 'table' | 'spine' | 'tension' | 'strip' | 'matrix';

export interface JourneyVizProps {
  /** All five, ordered up the readiness ladder. `tension` and `matrix` use them all. */
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
  /**
   * True when the view shows all five journeys at once.
   *
   * DECLARED AND DELIBERATELY NOT READ. The comment here used to say the tab
   * strip is redundant for such a view; the host has now rejected that twice.
   * Everything above the strip is `active` derived (the h1, the behaviour change
   * task, the journey dynamic), so hiding it leaves an unexplained 30px persona
   * name over a grid of five, and it would freeze `tension`'s active ring on the
   * default with no control to move it. The strip usefully chooses which card is
   * ringed and which matrix row is highlighted. Kept as a description of the
   * view, not as an instruction to the host.
   */
  showsAllJourneys: boolean;
  Component: React.FC<JourneyVizProps>;
}
