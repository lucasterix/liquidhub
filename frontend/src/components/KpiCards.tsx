import { useMemo } from 'react';
import { useDataStore } from '../store/useDataStore';
import { computeKpis, formatEUR, useCurrencyCode } from '../lib/finance';

type Card = {
  label: string;
  value: string;
  sub?: string;
  trend?: 'up' | 'down';
  badge?: string;
};

export default function KpiCards() {
  const { startingCash, periods } = useDataStore();
  useCurrencyCode();
  const kpis = useMemo(() => computeKpis(startingCash, periods), [startingCash, periods]);

  const profitTrend: 'up' | 'down' = kpis.totalProfit >= 0 ? 'up' : 'down';
  const marginPct = `${(kpis.margin * 100).toFixed(1)}%`;
  const runwayChange = kpis.endingCash - startingCash;

  const cards: Card[] = [
    {
      label: 'Total Revenue',
      value: formatEUR(kpis.totalRevenue),
      sub: `${periods.length} Perioden`,
    },
    {
      label: 'Total Costs',
      value: formatEUR(kpis.totalCosts),
      sub: 'Summe aller Ausgaben',
    },
    {
      label: 'Gewinn',
      value: formatEUR(kpis.totalProfit),
      sub: `Marge ${marginPct}`,
      trend: profitTrend,
      badge: profitTrend === 'up' ? `▲ ${marginPct}` : `▼ ${marginPct}`,
    },
    {
      label: 'Ending Cash',
      value: formatEUR(kpis.endingCash),
      sub:
        runwayChange >= 0
          ? `+${formatEUR(runwayChange)} vs. Start`
          : `${formatEUR(runwayChange)} vs. Start`,
      trend: runwayChange >= 0 ? 'up' : 'down',
      badge: runwayChange >= 0 ? '▲' : '▼',
    },
    {
      label: 'Liquiditäts-Tief',
      value: formatEUR(kpis.minCash),
      sub: kpis.minCash < 0 ? 'Engpass!' : 'im grünen Bereich',
      trend: kpis.minCash < 0 ? 'down' : 'up',
    },
  ];

  return (
    <div className="kpi-grid">
      {cards.map((c) => (
        <div key={c.label} className={`kpi-card${c.trend ? ` kpi-${c.trend}` : ''}`}>
          <div className="kpi-head">
            <div className="kpi-label">{c.label}</div>
            {c.badge && (
              <span className={`kpi-badge${c.trend === 'down' ? ' neg' : ''}`}>{c.badge}</span>
            )}
          </div>
          <div className="kpi-value">{c.value}</div>
          {c.sub && <div className="kpi-sub">{c.sub}</div>}
        </div>
      ))}
    </div>
  );
}
