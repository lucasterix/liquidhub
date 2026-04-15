import { useMemo, MutableRefObject } from 'react';
import { Chart } from 'react-chartjs-2';
import type { Chart as ChartJS } from 'chart.js';
import './ChartRegistry';
import { useEffectiveData } from '../store/useDataStore';
import { computeCashSeries, useCurrencyCode } from '../lib/finance';
import { useT } from '../i18n/translations';
import { Palette, seriesColor, hexToRgba } from '../theme/palettes';
import { ChartConfig } from '../theme/useChartTheme';
import type { Period } from '../types';
import {
  baseCartesianOptions,
  buildSeriesDataset,
  resolveChartJsType,
  useUiChartTokens,
} from './chartHelpers';
import ChartCard from './ChartCard';

export const CHART_ID = 'liquidity';

type InnerProps = {
  periods: Period[];
  startingCash: number;
  palette: Palette;
  config: ChartConfig;
  chartRef: MutableRefObject<ChartJS | null>;
};

function LiquidityInner({ periods, startingCash, palette, config, chartRef }: InnerProps) {
  const cjsType = resolveChartJsType(config.chartType);
  const ui = useUiChartTokens();
  const cashSeries = useMemo(
    () => computeCashSeries(startingCash, periods),
    [startingCash, periods]
  );

  const data = useMemo(() => {
    const cashColor = seriesColor(palette, 0, config.customColors);
    const flowColor = seriesColor(palette, 1, config.customColors);
    const cashDataset = buildSeriesDataset({
      label: 'Cash Position',
      data: cashSeries,
      color: cashColor,
      type: config.chartType,
      tension: config.tension,
      pointRing: ui.pointRing,
    });
    if (cjsType === 'line' && config.chartType === 'area') {
      (cashDataset as Record<string, unknown>).backgroundColor = (ctx: {
        chart: { ctx: CanvasRenderingContext2D; chartArea?: { top: number; bottom: number } };
      }) => {
        const chart = ctx.chart;
        const { ctx: c, chartArea } = chart;
        if (!chartArea) return hexToRgba(cashColor, 0.2);
        const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        g.addColorStop(0, hexToRgba(cashColor, 0.45));
        g.addColorStop(1, hexToRgba(cashColor, 0.02));
        return g;
      };
    }
    const flowDataset = buildSeriesDataset({
      label: 'Net Cash Flow',
      data: periods.map((p) => p.cashIn - p.cashOut),
      color: flowColor,
      type: config.chartType,
      tension: config.tension,
      pointRing: ui.pointRing,
    });
    if (cjsType === 'line') {
      (flowDataset as Record<string, unknown>).borderDash = [6, 4];
      (flowDataset as Record<string, unknown>).fill = false;
    }
    return {
      labels: periods.map((p) => p.label),
      datasets: [cashDataset, flowDataset],
    };
  }, [periods, cashSeries, palette, config.chartType, config.tension, config.customColors, cjsType, ui.pointRing]);

  const options = baseCartesianOptions(palette, config, cjsType, ui);

  return (
    <Chart
      ref={chartRef as never}
      type={cjsType}
      data={data as never}
      options={options as never}
    />
  );
}

export default function LiquidityChart() {
  const { startingCash, periods } = useEffectiveData(CHART_ID);
  useCurrencyCode();
  const t = useT();

  const exportRows = () => {
    const cash = computeCashSeries(startingCash, periods);
    return periods.map((p, i) => ({
      label: p.label,
      cashIn: p.cashIn,
      cashOut: p.cashOut,
      netFlow: p.cashIn - p.cashOut,
      cashPosition: cash[i],
    }));
  };

  return (
    <ChartCard
      chartId={CHART_ID}
      title={t('chart.liquidity.title')}
      subtitle={t('chart.liquidity.subtitle')}
      defaults={{ chartType: 'area', beginAtZero: false }}
      availableTypes={['line', 'area', 'step-line', 'bar', 'horizontal-bar']}
      exportRows={exportRows}
    >
      {(args) => (
        <LiquidityInner periods={periods} startingCash={startingCash} {...args} />
      )}
    </ChartCard>
  );
}
