import { ChangeEvent, useRef } from 'react';
import { useDataStore } from '../store/useDataStore';
import type { Period } from '../types';
import ImportFormatHelp from './ImportFormatHelp';
import { generateRandomPeriods } from '../lib/sampleData';

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

export default function DataInput() {
  const {
    startingCash,
    periods,
    setStartingCash,
    upsertPeriod,
    addPeriod,
    removePeriod,
    setPeriods,
    loadSample,
  } = useDataStore();
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      if (file.name.toLowerCase().endsWith('.json')) {
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) throw new Error('JSON must be an array of periods');
        setPeriods(parsed as Period[]);
      } else {
        setPeriods(parseCsv(text));
      }
    } catch (err) {
      alert(`Import failed: ${(err as Error).message}`);
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  const handleRandomize = () => {
    const next = generateRandomPeriods(periods.length > 0 ? periods.length : 6);
    setStartingCash(next.startingCash);
    setPeriods(next.periods);
  };

  return (
    <section className="data-input">
      <div className="data-input-header">
        <div>
          <h3>
            Planungsdaten
            <ImportFormatHelp />
          </h3>
          <div className="hint">Label, Umsatz, Kosten, Cash In/Out pro Periode</div>
        </div>
        <div className="data-input-actions">
          <button type="button" onClick={loadSample}>Load sample</button>
          <button type="button" onClick={handleRandomize} title="Realistische Zufallszahlen">
            🎲 Zufallsdaten
          </button>
          <button type="button" onClick={() => fileRef.current?.click()}>Import CSV / JSON</button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.json,application/json,text/csv"
            onChange={handleFile}
            hidden
          />
        </div>
      </div>

      <label className="starting-cash">
        Starting cash
        <input
          type="number"
          value={startingCash}
          onChange={(e) => setStartingCash(Number(e.target.value) || 0)}
        />
      </label>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Period</th>
              <th>Revenue</th>
              <th>Costs</th>
              <th>Cash In</th>
              <th>Cash Out</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {periods.map((p, i) => (
              <tr key={i}>
                <td>
                  <input
                    value={p.label}
                    onChange={(e) => upsertPeriod(i, { label: e.target.value })}
                  />
                </td>
                {(['revenue', 'costs', 'cashIn', 'cashOut'] as const).map((field) => (
                  <td key={field}>
                    <input
                      type="number"
                      value={p[field]}
                      onChange={(e) =>
                        upsertPeriod(i, { [field]: Number(e.target.value) || 0 } as Partial<Period>)
                      }
                    />
                  </td>
                ))}
                <td>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => removePeriod(i)}
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

      <button type="button" onClick={addPeriod}>+ Add period</button>
    </section>
  );
}
