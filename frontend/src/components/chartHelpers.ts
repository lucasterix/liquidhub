import type { ChartOptions, TooltipItem } from 'chart.js';
import { Palette, hexToRgba } from '../theme/palettes';
import { ChartConfig, ChartTypeId } from '../theme/useChartTheme';
import { formatEUR } from '../lib/finance';
import { getChartTokens, useUiTheme, ChartTokens } from '../theme/useUiTheme';

export function resolveChartJsType(type: ChartTypeId): 'bar' | 'line' {
  if (type === 'line' || type === 'area' || type === 'step-line') return 'line';
  return 'bar';
}

export function isStacked(type: ChartTypeId): boolean {
  return type === 'stacked-bar' || type === 'horizontal-bar-stacked';
}

export function isHorizontal(type: ChartTypeId): boolean {
  return type === 'horizontal-bar' || type === 'horizontal-bar-stacked';
}

export function isFilledLine(type: ChartTypeId): boolean {
  return type === 'area';
}

export function isSteppedLine(type: ChartTypeId): boolean {
  return type === 'step-line';
}

export function useUiChartTokens(): ChartTokens {
  const mode = useUiTheme((s) => s.mode);
  return getChartTokens(mode);
}

type SeriesOpts = {
  label: string;
  data: number[];
  color: string;
  type: ChartTypeId;
  tension: number;
  stack?: string;
  pointRing?: string;
};

export function buildSeriesDataset(opts: SeriesOpts) {
  const { label, data, color, type, tension, stack, pointRing = '#0b1120' } = opts;
  const cjsType = resolveChartJsType(type);
  if (cjsType === 'line') {
    const stepped = isSteppedLine(type);
    return {
      label,
      data,
      borderColor: color,
      backgroundColor: hexToRgba(color, 0.22),
      borderWidth: 2.5,
      tension: stepped ? 0 : tension,
      stepped: stepped ? ('before' as const) : false,
      fill: isFilledLine(type),
      pointRadius: 3,
      pointHoverRadius: 5,
      pointBackgroundColor: pointRing,
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
  kind: 'bar' | 'line',
  ui: ChartTokens
): ChartOptions<'bar'> | ChartOptions<'line'> {
  const stacked = isStacked(config.chartType);
  const horizontal = isHorizontal(config.chartType);
  const valueAxis = {
    stacked,
    beginAtZero: config.beginAtZero,
    ticks: {
      color: ui.tick,
      callback: (v: string | number) => formatEUR(Number(v)),
    },
    grid: { display: config.showGrid, color: ui.grid },
  };
  const categoryAxis = {
    stacked,
    ticks: { color: ui.tick },
    grid: { display: false },
  };
  const opts: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x',
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        display: config.showLegend,
        position: config.legendPosition,
        labels: {
          color: ui.tick,
          usePointStyle: true,
          padding: 16,
          font: { size: 12, weight: 500 },
        },
      },
      tooltip: {
        backgroundColor: ui.tooltipBg,
        titleColor: ui.tooltipTitle,
        bodyColor: ui.tooltipBody,
        borderColor: palette.tooltipBorder ?? ui.tooltipBorder,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx: TooltipItem<'bar' | 'line'>) => {
            const raw = horizontal ? ctx.parsed.x : ctx.parsed.y;
            return `${ctx.dataset.label}: ${formatEUR(Number(raw))}`;
          },
        },
      },
    },
    scales: horizontal
      ? { x: valueAxis, y: categoryAxis }
      : { x: categoryAxis, y: valueAxis },
  };
  return kind === 'bar'
    ? (opts as ChartOptions<'bar'>)
    : (opts as ChartOptions<'line'>);
}

export function radialOptions(
  palette: Palette,
  config: ChartConfig,
  ui: ChartTokens
): ChartOptions<'doughnut' | 'pie' | 'polarArea'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: config.showLegend,
        position: config.legendPosition,
        labels: {
          color: ui.tick,
          usePointStyle: true,
          padding: 14,
          font: { size: 12, weight: 500 },
        },
      },
      tooltip: {
        backgroundColor: ui.tooltipBg,
        titleColor: ui.tooltipTitle,
        bodyColor: ui.tooltipBody,
        borderColor: palette.tooltipBorder ?? ui.tooltipBorder,
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
