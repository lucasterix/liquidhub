import type { KpiSummary, Period } from '../types';

export function computeCashSeries(startingCash: number, periods: Period[]): number[] {
  const out: number[] = [];
  let cash = startingCash;
  for (const p of periods) {
    cash += p.cashIn - p.cashOut;
    out.push(cash);
  }
  return out;
}

export function computeKpis(startingCash: number, periods: Period[]): KpiSummary {
  const totalRevenue = periods.reduce((s, p) => s + p.revenue, 0);
  const totalCosts = periods.reduce((s, p) => s + p.costs, 0);
  const totalProfit = totalRevenue - totalCosts;
  const margin = totalRevenue > 0 ? totalProfit / totalRevenue : 0;
  const cashSeries = computeCashSeries(startingCash, periods);
  const endingCash = cashSeries.at(-1) ?? startingCash;
  const minCash = cashSeries.length ? Math.min(...cashSeries) : startingCash;
  return { totalRevenue, totalCosts, totalProfit, margin, endingCash, minCash };
}

export function formatEUR(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}
