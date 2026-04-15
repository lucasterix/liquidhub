import type { ComponentType } from 'react';
import ProfitabilityChart from './ProfitabilityChart';
import LiquidityChart from './LiquidityChart';
import RevenueMarginChart from './RevenueMarginChart';
import CashFlowChart from './CashFlowChart';
import WaterfallChart from './WaterfallChart';
import CostStructureChart from './CostStructureChart';

export type ChartMeta = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  component: ComponentType;
  seriesLabels: string[];
};

export const chartCatalog: ChartMeta[] = [
  {
    id: 'profitability',
    slug: 'profitability',
    title: 'Profitability Forecast',
    subtitle: 'Umsatz, Kosten und Gewinn pro Periode',
    description:
      'Vergleicht Erlöse und Kosten Periode für Periode. Stacked- und Horizontal-Modus zeigen die Zusammensetzung der Kosten zum Erlös.',
    component: ProfitabilityChart,
    seriesLabels: ['Umsatz', 'Kosten', 'Gewinn'],
  },
  {
    id: 'liquidity',
    slug: 'liquidity',
    title: 'Liquidity Forecast',
    subtitle: 'Kassenstand & Netto-Cashflow',
    description:
      'Projiziert den Kassenstand anhand von Cash-In/Out. Area-Modus macht die Entwicklung sofort sichtbar.',
    component: LiquidityChart,
    seriesLabels: ['Cash Position', 'Net Cash Flow'],
  },
  {
    id: 'revenue-margin',
    slug: 'revenue-margin',
    title: 'Umsatz & Marge',
    subtitle: 'Umsatz pro Periode mit Margen-Linie',
    description:
      'Kombiniert absolute Umsätze mit relativer Marge auf zwei Y-Achsen. Ideal für Kennzahlen-Reviews.',
    component: RevenueMarginChart,
    seriesLabels: ['Umsatz', 'Marge (%)'],
  },
  {
    id: 'cash-flow',
    slug: 'cash-flow',
    title: 'Cash Flow',
    subtitle: 'Zu- und Abflüsse pro Periode',
    description:
      'Zeigt Cash-In vs. Cash-Out pro Periode — wahlweise gestapelt, nebeneinander oder als Area.',
    component: CashFlowChart,
    seriesLabels: ['Cash In', 'Cash Out'],
  },
  {
    id: 'waterfall',
    slug: 'waterfall',
    title: 'Profit Waterfall',
    subtitle: 'Periodische Beiträge zum Gesamtergebnis',
    description:
      'Zeigt, wie sich jede Periode zum kumulierten Gewinn addiert. Positive Schritte grün, negative rot.',
    component: WaterfallChart,
    seriesLabels: ['Gewinn-Schritt'],
  },
  {
    id: 'cost-structure',
    slug: 'cost-structure',
    title: 'Kostenverteilung',
    subtitle: 'Anteil der Kosten pro Periode',
    description:
      'Visualisiert die prozentuale Verteilung der Gesamtkosten auf die einzelnen Perioden.',
    component: CostStructureChart,
    seriesLabels: ['Kosten je Periode'],
  },
];

export function findChartBySlug(slug: string): ChartMeta | undefined {
  return chartCatalog.find((c) => c.slug === slug);
}
