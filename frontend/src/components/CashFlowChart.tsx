import { useMemo, useCallback, MutableRefObject } from 'react';
import { Chart } from 'react-chartjs-2';
import type { Chart as ChartJS } from 'chart.js';
import './ChartRegistry';
import { useDataStore, useEffectiveData } from '../store/useDataStore';
import { useCurrencyCode } from '../lib/finance';
import { useT } from '../i18n/translations';
import { Palette, seriesColor, hexToRgba } from '../theme/palettes';
import { ChartConfig } from '../theme/useChartTheme';
import type { Period } from '../types';
import {
  baseCartesianOptions,
  isStacked,
  resolveChartJsType,
  useUiChartTokens,
} from './chartHelpers';
import ChartCard from './ChartCard';
import { useChartDragEditor, DragHandler } from './useChartDragEditor';

export const CHART_ID = 'cash-flow';

type SetField = (dataIndex: number, field: 'cashIn' | 'cashOut', value: number) => void;

type InnerProps = {
  periods: Period[];
  palette: Palette;
  config: ChartConfig;
  chartRef: MutableRefObject<ChartJS | null>;
  setField: SetField;
};

function CashFlowInner({ periods, palette, config, chartRef, setField }: InnerProps) {
  const cjsType = resolveChartJsType(config.chartType);
  const stacked = isStacked(config.chartType);
  const ui = useUiChartTokens();

  const data = useMemo(() => {
    const inColor = seriesColor(palette, 0, config.customColors);
    const outColor = seriesColor(palette, 2, config.customColors);
    const labels = periods.map((p) => p.label);
    const datasets: Record<string, unknown>[] = [];
    if (cjsType === 'bar') {
      const cashIn = periods.map((p) => p.cashIn);
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
          pointBackgroundColor: ui.pointRing,
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
          pointBackgroundColor: ui.pointRing,
          pointBorderColor: outColor,
          pointBorderWidth: 2,
        }
      );
    }
    return { labels, datasets };
  }, [periods, palette, config.chartType, config.tension, config.customColors, stacked, cjsType, ui.pointRing]);

  const handlers: Array<DragHandler | null> = useMemo(() => {
    return [
      // Cash In
      (i, v) => setField(i, 'cashIn', v),
      // Cash Out — store is positive, bar shows negative in stacked mode
      (i, v) => setField(i, 'cashOut', stacked ? Math.abs(v) : v),
    ];
  }, [stacked, setField]);

  useChartDragEditor(chartRef, handlers);

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

export default function CashFlowChart() {
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
      cashIn: p.cashIn,
      cashOut: p.cashOut,
      netFlow: p.cashIn - p.cashOut,
    }));

  return (
    <ChartCard
      chartId={CHART_ID}
      title={t('chart.cashFlow.title')}
      subtitle={`${t('chart.cashFlow.subtitle')} (${t('detail.dragHint')})`}
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
      {(args) => <CashFlowInner periods={periods} setField={setField} {...args} />}
    </ChartCard>
  );
}
