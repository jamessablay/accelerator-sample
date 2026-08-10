// -----------------------------------------------------------------------------
// The chart registry.
//
// This file imports React components, which is why it lives in components/ and
// not in data/. data/tenThingsData.ts references a chart by a STRING KEY and
// stays free of React, the same contract brand.ts and type.ts carry.
//
// A key with no entry here renders an empty frame with NO ERROR. That is the
// same silent failure SEGMENT_COLORS and SEGMENT_IMAGES have, so
// data/__integrity.ts asserts this join on every dev page load.
// -----------------------------------------------------------------------------

import type { TenThingChartKey } from '../../../data/tenThingsData';
import type { TenThingChartComponent } from './types';

// THREE KEYS WERE RENAMED WITH THE DOG OWNER REDRAW (2026-08-10), because each
// was named for a measure its chart no longer plots: `cityLifecycle` is not a
// lifecycle any more (it stopped being a bubble of penetration against tenure),
// `topRegionsRav` does not plot RAV, and `lapsedPool` is not a pool by decile.
// Leaving a join key naming the wrong measure is how a reader ends up trusting
// the name over the chart. Check 9 catches a stale key on the next dev load, so
// the rename is safe to make in one pass across this file, the
// `TenThingChartKey` union and each point's `chart` field.
import DistributionSplit from './DistributionSplit';
import IncomeLadder from './IncomeLadder';
import FlatSharePenetration from './FlatSharePenetration';
import RetentionCuts from './RetentionCuts';
import CityReach from './CityReach';
import SeasonalIndex from './SeasonalIndex';
import TopRegionsReach from './TopRegionsReach';
import MmmConfidence from './MmmConfidence';
import BrandedSearchGap from './BrandedSearchGap';
import LapsedVsActive from './LapsedVsActive';

export const TEN_THINGS_CHARTS: Record<TenThingChartKey, TenThingChartComponent> = {
  distributionSplit: DistributionSplit,
  incomeLadder: IncomeLadder,
  flatShare: FlatSharePenetration,
  retentionCuts: RetentionCuts,
  cityReach: CityReach,
  seasonalIndex: SeasonalIndex,
  topRegionsReach: TopRegionsReach,
  mmmConfidence: MmmConfidence,
  brandedSearchGap: BrandedSearchGap,
  lapsedVsActive: LapsedVsActive,
};

export type { TenThingChartProps, TenThingChartComponent } from './types';
