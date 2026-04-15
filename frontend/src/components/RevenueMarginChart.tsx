import { useMemo, useCallback, MutableRefObject } from 'react';
import { Chart } from 'react-chartjs-2';
import type { Chart as ChartJS, ChartOptions, TooltipItem } from 'chart.js';
import './ChartRegistry';
import { useDataStore, useEffectiveData } from '../store/useDataStore';
import { formatEUR, useCurrencyCode } from '../lib/finance';
import { useT } from '../i18n/translations';
import { Palette, seriesColor, hexToRgba } from '../theme/palettes';
import { ChartConfig } from '../theme/useChartTheme';
import type { Period } from '../types';
import ChartCard from './ChartCard';
import { useChartDragEditor, DragHandler } from './useChartDragEditor';

export const CHART_ID = 'revenue-margin';

type SetRevenue = (dataIndex: number, value: number) => void;

type InnerProps = {
  periods: Period[];
  palette: Palette;
  config: ChartConfig;
  chartRef: MutableRefObject<ChartJS | null>;
  setRevenue: SetRevenue;
};

function RevenueMarginInner({ periods, palette, config, chartRef, setRevenue }: InnerProps) {
  const data = useMemo(() => {
    const revColor = seriesColor(palette, 0, config.customColors);
    const marginColor = seriesColor(palette, 1, config.customColors);
    const margins = periods.map((p) =>
      p.revenue > 0 ? ((p.revenue - p.costs) / p.revenue) * 100 : 0
    );
    return {
      labels: periods.map((p) => p.label),
      datasets: [
        {
          type: 'bar' as const,
          label: 'Umsatz',
          data: periods.map((p) => p.revenue),
          backgroundColor: hexToRgba(revColor, 0.85),
          borderRadius: 8,
          borderSkipped: false,
          maxBarThickness: 36,
          yAxisID: 'y',
          order: 2,
        },
        {
          type: 'line' as const,
          label: 'Marge (%)',
          data: margins,
          borderColor: marginColor,
          backgroundColor: hexToRgba(marginColor, 0.2),
          borderWidth: 2.5,
          tension: config.tension,
          fill: false,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#0b1120',
          pointBorderColor: marginColor,
          pointBorderWidth: 2,
          yAxisID: 'y1',
          order: 1,
        },
      ],
    };
  }, [periods, palette, config.tension, config.customColors]);

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        display: config.showLegend,
        position: config.legendPosition,
        labels: { color: '#9ba9c8', usePointStyle: true, padding: 16 },
      },
      tooltip: {
        backgroundColor: palette.tooltipBg,
        titleColor: '#e9eefb',
        bodyColor: '#9ba9c8',
        borderColor: palette.tooltipBorder,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx: TooltipItem<'bar'>) => {
            const v = Number(ctx.parsed.y);
            if (ctx.dataset.label?.includes('%')) return `${ctx.dataset.label}: ${v.toFixed(1)}%`;
            return `${ctx.dataset.label}: ${formatEUR(v)}`;
          },
        },
      },
    },
    scales: {
      x: { ticks: { color: '#9ba9c8' }, grid: { display: false } },
      y: {
        beginAtZero: config.beginAtZero,
        position: 'left',
        ticks: { color: '#9ba9c8', callback: (v) => formatEUR(Number(v)) },
        grid: { display: config.showGrid, color: palette.grid },
      },
      y1: {
        position: 'right',
        beginAtZero: true,
        ticks: { color: '#9ba9c8', callback: (v) => `${Number(v).toFixed(0)}%` },
        grid: { display: false },
      },
    },
  };

  const handlers: Array<DragHandler | null> = useMemo(
    () => [
      // Umsatz (bar)
      (i, v) => setRevenue(i, v),
      // Marge (%) — derived, not draggable
      null,
    ],
    [setRevenue]
  );
  useChartDragEditor(chartRef, handlers);

  return (
    <Chart
      ref={chartRef as never}
      type="bar"
      data={data as never}
      options={options as never}
    />
  );
}

export default function RevenueMarginChart() {
  const { periods, isOverridden } = useEffectiveData(CHART_ID);
  useCurrencyCode();
  const t = useT();
  const upsertPeriod = useDataStore((s) => s.upsertPeriod);
  const upsertChartPeriod = useDataStore((s) => s.upsertChartPeriod);

  const setRevenue = useCallback<SetRevenue>(
    (dataIndex, value) => {
      const patch: Partial<Period> = { revenue: value };
      if (isOverridden) upsertChartPeriod(CHART_ID, dataIndex, patch);
      else upsertPeriod(dataIndex, patch);
    },
    [isOverridden, upsertPeriod, upsertChartPeriod]
  );

  const exportRows = () =>
    periods.map((p) => ({
      label: p.label,
      revenue: p.revenue,
      costs: p.costs,
      profit: p.revenue - p.costs,
      marginPct: p.revenue > 0 ? ((p.revenue - p.costs) / p.revenue) * 100 : 0,
    }));

  return (
    <ChartCard
      chartId={CHART_ID}
      title={t('chart.revenueMargin.title')}
      subtitle={`${t('chart.revenueMargin.subtitle')} (${t('detail.dragHint')})`}
      defaults={{ chartType: 'combo' }}
      exportRows={exportRows}
    >
      {(args) => <RevenueMarginInner periods={periods} setRevenue={setRevenue} {...args} />}
    </ChartCard>
  );
}
