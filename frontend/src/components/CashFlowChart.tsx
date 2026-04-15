import { useMemo, MutableRefObject } from 'react';
import { Chart } from 'react-chartjs-2';
import type { Chart as ChartJS } from 'chart.js';
import './ChartRegistry';
import { useEffectiveData } from '../store/useDataStore';
import { Palette, seriesColor, hexToRgba } from '../theme/palettes';
import { ChartConfig } from '../theme/useChartTheme';
import type { Period } from '../types';
import {
  baseCartesianOptions,
  isStacked,
  resolveChartJsType,
} from './chartHelpers';
import ChartCard from './ChartCard';

export const CHART_ID = 'cash-flow';

type InnerProps = {
  periods: Period[];
  palette: Palette;
  config: ChartConfig;
  chartRef: MutableRefObject<ChartJS | null>;
};

function CashFlowInner({ periods, palette, config, chartRef }: InnerProps) {
  const cjsType = resolveChartJsType(config.chartType);
  const stacked = isStacked(config.chartType);

  const data = useMemo(() => {
    const inColor = seriesColor(palette, 0, config.customColors);
    const outColor = seriesColor(palette, 2, config.customColors);
    const labels = periods.map((p) => p.label);
    const datasets: Record<string, unknown>[] = [];
    if (cjsType === 'bar') {
      const cashIn = periods.map((p) => p.cashIn);
      // When stacked, we want in above / out below the zero line so
      // the stack keys differ; for non-stacked bar, show raw magnitudes.
      const cashOut = stacked
        ? periods.map((p) => -p.cashOut)
        : periods.map((p) => p.cashOut);
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
      const isArea = config.chartType === 'area';
      datasets.push(
        {
          label: 'Cash In',
          data: periods.map((p) => p.cashIn),
          borderColor: inColor,
          backgroundColor: hexToRgba(inColor, 0.35),
          borderWidth: 2.5,
          tension: config.chartType === 'step-line' ? 0 : config.tension,
          stepped: config.chartType === 'step-line' ? 'before' : false,
          fill: isArea ? 'origin' : false,
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
          tension: config.chartType === 'step-line' ? 0 : config.tension,
          stepped: config.chartType === 'step-line' ? 'before' : false,
          fill: isArea ? 'origin' : false,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: '#0b1120',
          pointBorderColor: outColor,
          pointBorderWidth: 2,
        }
      );
    }
    return { labels, datasets };
  }, [periods, palette, config.chartType, config.tension, config.customColors]);

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

export default function CashFlowChart() {
  const { periods } = useEffectiveData(CHART_ID);

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
      availableTypes={[
        'stacked-bar',
        'bar',
        'horizontal-bar',
        'horizontal-bar-stacked',
        'line',
        'area',
        'step-line',
      ]}
      exportRows={exportRows}
    >
      {(args) => <CashFlowInner periods={periods} {...args} />}
    </ChartCard>
  );
}
