import { useMemo, useCallback, MutableRefObject } from 'react';
import { Chart } from 'react-chartjs-2';
import type { Chart as ChartJS } from 'chart.js';
import './ChartRegistry';
import { useDataStore, useEffectiveData } from '../store/useDataStore';
import { useCurrencyCode } from '../lib/finance';
import { useT } from '../i18n/translations';
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
import { useChartDragEditor, DragHandler } from './useChartDragEditor';

export const CHART_ID = 'profitability';

type SetField = (dataIndex: number, field: keyof Period, value: number) => void;

type InnerProps = {
  periods: Period[];
  palette: Palette;
  config: ChartConfig;
  chartRef: MutableRefObject<ChartJS | null>;
  setField: SetField;
};

function ProfitabilityInner({ periods, palette, config, chartRef, setField }: InnerProps) {
  const cjsType = resolveChartJsType(config.chartType);
  const stacked = isStacked(config.chartType);

  const data = useMemo(() => {
    const labels = periods.map((p) => p.label);
    const revenue = periods.map((p) => p.revenue);
    const costs = periods.map((p) => p.costs);
    const profit = periods.map((p) => p.revenue - p.costs);

    if (stacked) {
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

  const handlers: Array<DragHandler | null> = useMemo(() => {
    if (stacked) {
      return [
        // Kosten
        (i, v) => setField(i, 'costs', v),
        // Gewinn: revenue = costs + profit
        (i, v) => {
          const p = periods[i];
          if (!p) return;
          setField(i, 'revenue', p.costs + v);
        },
      ];
    }
    return [
      // Umsatz
      (i, v) => setField(i, 'revenue', v),
      // Kosten
      (i, v) => setField(i, 'costs', v),
      // Gewinn: revenue = costs + profit
      (i, v) => {
        const p = periods[i];
        if (!p) return;
        setField(i, 'revenue', p.costs + v);
      },
    ];
  }, [stacked, periods, setField]);

  useChartDragEditor(chartRef, handlers);

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
  const { periods, isOverridden } = useEffectiveData(CHART_ID);
  useCurrencyCode();
  const t = useT();
  const upsertPeriod = useDataStore((s) => s.upsertPeriod);
  const upsertChartPeriod = useDataStore((s) => s.upsertChartPeriod);

  const setField = useCallback<SetField>(
    (dataIndex, field, value) => {
      const patch = { [field]: value } as Partial<Period>;
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
    }));

  return (
    <ChartCard
      chartId={CHART_ID}
      title={t('chart.profitability.title')}
      subtitle={`${t('chart.profitability.subtitle')} (${t('detail.dragHint')})`}
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
      {(args) => <ProfitabilityInner periods={periods} setField={setField} {...args} />}
    </ChartCard>
  );
}
