import React from 'react';
import JourneyDetailTable from '../JourneyDetailTable';
import { JourneySubCategoryKey } from '../../../types';
import type { JourneySubCategory } from '../../../data/journeyDetailsData';
import type { JourneyVizProps } from './types';

// -----------------------------------------------------------------------------
// The existing 6-column table, wrapped to the shared contract.
//
// UNTOUCHED ON PURPOSE. This is the baseline the other three views are being
// measured against, and editing it would invalidate the comparison. The adapter
// only rebuilds the JourneySubCategory shape the table expects, because
// JourneyMetrics flattens `stages` up one level.
// -----------------------------------------------------------------------------

const TableAdapter: React.FC<JourneyVizProps> = ({ active }) => {
  const journey: JourneySubCategory = {
    key: JourneySubCategoryKey.MACRO_JOURNEY,
    title: active.meta.title,
    stages: active.stages,
  };
  return <JourneyDetailTable key={active.type} journey={journey} />;
};

export default TableAdapter;
