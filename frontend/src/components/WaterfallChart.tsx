import { useMemo, MutableRefObject } from 'react';
import { Chart } from 'react-chartjs-2';
import type { Chart as ChartJS, ChartOptions, TooltipItem } from 'chart.js';
import './ChartRegistry';
import { useEffectiveData } from '../store/useDataStore';
import { formatEUR, useCurrencyCode } from '../lib/finance';
import { useT } from '../i18n/translations';
import { Palette, seriesColor, hexToRgba } from '../theme/palettes';
import { ChartConfig } from '../theme/useChartTheme';
import type { Period } from '../types';
import ChartCard from './ChartCard';

export const CHART_ID = 'waterfall';

type InnerProps = {
  periods: Period[];
  palette: Palette;
  config: ChartConfig;
  chartRef: MutableRefObject<ChartJS | null>;
};

type WaterfallStep = {
  label: string;
  from: number;
  to: number;
  kind: 'start' | 'positive' | 'negative' | 'total';
  absolute: number;
};

function buildSteps(periods: Period[]): WaterfallStep[] {
  const steps: WaterfallStep[] = [];
  let running = 0;
  for (const p of periods) {
    const profit = p.revenue - p.costs;
    const from = running;
    running += profit;
    steps.push({
      label: p.label,
      from,
      to: running,
      kind: profit >= 0 ? 'positive' : 'negative',
      absolute: profit,
    });
  }
  steps.push({ label: 'Gesamt', from: 0, to: running, kind: 'total', absolute: running });
  return steps;
}

function WaterfallInner({ periods, palette, config, chartRef }: InnerProps) {
  const steps = useMemo(() => buildSteps(periods), [periods]);

  const data = useMemo(() => {
    const totalColor = seriesColor(palette, 0, config.customColors);
    const posColor =
      config.customColors?.[1] && /^#[0-9a-fA-F]{3,8}$/.test(config.customColors[1])
        ? config.customColors[1]
        : palette.positive;
    const negColor =
      config.customColors?.[2] && /^#[0-9a-fA-F]{3,8}$/.test(config.customColors[2])
        ? config.customColors[2]
        : palette.negative;
    const colorFor = (s: WaterfallStep) => {
      if (s.kind === 'total' || s.kind === 'start') return totalColor;
      return s.kind === 'positive' ? posColor : negColor;
    };
    return {
      labels: steps.map((s) => s.label),
      datasets: [
        {
          label: 'Gewinn-Entwicklung',
          data: steps.map((s) => [s.from, s.to] as [number, number]),
          backgroundColor: steps.map((s) => hexToRgba(colorFor(s), 0.85)),
          borderColor: steps.map((s) => colorFor(s)),
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: 48,
        },
      ],
    };
  }, [steps, palette, config.customColors]);

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
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
            const step = steps[ctx.dataIndex];
            if (step.kind === 'start') return 'Startpunkt';
            if (step.kind === 'total') return `Gesamt: ${formatEUR(step.to)}`;
            const sign = step.absolute >= 0 ? '+' : '';
            return `${step.label}: ${sign}${formatEUR(step.absolute)} → ${formatEUR(step.to)}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#9ba9c8' },
        grid: { display: false },
      },
      y: {
        beginAtZero: config.beginAtZero,
        ticks: { color: '#9ba9c8', callback: (v) => formatEUR(Number(v)) },
        grid: { display: config.showGrid, color: palette.grid },
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

export default function WaterfallChart() {
  const { periods } = useEffectiveData(CHART_ID);
  useCurrencyCode();
  const t = useT();

  const exportRows = () => {
    const steps = buildSteps(periods);
    return steps.map((s) => ({
      label: s.label,
      kind: s.kind,
      delta: s.absolute,
      running: s.to,
    }));
  };

  return (
    <ChartCard
      chartId={CHART_ID}
      title={t('chart.waterfall.title')}
      subtitle={t('chart.waterfall.subtitle')}
      defaults={{ chartType: 'waterfall', showLegend: false }}
      exportRows={exportRows}
    >
      {(args) => <WaterfallInner periods={periods} {...args} />}
    </ChartCard>
  );
}
