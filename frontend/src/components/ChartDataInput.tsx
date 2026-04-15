import { ChangeEvent, useRef } from 'react';
import { useDataStore, useEffectiveData } from '../store/useDataStore';
import type { Period } from '../types';
import ImportFormatHelp from './ImportFormatHelp';
import { generateRandomPeriods } from '../lib/sampleData';
import { useT } from '../i18n/translations';

function parseCsv(text: string): Period[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  const header = lines[0].toLowerCase().split(',').map((h) => h.trim());
  const idx = (name: string) => header.indexOf(name);
  const li = idx('label');
  const ri = idx('revenue');
  const ci = idx('costs');
  const inIdx = idx('cashin');
  const outIdx = idx('cashout');
  if ([li, ri, ci, inIdx, outIdx].some((i) => i < 0)) {
    throw new Error('CSV must have header: label,revenue,costs,cashIn,cashOut');
  }
  return lines.slice(1).map((line) => {
    const cols = line.split(',').map((c) => c.trim());
    return {
      label: cols[li],
      revenue: Number(cols[ri]) || 0,
      costs: Number(cols[ci]) || 0,
      cashIn: Number(cols[inIdx]) || 0,
      cashOut: Number(cols[outIdx]) || 0,
    };
  });
}

type Props = {
  chartId: string;
  chartTitle: string;
};

export default function ChartDataInput({ chartId, chartTitle }: Props) {
  const { startingCash, periods, isOverridden } = useEffectiveData(chartId);
  const enableChartOverride = useDataStore((s) => s.enableChartOverride);
  const disableChartOverride = useDataStore((s) => s.disableChartOverride);
  const resetChartOverride = useDataStore((s) => s.resetChartOverride);
  const setChartStartingCash = useDataStore((s) => s.setChartStartingCash);
  const setChartPeriods = useDataStore((s) => s.setChartPeriods);
  const upsertChartPeriod = useDataStore((s) => s.upsertChartPeriod);
  const addChartPeriod = useDataStore((s) => s.addChartPeriod);
  const removeChartPeriod = useDataStore((s) => s.removeChartPeriod);

  const fileRef = useRef<HTMLInputElement>(null);
  const t = useT();

  const ensureOverride = () => {
    if (!isOverridden) enableChartOverride(chartId);
  };

  const handleRandomize = () => {
    ensureOverride();
    const next = generateRandomPeriods(periods.length > 0 ? periods.length : 6);
    setChartStartingCash(chartId, next.startingCash);
    setChartPeriods(chartId, next.periods);
  };

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      ensureOverride();
      if (file.name.toLowerCase().endsWith('.json')) {
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) throw new Error('JSON must be an array of periods');
        setChartPeriods(chartId, parsed as Period[]);
      } else {
        setChartPeriods(chartId, parseCsv(text));
      }
    } catch (err) {
      alert(`Import failed: ${(err as Error).message}`);
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <section className="data-input">
      <div className="data-input-header">
        <div>
          <h3>
            {t('data.planning')} — {chartTitle}
            <ImportFormatHelp />
          </h3>
          <div className="hint">{isOverridden ? t('data.usesOwn') : t('data.usesGlobal')}</div>
        </div>
        <div className="data-input-actions">
          <label className="toggle">
            <input
              type="checkbox"
              checked={isOverridden}
              onChange={(e) => {
                if (e.target.checked) enableChartOverride(chartId);
                else disableChartOverride(chartId);
              }}
            />
            <span>{t('data.ownDataToggle')}</span>
          </label>
          <button type="button" onClick={handleRandomize} title={t('data.randomTitle')}>
            {t('data.random')}
          </button>
          <button
            type="button"
            onClick={() => {
              ensureOverride();
              fileRef.current?.click();
            }}
          >
            {t('data.import')}
          </button>
          <button
            type="button"
            className="danger-ghost"
            onClick={() => resetChartOverride(chartId)}
            disabled={!isOverridden}
            title={t('data.removeOverrideTitle')}
          >
            {t('data.removeOverride')}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.json,application/json,text/csv"
            onChange={handleFile}
            hidden
          />
        </div>
      </div>

      <fieldset className="data-input-fieldset" disabled={!isOverridden}>
        <label className="starting-cash">
          {t('data.startingCash')}
          <input
            type="number"
            value={startingCash}
            onChange={(e) => setChartStartingCash(chartId, Number(e.target.value) || 0)}
          />
        </label>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t('data.colPeriod')}</th>
                <th>{t('data.colRevenue')}</th>
                <th>{t('data.colCosts')}</th>
                <th>{t('data.colCashIn')}</th>
                <th>{t('data.colCashOut')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {periods.map((p, i) => (
                <tr key={i}>
                  <td>
                    <input
                      value={p.label}
                      onChange={(e) => upsertChartPeriod(chartId, i, { label: e.target.value })}
                    />
                  </td>
                  {(['revenue', 'costs', 'cashIn', 'cashOut'] as const).map((field) => (
                    <td key={field}>
                      <input
                        type="number"
                        value={p[field]}
                        onChange={(e) =>
                          upsertChartPeriod(chartId, i, {
                            [field]: Number(e.target.value) || 0,
                          } as Partial<Period>)
                        }
                      />
                    </td>
                  ))}
                  <td>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => removeChartPeriod(chartId, i)}
                      aria-label={`Remove ${p.label}`}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button type="button" onClick={() => addChartPeriod(chartId)}>
          {t('data.addPeriod')}
        </button>
      </fieldset>
    </section>
  );
}
