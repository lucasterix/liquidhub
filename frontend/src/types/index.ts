export type Period = {
  label: string;
  revenue: number;
  costs: number;
  cashIn: number;
  cashOut: number;
};

export type KpiSummary = {
  totalRevenue: number;
  totalCosts: number;
  totalProfit: number;
  margin: number;
  endingCash: number;
  minCash: number;
};
