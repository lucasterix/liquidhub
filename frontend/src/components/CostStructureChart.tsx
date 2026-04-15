import { useMemo, MutableRefObject } from 'react';
import { Chart } from 'react-chartjs-2';
import type { Chart as ChartJS } from 'chart.js';
import './ChartRegistry';
import { useEffectiveData } from '../store/useDataStore';
import { formatEUR, useCurrencyCode } from '../lib/finance';
import { useT } from '../i18n/translations';
import { Palette, seriesColor, hexToRgba } from '../theme/palettes';
import { ChartConfig } from '../theme/useChartTheme';
import type { Period } from '../types';
import { radialOptions, useUiChartTokens } from './chartHelpers';
import ChartCard from './ChartCard';

export const CHART_ID = 'cost-structure';

type InnerProps = {
  periods: Period[];
  palette: Palette;
  config: ChartConfig;
  chartRef: MutableRefObject<ChartJS | null>;
};

function CostStructureInner({ periods, palette, config, chartRef }: InnerProps) {
  const ui = useUiChartTokens();
  const cjsType: 'doughnut' | 'pie' | 'polarArea' =
    config.chartType === 'pie'
      ? 'pie'
      : config.chartType === 'polarArea'
      ? 'polarArea'
      : 'doughnut';

  const data = useMemo(() => {
    const labels = periods.map((p) => p.label);
    const values = periods.map((p) => p.costs);
    const colors = values.map((_, i) => seriesColor(palette, i, config.customColors));
    return {
      labels,
      datasets: [
        {
          label: 'Kosten',
          data: values,
          backgroundColor: colors.map((c) => hexToRgba(c, 0.85)),
          borderColor: colors,
          borderWidth: 2,
          hoverOffset: 8,
        },
      ],
    };
  }, [periods, palette, config.customColors]);

  const baseOpts = radialOptions(palette, config, ui);
  const opts = {
    ...baseOpts,
    ...(cjsType === 'doughnut' ? { cutout: '58%' } : {}),
    plugins: {
      ...baseOpts.plugins,
      tooltip: {
        ...(baseOpts.plugins?.tooltip ?? {}),
        callbacks: {
          label: (ctx: { label?: string; parsed: number | { r?: number } }) => {
            const parsed = typeof ctx.parsed === 'number' ? ctx.parsed : ctx.parsed.r ?? 0;
            const total = data.datasets[0].data.reduce((s, v) => s + v, 0);
            const pct = total > 0 ? ((parsed / total) * 100).toFixed(1) : '0.0';
            return `${ctx.label}: ${formatEUR(Number(parsed))} (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <Chart
      ref={chartRef as never}
      type={cjsType}
      data={data as never}
      options={opts as never}
    />
  );
}

export default function CostStructureChart() {
  const { periods } = useEffectiveData(CHART_ID);
  useCurrencyCode();
  const t = useT();

  const exportRows = () => {
    const total = periods.reduce((s, p) => s + p.costs, 0) || 1;
    return periods.map((p) => ({
      label: p.label,
      costs: p.costs,
      share: `${((p.costs / total) * 100).toFixed(1)}%`,
    }));
  };

  return (
    <ChartCard
      chartId={CHART_ID}
      title={t('chart.costStructure.title')}
      subtitle={t('chart.costStructure.subtitle')}
      defaults={{ chartType: 'doughnut', legendPosition: 'right' }}
      availableTypes={['doughnut', 'pie', 'polarArea']}
      exportRows={exportRows}
    >
      {(args) => <CostStructureInner periods={periods} {...args} />}
    </ChartCard>
  );
}
