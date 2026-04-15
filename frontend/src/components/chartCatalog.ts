import type { ComponentType } from 'react';
import ProfitabilityChart from './ProfitabilityChart';
import LiquidityChart from './LiquidityChart';
import RevenueMarginChart from './RevenueMarginChart';
import CashFlowChart from './CashFlowChart';
import WaterfallChart from './WaterfallChart';
import CostStructureChart from './CostStructureChart';

export type ChartMetaBase = {
  id: string;
  slug: string;
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
  component: ComponentType;
};

export type ChartMeta = ChartMetaBase & {
  title: string;
  subtitle: string;
  description: string;
};

export const chartCatalog: ChartMetaBase[] = [
  {
    id: 'profitability',
    slug: 'profitability',
    titleKey: 'chart.profitability.title',
    subtitleKey: 'chart.profitability.subtitle',
    descriptionKey: 'chart.profitability.description',
    component: ProfitabilityChart,
  },
  {
    id: 'liquidity',
    slug: 'liquidity',
    titleKey: 'chart.liquidity.title',
    subtitleKey: 'chart.liquidity.subtitle',
    descriptionKey: 'chart.liquidity.description',
    component: LiquidityChart,
  },
  {
    id: 'revenue-margin',
    slug: 'revenue-margin',
    titleKey: 'chart.revenueMargin.title',
    subtitleKey: 'chart.revenueMargin.subtitle',
    descriptionKey: 'chart.revenueMargin.description',
    component: RevenueMarginChart,
  },
  {
    id: 'cash-flow',
    slug: 'cash-flow',
    titleKey: 'chart.cashFlow.title',
    subtitleKey: 'chart.cashFlow.subtitle',
    descriptionKey: 'chart.cashFlow.description',
    component: CashFlowChart,
  },
  {
    id: 'waterfall',
    slug: 'waterfall',
    titleKey: 'chart.waterfall.title',
    subtitleKey: 'chart.waterfall.subtitle',
    descriptionKey: 'chart.waterfall.description',
    component: WaterfallChart,
  },
  {
    id: 'cost-structure',
    slug: 'cost-structure',
    titleKey: 'chart.costStructure.title',
    subtitleKey: 'chart.costStructure.subtitle',
    descriptionKey: 'chart.costStructure.description',
    component: CostStructureChart,
  },
];

export function findChartBySlug(slug: string): ChartMetaBase | undefined {
  return chartCatalog.find((c) => c.slug === slug);
}

export function localizedCatalog(t: (k: string) => string): ChartMeta[] {
  return chartCatalog.map((c) => ({
    ...c,
    title: t(c.titleKey),
    subtitle: t(c.subtitleKey),
    description: t(c.descriptionKey),
  }));
}
