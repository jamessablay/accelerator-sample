import React, { useMemo } from 'react';
import { Bubble } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import { TEN_THINGS, LYKA, CHART_SEPARATOR } from '../../../data/brand';
import { CITY_LIFECYCLE } from '../../../data/tenThingsSeries';
import { useElementSize } from '../../../hooks/useElementSize';
import TenThingsChart from '../TenThingsChart';
import { BASE_OPTIONS, BASE_PLUGINS, valAxis } from './chartBase';
import { bubbleLabels } from './chartPlugins';
import type { TenThingChartProps } from './types';

// -----------------------------------------------------------------------------
// Point 05. Transcribed. A bubble chart is the right instrument for three
// variables and there is no simpler form that keeps all three.
//
// ONE FIX: THE RADIUS SCALES. Chart.js bubble `r` is device pixels, not data
// units, so a hardcoded radius that is proportionate at 900px is grotesque at
// 420px. K is derived from the measured container and clamped 14 to 30, the same
// "measure the box, clamp, fall back below a minimum" pattern the persona
// variant views use.
//
// AREA, NOT RADIUS, encodes the active base: r = K * sqrt(active / maxActive).
// Scaling the radius linearly would make Sydney look about 8 times Adelaide when
// it is 7.6 times by count but would read as roughly 58 times by area.
//
// Below MIN_CHART_WIDTH the bubbles collide whatever K is, so the chart hands
// over to the numbers table rather than rendering something unreadable.
// -----------------------------------------------------------------------------

const MIN_CHART_WIDTH = 380;
const R_MIN = 14;
const R_MAX = 30;

const MAX_ACTIVE = Math.max(...CITY_LIFECYCLE.map((c) => c.active));

const cityLabels = bubbleLabels({
  fmt: (i) => CITY_LIFECYCLE[i]?.city ?? '',
  halo: LYKA.pageBg,
});

const CityLifecycle: React.FC<TenThingChartProps> = ({ discrepancy }) => {
  const [measureRef, measured] = useElementSize<HTMLDivElement>();
  const width = measured?.width ?? 0;
  const tooNarrow = width > 0 && width < MIN_CHART_WIDTH;

  /** Largest bubble radius, derived from the box. Clamped so it never dominates. */
  const rMax = useMemo(() => {
    if (!width) return 24;
    return Math.max(R_MIN, Math.min(R_MAX, width / 26));
  }, [width]);

  const data = useMemo<ChartData<'bubble'>>(
    () => ({
      datasets: [
        {
          label: 'Capital city',
          data: CITY_LIFECYCLE.map((c) => ({
            x: c.penetration,
            y: c.tenureDays,
            r: rMax * Math.sqrt(c.active / MAX_ACTIVE),
          })),
          backgroundColor: TEN_THINGS.bubbleFill,
          borderColor: TEN_THINGS.seriesInk,
          borderWidth: 1.5,
          hoverBackgroundColor: TEN_THINGS.seriesInk,
          hoverBorderColor: CHART_SEPARATOR,
        },
      ],
    }),
    [rMax],
  );

  const options = useMemo<ChartOptions<'bubble'>>(
    () => ({
      ...BASE_OPTIONS,
      layout: { padding: { top: 34, right: 30, left: 8, bottom: 4 } },
      interaction: { mode: 'point', intersect: true },
      scales: {
        x: valAxis({
          min: 0.55,
          max: 1.72,
          title: 'Penetration: active customers per 100 households',
          tick: (v) => v.toFixed(1),
        }),
        y: valAxis({ min: 208, max: 274, title: 'Average tenure: days' }),
      },
      plugins: {
        ...BASE_PLUGINS,
        legend: { display: false },
        tooltip: {
          ...BASE_PLUGINS.tooltip,
          callbacks: {
            title: (items) => CITY_LIFECYCLE[items[0]?.dataIndex ?? 0]?.city ?? '',
            label: (c) => {
              const city = CITY_LIFECYCLE[c.dataIndex];
              if (!city) return '';
              return [
                `Penetration: ${city.penetration.toFixed(2)} per 100 households`,
                `Average tenure: ${city.tenureDays} days`,
                `Active customers: ${city.active.toLocaleString('en-AU')}`,
              ];
            },
          },
        },
      },
    }),
    [],
  );

  return (
    <TenThingsChart
      eyebrow="Life stage"
      title="Each capital is at a different point in the same lifecycle"
      subtitle="Penetration against tenure. Bubble area is the active customer base."
      height={340}
      discrepancy={discrepancy}
      truncatedAxis="Neither axis starts at zero. Both are framed to the range of the five capitals, so distances between cities are readable but bubble positions are not proportional to their values."
      caption={
        <>
          Brisbane is the outlier worth noticing: it out penetrates Sydney at 1.55 against 1.49, on
          a base a quarter the size. Melbourne loses to Sydney in every multicultural band while
          being the less multicultural city, so composition works in its favour and performance
          does not.
        </>
      }
    >
      <div ref={measureRef} className="relative h-full w-full">
        {tooNarrow ? (
          <div className="flex h-full items-center justify-center px-4 text-center">
            <p className="text-body" style={{ color: LYKA.muted }}>
              The bubble chart needs more width than this. The five capitals and their figures are
              in the numbers table below.
            </p>
          </div>
        ) : (
          <Bubble
            data={data}
            options={options}
            plugins={[cityLabels]}
            aria-label="Bubble chart of five Australian capitals. The horizontal axis is penetration, active customers per 100 households. The vertical axis is average tenure in days. Bubble area is the active customer base. Sydney sits top right at 1.49 penetration and 260 days with 26,121 active. Brisbane is further right at 1.55 and 250 days but far smaller at 6,717 active. Melbourne is at 1.20 and 243 days with 19,687. Perth is at 0.99 and 221 days with 7,142. Adelaide is bottom left at 0.68 and 219 days with 3,439."
          />
        )}
      </div>
    </TenThingsChart>
  );
};

export default CityLifecycle;
