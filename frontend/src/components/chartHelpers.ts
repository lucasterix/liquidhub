import type { ChartOptions, TooltipItem } from 'chart.js';
import { Palette, hexToRgba } from '../theme/palettes';
import { ChartConfig, ChartTypeId } from '../theme/useChartTheme';
import { formatEUR } from '../lib/finance';

export function resolveChartJsType(type: ChartTypeId): 'bar' | 'line' {
  if (type === 'line' || type === 'area') return 'line';
  return 'bar';
}

export function isStacked(type: ChartTypeId): boolean {
  return type === 'stacked-bar';
}

export function isFilledLine(type: ChartTypeId, fillToggle: boolean): boolean {
  if (type === 'area') return true;
  if (type === 'line') return fillToggle;
  return false;
}

type SeriesOpts = {
  label: string;
  data: number[];
  color: string;
  type: ChartTypeId;
  tension: number;
  fill: boolean;
  stack?: string;
};

export function buildSeriesDataset(opts: SeriesOpts) {
  const { label, data, color, type, tension, fill, stack } = opts;
  const cjsType = resolveChartJsType(type);
  if (cjsType === 'line') {
    return {
      label,
      data,
      borderColor: color,
      backgroundColor: hexToRgba(color, 0.22),
      borderWidth: 2.5,
      tension,
      fill: isFilledLine(type, fill),
      pointRadius: 3,
      pointHoverRadius: 5,
      pointBackgroundColor: '#0b1120',
      pointBorderColor: color,
      pointBorderWidth: 2,
    };
  }
  return {
    label,
    data,
    backgroundColor: hexToRgba(color, 0.85),
    borderColor: color,
    borderWidth: 0,
    borderRadius: 8,
    borderSkipped: false,
    maxBarThickness: 36,
    stack,
  };
}

export function baseCartesianOptions(
  palette: Palette,
  config: ChartConfig,
  kind: 'bar' | 'line'
): ChartOptions<'bar'> | ChartOptions<'line'> {
  const stacked = isStacked(config.chartType);
  const opts: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        display: config.showLegend,
        position: config.legendPosition,
        labels: {
          color: '#9ba9c8',
          usePointStyle: true,
          padding: 16,
          font: { size: 12, weight: 500 },
        },
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
          label: (ctx: TooltipItem<'bar' | 'line'>) =>
            `${ctx.dataset.label}: ${formatEUR(Number(ctx.parsed.y))}`,
        },
      },
    },
    scales: {
      x: {
        stacked,
        ticks: { color: '#9ba9c8' },
        grid: { display: false },
      },
      y: {
        stacked,
        beginAtZero: config.beginAtZero,
        ticks: {
          color: '#9ba9c8',
          callback: (v) => formatEUR(Number(v)),
        },
        grid: { display: config.showGrid, color: palette.grid },
      },
    },
  };
  return kind === 'bar'
    ? (opts as ChartOptions<'bar'>)
    : (opts as ChartOptions<'line'>);
}

export function radialOptions(palette: Palette, config: ChartConfig): ChartOptions<'doughnut' | 'pie' | 'polarArea'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: config.showLegend,
        position: config.legendPosition,
        labels: {
          color: '#9ba9c8',
          usePointStyle: true,
          padding: 14,
          font: { size: 12, weight: 500 },
        },
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
          label: (ctx) => `${ctx.label}: ${formatEUR(Number(ctx.parsed))}`,
        },
      },
    },
  };
}
