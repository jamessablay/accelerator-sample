import React from 'react';
import PendingSection from '../components/shared/PendingSection';
import ApexIcon from '../components/icons/ApexIcon';
import CalendarAltIcon from '../components/icons/CalendarAltIcon';

// -----------------------------------------------------------------------------
// What a viewer sees instead of the two sections that are still Hamilton Island.
//
// ONE FILE FOR BOTH, on purpose: they exist because of a single decision and
// they come down together. When a Lyka brief and a Lyka Roy Morgan pull land,
// delete the matching export here and drop the `SHOW_ALL` branch in App.tsx.
// pages/InteractiveMediaPlan.tsx and pages/ApexBySpeed.tsx are UNTOUCHED and
// still wired, so that switch is a two line change with nothing to rebuild.
//
// The nav still lists both, so the deck reads as six sections rather than four
// with two quietly missing. What changes is what opens.
//
// Internal review: append `?show=all` to the URL to get the real pages back.
// -----------------------------------------------------------------------------

/** Replaces pages/InteractiveMediaPlan.tsx until a Lyka brief lands. */
export const MediaPlanPending: React.FC = () => (
  <PendingSection
    title="Interactive Media Plan"
    subtitle="Where the money goes, by funnel stage, channel and month."
    icon={<CalendarAltIcon />}
    heading="The plan, once there is a Lyka brief to plan against"
    body={
      <>
        This page is a working macro block plan: a funnel stage grid of channels with monthly
        flighting, budget and share of spend, and a chart behind every number. It is built and
        it runs. What it does not yet have is Lyka&apos;s brief, so it is held back rather than
        shown against another client&apos;s figures.
      </>
    }
    items={[
      'Funnel stage grid with monthly flighting bars',
      'Budget and share of media per channel',
      'Channel pop-ups: rationale and execution',
      'Creative examples, click to enlarge',
      'Stacked monthly spend by channel',
      'Budget allocation by channel',
    ]}
    needs={
      <>
        One Lyka media brief: the channel list, the monthly flighting and the budget split by
        funnel stage. The grid, the gantt derivation and the three charts all recompute from it.
      </>
    }
  />
);

/** Replaces pages/ApexBySpeed.tsx until a Lyka Roy Morgan pull lands. */
export const ApexPending: React.FC = () => (
  <PendingSection
    title="APEX by SPEED"
    subtitle="The SPEED media channel scorecard. Three independent data sources combined into one True Net Worth Indicator."
    icon={<ApexIcon />}
    heading="The scorecard, once it is scoring a Lyka audience"
    body={
      <>
        The methodology is SPEED&apos;s and carries over unchanged. The audience behind it does not:
        the tables currently hold a prior travel audience, so the page is held back rather than
        presenting affluent traveller media consumption as dog owner media consumption.
      </>
    }
    items={[
      'Thirteen channels, ranked by True Net Worth',
      'Heavy reach and Roy Morgan index per channel',
      'Known and Natural Fit channel constants',
      'Trade Desk addressability multiplier',
      'Three methods, scored side by side',
      'Row hover: the logic behind every pill',
    ]}
    needs={
      <>
        One Roy Morgan Single Source pull against agreed Lyka audience definitions: 13 channels,
        heavy reach percentage and index, two audiences. Every other column recomputes from those
        26 pairs.
      </>
    }
  />
);
