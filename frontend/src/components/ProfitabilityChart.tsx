import { useMemo, MutableRefObject } from 'react';
import { Chart } from 'react-chartjs-2';
import type { Chart as ChartJS } from 'chart.js';
import './ChartRegistry';
import { useEffectiveData } from '../store/useDataStore';
import { Palette, seriesColor } from '../theme/palettes';
import { ChartConfig } from '../theme/useChartTheme';
import type { Period } from '../types';
import {
  baseCartesianOptions,
  buildSeriesDataset,
  isStacked,
  resolveChartJsType,
} from './chartHelpers';
import ChartCard from './ChartCard';

export const CHART_ID = 'profitability';

type InnerProps = {
  periods: Period[];
  palette: Palette;
  config: ChartConfig;
  chartRef: MutableRefObject<ChartJS | null>;
};

function ProfitabilityInner({ periods, palette, config, chartRef }: InnerProps) {
  const cjsType = resolveChartJsType(config.chartType);
  const stacked = isStacked(config.chartType);

  const data = useMemo(() => {
    const labels = periods.map((p) => p.label);
    const revenue = periods.map((p) => p.revenue);
    const costs = periods.map((p) => p.costs);
    const profit = periods.map((p) => p.revenue - p.costs);

    if (stacked) {
      // Revenue = Costs + Profit. Stack costs + profit so the total
      // bar height equals the revenue, avoiding double-counting.
      return {
        labels,
        datasets: [
          buildSeriesDataset({
            label: 'Kosten',
            data: costs,
            color: seriesColor(palette, 2, config.customColors),
            type: config.chartType,
            tension: config.tension,
            stack: 'rev',
          }),
          buildSeriesDataset({
            label: 'Gewinn',
            data: profit,
            color: seriesColor(palette, 1, config.customColors),
            type: config.chartType,
            tension: config.tension,
            stack: 'rev',
          }),
        ],
      };
    }

    return {
      labels,
      datasets: [
        buildSeriesDataset({
          label: 'Umsatz',
          data: revenue,
          color: seriesColor(palette, 0, config.customColors),
          type: config.chartType,
          tension: config.tension,
        }),
        buildSeriesDataset({
          label: 'Kosten',
          data: costs,
          color: seriesColor(palette, 2, config.customColors),
          type: config.chartType,
          tension: config.tension,
        }),
        buildSeriesDataset({
          label: 'Gewinn',
          data: profit,
          color: seriesColor(palette, 1, config.customColors),
          type: config.chartType,
          tension: config.tension,
        }),
      ],
    };
  }, [periods, palette, config.chartType, config.tension, config.customColors, stacked]);

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
  const { periods } = useEffectiveData(CHART_ID);

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
      availableTypes={[
        'bar',
        'stacked-bar',
        'horizontal-bar',
        'horizontal-bar-stacked',
        'line',
        'area',
        'step-line',
      ]}
      exportRows={exportRows}
    >
      {(args) => <ProfitabilityInner periods={periods} {...args} />}
    </ChartCard>
  );
}
