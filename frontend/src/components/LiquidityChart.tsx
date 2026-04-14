import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import './ChartRegistry';
import { useDataStore } from '../store/useDataStore';
import { computeCashSeries, formatEUR } from '../lib/finance';

export default function LiquidityChart() {
  const { startingCash, periods } = useDataStore();

  const data = useMemo(() => {
    const cash = computeCashSeries(startingCash, periods);
    return {
      labels: periods.map((p) => p.label),
      datasets: [
        {
          label: 'Cash Position',
          data: cash,
          borderColor: 'rgba(110, 168, 255, 1)',
          backgroundColor: (ctx: { chart: { ctx: CanvasRenderingContext2D; chartArea?: { top: number; bottom: number } } }) => {
            const chart = ctx.chart;
            const { ctx: c, chartArea } = chart;
            if (!chartArea) return 'rgba(110, 168, 255, 0.2)';
            const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            g.addColorStop(0, 'rgba(110, 168, 255, 0.45)');
            g.addColorStop(1, 'rgba(110, 168, 255, 0.02)');
            return g;
          },
          borderWidth: 2.5,
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#0b1120',
          pointBorderColor: '#6ea8ff',
          pointBorderWidth: 2,
        },
        {
          label: 'Net Cash Flow',
          data: periods.map((p) => p.cashIn - p.cashOut),
          borderColor: 'rgba(123, 240, 196, 1)',
          backgroundColor: 'rgba(123, 240, 196, 0.1)',
          borderWidth: 2,
          borderDash: [6, 4],
          tension: 0.35,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: '#0b1120',
          pointBorderColor: '#7bf0c4',
          pointBorderWidth: 2,
        },
      ],
    };
  }, [startingCash, periods]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#9ba9c8',
          usePointStyle: true,
          padding: 16,
          font: { size: 12, weight: 500 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(10, 16, 32, 0.95)',
        titleColor: '#e9eefb',
        bodyColor: '#9ba9c8',
        borderColor: 'rgba(110, 168, 255, 0.3)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${formatEUR(Number(ctx.parsed.y))}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#9ba9c8' },
        grid: { display: false },
      },
      y: {
        ticks: {
          color: '#9ba9c8',
          callback: (v) => formatEUR(Number(v)),
        },
        grid: { color: 'rgba(91, 112, 160, 0.12)' },
      },
    },
  };

  return (
    <div className="chart-card">
      <div className="chart-head">
        <h3>Liquidity Forecast</h3>
        <span className="chart-sub">Kassenstand & Netto-Cashflow</span>
      </div>
      <div className="chart-canvas">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
