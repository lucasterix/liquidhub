import { useMemo, MutableRefObject } from 'react';
import { Chart } from 'react-chartjs-2';
import type { Chart as ChartJS } from 'chart.js';
import './ChartRegistry';
import { useDataStore } from '../store/useDataStore';
import { Palette, seriesColor, hexToRgba } from '../theme/palettes';
import { ChartConfig } from '../theme/useChartTheme';
import type { Period } from '../types';
import {
  baseCartesianOptions,
  resolveChartJsType,
} from './chartHelpers';
import ChartCard from './ChartCard';

const CHART_ID = 'cash-flow';

type InnerProps = {
  periods: Period[];
  palette: Palette;
  config: ChartConfig;
  chartRef: MutableRefObject<ChartJS | null>;
};

function CashFlowInner({ periods, palette, config, chartRef }: InnerProps) {
  const cjsType = resolveChartJsType(config.chartType);
  const stacked = config.chartType === 'stacked-bar' || config.chartType === 'area';

  const data = useMemo(() => {
    const inColor = seriesColor(palette, 0);
    const outColor = seriesColor(palette, 2);
    const labels = periods.map((p) => p.label);
    const cashIn = periods.map((p) => p.cashIn);
    const cashOut = periods.map((p) => -p.cashOut);
    const datasets: Record<string, unknown>[] = [];
    if (cjsType === 'bar') {
      datasets.push(
        {
          label: 'Cash In',
          data: cashIn,
          backgroundColor: hexToRgba(inColor, 0.85),
          borderRadius: 8,
          borderSkipped: false,
          maxBarThickness: 36,
          stack: 'flow',
        },
        {
          label: 'Cash Out',
          data: cashOut,
          backgroundColor: hexToRgba(outColor, 0.85),
          borderRadius: 8,
          borderSkipped: false,
          maxBarThickness: 36,
          stack: 'flow',
        }
      );
    } else {
      datasets.push(
        {
          label: 'Cash In',
          data: cashIn,
          borderColor: inColor,
          backgroundColor: hexToRgba(inColor, 0.35),
          borderWidth: 2.5,
          tension: config.tension,
          fill: config.chartType === 'area' ? 'origin' : false,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: '#0b1120',
          pointBorderColor: inColor,
          pointBorderWidth: 2,
        },
        {
          label: 'Cash Out',
          data: periods.map((p) => p.cashOut),
          borderColor: outColor,
          backgroundColor: hexToRgba(outColor, 0.35),
          borderWidth: 2.5,
          tension: config.tension,
          fill: config.chartType === 'area' ? 'origin' : false,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: '#0b1120',
          pointBorderColor: outColor,
          pointBorderWidth: 2,
        }
      );
    }
    return { labels, datasets };
  }, [periods, palette, config.chartType, config.tension]);

  const options = baseCartesianOptions(palette, config, cjsType) as Record<string, unknown>;
  if (stacked && options.scales) {
    const scales = options.scales as Record<string, Record<string, unknown>>;
    if (scales.x) scales.x.stacked = true;
    if (scales.y) scales.y.stacked = true;
  }

  return (
    <Chart
      ref={chartRef as never}
      type={cjsType}
      data={data as never}
      options={options as never}
    />
  );
}

export default function CashFlowChart() {
  const periods = useDataStore((s) => s.periods);

  const exportRows = () =>
    periods.map((p) => ({
      label: p.label,
      cashIn: p.cashIn,
      cashOut: p.cashOut,
      netFlow: p.cashIn - p.cashOut,
    }));

  return (
    <ChartCard
      chartId={CHART_ID}
      title="Cash Flow"
      subtitle="Zu- und Abflüsse pro Periode"
      defaults={{ chartType: 'stacked-bar' }}
      availableTypes={['stacked-bar', 'bar', 'line', 'area']}
      exportRows={exportRows}
    >
      {(args) => <CashFlowInner periods={periods} {...args} />}
    </ChartCard>
  );
}
