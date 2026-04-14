import type { AnalyzeRequest, AnalyzeResponse, Period } from '../types.js';

export function validateAnalyzeRequest(body: unknown): AnalyzeRequest {
  if (!body || typeof body !== 'object') {
    throw new Error('Request body must be an object');
  }
  const obj = body as Record<string, unknown>;
  const startingCash = Number(obj.startingCash);
  if (!Number.isFinite(startingCash)) {
    throw new Error('startingCash must be a finite number');
  }
  if (!Array.isArray(obj.periods)) {
    throw new Error('periods must be an array');
  }
  const periods: Period[] = obj.periods.map((raw, i) => {
    if (!raw || typeof raw !== 'object') {
      throw new Error(`periods[${i}] must be an object`);
    }
    const p = raw as Record<string, unknown>;
    const label = typeof p.label === 'string' ? p.label : `P${i + 1}`;
    const revenue = Number(p.revenue);
    const costs = Number(p.costs);
    const cashIn = Number(p.cashIn);
    const cashOut = Number(p.cashOut);
    for (const [name, v] of [
      ['revenue', revenue],
      ['costs', costs],
      ['cashIn', cashIn],
      ['cashOut', cashOut],
    ] as const) {
      if (!Number.isFinite(v)) {
        throw new Error(`periods[${i}].${name} must be a finite number`);
      }
    }
    return { label, revenue, costs, cashIn, cashOut };
  });
  return { startingCash, periods };
}

export function analyze(req: AnalyzeRequest): AnalyzeResponse {
  const { startingCash, periods } = req;
  const totalRevenue = periods.reduce((s, p) => s + p.revenue, 0);
  const totalCosts = periods.reduce((s, p) => s + p.costs, 0);
  const totalProfit = totalRevenue - totalCosts;
  const margin = totalRevenue > 0 ? totalProfit / totalRevenue : 0;

  const cashSeries: number[] = [];
  const profitSeries: number[] = [];
  let cash = startingCash;
  for (const p of periods) {
    cash += p.cashIn - p.cashOut;
    cashSeries.push(cash);
    profitSeries.push(p.revenue - p.costs);
  }
  const endingCash = cashSeries.at(-1) ?? startingCash;
  const minCash = cashSeries.length ? Math.min(...cashSeries) : startingCash;

  return {
    kpis: { totalRevenue, totalCosts, totalProfit, margin, endingCash, minCash },
    cashSeries,
    profitSeries,
  };
}
