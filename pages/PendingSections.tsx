import React from 'react';
import PendingSection from '../components/shared/PendingSection';
import ApexIcon from '../components/icons/ApexIcon';

// -----------------------------------------------------------------------------
// What a viewer sees instead of the one section that is still Hamilton Island.
//
// The Interactive Media Plan's placeholder was deleted on 2026-08-05 when the
// Lyka briefing workbook landed and the page was rebuilt with the real plan.
// APEX comes down the same way: when a Lyka Roy Morgan pull lands, delete this
// export and drop the `SHOW_ALL` ternary in App.tsx. pages/ApexBySpeed.tsx is
// UNTOUCHED and still wired, so that switch is a two line change.
//
// The nav still lists it, so the deck reads as six sections rather than five
// with one quietly missing. What changes is what opens.
//
// Internal review: append `?show=all` to the URL to get the real page back.
// -----------------------------------------------------------------------------

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
