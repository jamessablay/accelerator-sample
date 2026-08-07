import React from 'react';
import JourneyDetailTable from '../JourneyDetailTable';
import { JourneySubCategoryKey } from '../../../types';
import { isFocusCell } from '../../../data/mediaFocus';
import type { JourneySubCategory } from '../../../data/journeyDetailsData';
import type { JourneyVizProps } from './types';

// -----------------------------------------------------------------------------
// The existing 6-column table, wrapped to the shared contract.
//
// STILL THE BASELINE, and still not edited for the sake of it. This is what the
// other four views are measured against, so any change here has to come from the
// client rather than from tidying.
//
// THE ONE EXCEPTION IS THE MEDIA FOCUS WASH, requested on 2026-08-07. It is
// additive and defaulted: `JourneyDetailTable` called without `focusStages`
// renders exactly what it always did, so the baseline contract survives. THE
// DECISION LIVES HERE, NOT IN THE TABLE: the adapter resolves which stages this
// particular journey should mark, and the table only checks membership. That is
// why the table needs no import of `mediaFocus` and cannot disagree with the
// other four views about who is marked.
// -----------------------------------------------------------------------------

const TableAdapter: React.FC<JourneyVizProps> = ({ active }) => {
  const journey: JourneySubCategory = {
    key: JourneySubCategoryKey.MACRO_JOURNEY,
    title: active.meta.title,
    stages: active.stages,
  };
  const focusStages = active.stages
    .map((s) => s.title)
    .filter((title) => isFocusCell(active.type, title));

  return <JourneyDetailTable key={active.type} journey={journey} focusStages={focusStages} />;
};

export default TableAdapter;
