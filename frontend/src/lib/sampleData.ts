import type { Period } from '../types';

const MONTHS_DE = [
  'Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun',
  'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez',
];

type Scenario = {
  revenueBase: number;
  revenueGrowth: number;
  costRatio: number;
  cashLag: number;
  volatility: number;
};

const SCENARIOS: Scenario[] = [
  { revenueBase: 38000, revenueGrowth: 0.06, costRatio: 0.68, cashLag: 0.92, volatility: 0.08 },
  { revenueBase: 72000, revenueGrowth: 0.03, costRatio: 0.74, cashLag: 0.9, volatility: 0.05 },
  { revenueBase: 120000, revenueGrowth: 0.04, costRatio: 0.71, cashLag: 0.88, volatility: 0.1 },
  { revenueBase: 24000, revenueGrowth: 0.11, costRatio: 0.62, cashLag: 0.85, volatility: 0.14 },
  { revenueBase: 55000, revenueGrowth: -0.02, costRatio: 0.81, cashLag: 0.93, volatility: 0.06 },
];

function jitter(value: number, amount: number): number {
  const factor = 1 + (Math.random() * 2 - 1) * amount;
  return Math.max(0, value * factor);
}

function round500(value: number): number {
  return Math.round(value / 500) * 500;
}

export function generateRandomPeriods(periodCount = 6): {
  startingCash: number;
  periods: Period[];
} {
  const scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
  const startMonth = Math.floor(Math.random() * 12);
  const periods: Period[] = [];
  let revenue = scenario.revenueBase;
  for (let i = 0; i < periodCount; i++) {
    const noisyRevenue = jitter(revenue, scenario.volatility);
    const costs = jitter(noisyRevenue * scenario.costRatio, scenario.volatility * 0.6);
    const cashIn = jitter(noisyRevenue * scenario.cashLag, scenario.volatility * 0.8);
    const cashOut = jitter(costs * 1.02, scenario.volatility * 0.6);
    periods.push({
      label: MONTHS_DE[(startMonth + i) % 12],
      revenue: round500(noisyRevenue),
      costs: round500(costs),
      cashIn: round500(cashIn),
      cashOut: round500(cashOut),
    });
    revenue *= 1 + scenario.revenueGrowth;
  }
  const startingCash = round500(scenario.revenueBase * 0.55);
  return { startingCash, periods };
}

export const CSV_EXAMPLE = `label,revenue,costs,cashIn,cashOut
Jan,48000,32000,42000,34000
Feb,52000,33500,47000,35000
Mar,61000,36000,54000,37500
Apr,58000,35000,55000,36000`;

export const JSON_EXAMPLE = `[
  { "label": "Jan", "revenue": 48000, "costs": 32000, "cashIn": 42000, "cashOut": 34000 },
  { "label": "Feb", "revenue": 52000, "costs": 33500, "cashIn": 47000, "cashOut": 35000 },
  { "label": "Mar", "revenue": 61000, "costs": 36000, "cashIn": 54000, "cashOut": 37500 },
  { "label": "Apr", "revenue": 58000, "costs": 35000, "cashIn": 55000, "cashOut": 36000 }
]`;
