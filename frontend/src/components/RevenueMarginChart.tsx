import { useMemo, MutableRefObject } from 'react';
import { Chart } from 'react-chartjs-2';
import type { Chart as ChartJS, ChartOptions, TooltipItem } from 'chart.js';
import './ChartRegistry';
import { useDataStore } from '../store/useDataStore';
import { formatEUR } from '../lib/finance';
import { Palette, seriesColor, hexToRgba } from '../theme/palettes';
import { ChartConfig } from '../theme/useChartTheme';
import type { Period } from '../types';
import ChartCard from './ChartCard';

const CHART_ID = 'revenue-margin';

type InnerProps = {
  periods: Period[];
  palette: Palette;
  config: ChartConfig;
  chartRef: MutableRefObject<ChartJS | null>;
};

function RevenueMarginInner({ periods, palette, config, chartRef }: InnerProps) {
  const data = useMemo(() => {
    const revColor = seriesColor(palette, 0);
    const marginColor = seriesColor(palette, 1);
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
  }, [periods, palette, config.tension]);

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
  const periods = useDataStore((s) => s.periods);

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
      title="Umsatz & Marge"
      subtitle="Umsatz pro Periode mit Margen-Linie"
      defaults={{ chartType: 'combo' }}
      exportRows={exportRows}
    >
      {(args) => <RevenueMarginInner periods={periods} {...args} />}
    </ChartCard>
  );
}
