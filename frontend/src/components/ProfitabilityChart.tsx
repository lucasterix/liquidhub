import { useMemo, MutableRefObject } from 'react';
import { Chart } from 'react-chartjs-2';
import type { Chart as ChartJS } from 'chart.js';
import './ChartRegistry';
import { useDataStore } from '../store/useDataStore';
import { Palette, seriesColor } from '../theme/palettes';
import { ChartConfig } from '../theme/useChartTheme';
import type { Period } from '../types';
import {
  baseCartesianOptions,
  buildSeriesDataset,
  resolveChartJsType,
} from './chartHelpers';
import ChartCard from './ChartCard';

const CHART_ID = 'profitability';

type InnerProps = {
  periods: Period[];
  palette: Palette;
  config: ChartConfig;
  chartRef: MutableRefObject<ChartJS | null>;
};

function ProfitabilityInner({ periods, palette, config, chartRef }: InnerProps) {
  const cjsType = resolveChartJsType(config.chartType);

  const data = useMemo(
    () => ({
      labels: periods.map((p) => p.label),
      datasets: [
        buildSeriesDataset({
          label: 'Umsatz',
          data: periods.map((p) => p.revenue),
          color: seriesColor(palette, 0),
          type: config.chartType,
          tension: config.tension,
          fill: config.fill,
          stack: 'a',
        }),
        buildSeriesDataset({
          label: 'Kosten',
          data: periods.map((p) => p.costs),
          color: seriesColor(palette, 2),
          type: config.chartType,
          tension: config.tension,
          fill: config.fill,
          stack: 'b',
        }),
        buildSeriesDataset({
          label: 'Gewinn',
          data: periods.map((p) => p.revenue - p.costs),
          color: seriesColor(palette, 1),
          type: config.chartType,
          tension: config.tension,
          fill: config.fill,
          stack: 'c',
        }),
      ],
    }),
    [periods, palette, config.chartType, config.tension, config.fill]
  );

  const options = baseCartesianOptions(palette, config, cjsType);

  return (
    <Chart
      ref={chartRef as never}
      type={cjsType}
      data={data as never}
      options={options as never}
    />
  );
}

export default function ProfitabilityChart() {
  const periods = useDataStore((s) => s.periods);

  const exportRows = () =>
    periods.map((p) => ({
      label: p.label,
      revenue: p.revenue,
      costs: p.costs,
      profit: p.revenue - p.costs,
    }));

  return (
    <ChartCard
      chartId={CHART_ID}
      title="Profitability Forecast"
      subtitle="Umsatz, Kosten und Gewinn pro Periode"
      defaults={{ chartType: 'bar' }}
      availableTypes={['bar', 'stacked-bar', 'line', 'area']}
      exportRows={exportRows}
    >
      {(args) => <ProfitabilityInner periods={periods} {...args} />}
    </ChartCard>
  );
}
