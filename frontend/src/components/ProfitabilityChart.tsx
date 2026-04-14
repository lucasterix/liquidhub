import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import './ChartRegistry';
import { useDataStore } from '../store/useDataStore';
import { formatEUR } from '../lib/finance';

export default function ProfitabilityChart() {
  const { periods } = useDataStore();

  const data = useMemo(
    () => ({
      labels: periods.map((p) => p.label),
      datasets: [
        {
          label: 'Umsatz',
          data: periods.map((p) => p.revenue),
          backgroundColor: 'rgba(110, 168, 255, 0.85)',
          borderRadius: 8,
          borderSkipped: false,
          maxBarThickness: 28,
        },
        {
          label: 'Kosten',
          data: periods.map((p) => p.costs),
          backgroundColor: 'rgba(255, 107, 129, 0.8)',
          borderRadius: 8,
          borderSkipped: false,
          maxBarThickness: 28,
        },
        {
          label: 'Gewinn',
          data: periods.map((p) => p.revenue - p.costs),
          backgroundColor: 'rgba(123, 240, 196, 0.9)',
          borderRadius: 8,
          borderSkipped: false,
          maxBarThickness: 28,
        },
      ],
    }),
    [periods]
  );

  const options: ChartOptions<'bar'> = {
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
        beginAtZero: true,
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
        <h3>Profitability Forecast</h3>
        <span className="chart-sub">Umsatz vs. Kosten pro Periode</span>
      </div>
      <div className="chart-canvas">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
