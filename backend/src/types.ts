export type Period = {
  label: string;
  revenue: number;
  costs: number;
  cashIn: number;
  cashOut: number;
};

export type AnalyzeRequest = {
  startingCash: number;
  periods: Period[];
};

export type AnalyzeResponse = {
  kpis: {
    totalRevenue: number;
    totalCosts: number;
    totalProfit: number;
    margin: number;
    endingCash: number;
    minCash: number;
  };
  cashSeries: number[];
  profitSeries: number[];
};
