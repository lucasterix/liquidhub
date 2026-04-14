import type { Request, Response } from 'express';

export function getCharts(_req: Request, res: Response) {
  res.json({
    charts: [
      { id: 'profitability', label: 'Profitability Forecast', type: 'bar' },
      { id: 'liquidity', label: 'Liquidity Forecast', type: 'line' },
    ],
  });
}
