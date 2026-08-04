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

import DistributionSplit from './DistributionSplit';
import IncomeLadder from './IncomeLadder';
import FlatSharePenetration from './FlatSharePenetration';
import RetentionCuts from './RetentionCuts';
import CityLifecycle from './CityLifecycle';
import SeasonalIndex from './SeasonalIndex';
import TopRegionsRav from './TopRegionsRav';
import MmmConfidence from './MmmConfidence';
import BrandedSearchGap from './BrandedSearchGap';
import LapsedPool from './LapsedPool';

export const TEN_THINGS_CHARTS: Record<TenThingChartKey, TenThingChartComponent> = {
  distributionSplit: DistributionSplit,
  incomeLadder: IncomeLadder,
  flatShare: FlatSharePenetration,
  retentionCuts: RetentionCuts,
  cityLifecycle: CityLifecycle,
  seasonalIndex: SeasonalIndex,
  topRegionsRav: TopRegionsRav,
  mmmConfidence: MmmConfidence,
  brandedSearchGap: BrandedSearchGap,
  lapsedPool: LapsedPool,
};

export type { TenThingChartProps, TenThingChartComponent } from './types';
