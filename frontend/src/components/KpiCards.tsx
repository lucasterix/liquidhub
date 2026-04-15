import { useMemo } from 'react';
import { useDataStore } from '../store/useDataStore';
import { computeKpis, formatEUR, useCurrencyCode } from '../lib/finance';
import { useT } from '../i18n/translations';

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
  const t = useT();
  const kpis = useMemo(() => computeKpis(startingCash, periods), [startingCash, periods]);

  const profitTrend: 'up' | 'down' = kpis.totalProfit >= 0 ? 'up' : 'down';
  const marginPct = `${(kpis.margin * 100).toFixed(1)}%`;
  const runwayChange = kpis.endingCash - startingCash;

  const cards: Card[] = [
    {
      label: t('kpi.totalRevenue'),
      value: formatEUR(kpis.totalRevenue),
      sub: `${periods.length} ${t('kpi.periods')}`,
    },
    {
      label: t('kpi.totalCosts'),
      value: formatEUR(kpis.totalCosts),
      sub: t('kpi.sumAll'),
    },
    {
      label: t('kpi.profit'),
      value: formatEUR(kpis.totalProfit),
      sub: `${t('kpi.margin')} ${marginPct}`,
      trend: profitTrend,
      badge: profitTrend === 'up' ? `▲ ${marginPct}` : `▼ ${marginPct}`,
    },
    {
      label: t('kpi.endingCash'),
      value: formatEUR(kpis.endingCash),
      sub:
        runwayChange >= 0
          ? `+${formatEUR(runwayChange)} ${t('kpi.vsStart')}`
          : `${formatEUR(runwayChange)} ${t('kpi.vsStart')}`,
      trend: runwayChange >= 0 ? 'up' : 'down',
      badge: runwayChange >= 0 ? '▲' : '▼',
    },
    {
      label: t('kpi.minCash'),
      value: formatEUR(kpis.minCash),
      sub: kpis.minCash < 0 ? t('kpi.bottleneck') : t('kpi.healthy'),
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
