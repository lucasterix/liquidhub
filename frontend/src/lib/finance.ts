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

import { formatMoney, useCurrency } from '../store/useCurrency';

export function formatEUR(value: number): string {
  // Historic name; now formats with the currently selected currency.
  return formatMoney(value, useCurrency.getState().code);
}

// Hook that charts/KPIs call to subscribe to currency changes so
// Chart.js re-renders axis labels and tooltips when the user picks a
// different currency. Returns the current code so callers can also
// list it explicitly in their dependency arrays.
export function useCurrencyCode() {
  return useCurrency((s) => s.code);
}
