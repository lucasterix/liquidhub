import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PaletteId } from './palettes';

export type ChartTypeId =
  | 'bar'
  | 'stacked-bar'
  | 'horizontal-bar'
  | 'horizontal-bar-stacked'
  | 'line'
  | 'area'
  | 'step-line'
  | 'doughnut'
  | 'pie'
  | 'polarArea'
  | 'radar'
  | 'waterfall'
  | 'combo';

export type LegendPosition = 'top' | 'bottom' | 'left' | 'right';

export type ChartConfig = {
  palette: PaletteId;
  chartType: ChartTypeId;
  showGrid: boolean;
  showLegend: boolean;
  legendPosition: LegendPosition;
  tension: number;
  fill: boolean;
  beginAtZero: boolean;
  showDataLabels: boolean;
  customColors: (string | null)[];
  title?: string;
  subtitle?: string;
};

export const defaultChartConfig: ChartConfig = {
  palette: 'ocean',
  chartType: 'bar',
  showGrid: true,
  showLegend: true,
  legendPosition: 'bottom',
  tension: 0.35,
  fill: true,
  beginAtZero: true,
  showDataLabels: false,
  customColors: [],
};

type ThemeState = {
  globalPalette: PaletteId;
  configs: Record<string, Partial<ChartConfig>>;
  setGlobalPalette: (p: PaletteId) => void;
  setConfig: (chartId: string, patch: Partial<ChartConfig>) => void;
  resetConfig: (chartId: string) => void;
  resetAll: () => void;
};

export const useChartTheme = create<ThemeState>()(
  persist(
    (set) => ({
      globalPalette: 'ocean',
      configs: {},
      setGlobalPalette: (globalPalette) => set({ globalPalette }),
      setConfig: (chartId, patch) =>
        set((s) => ({
          configs: { ...s.configs, [chartId]: { ...s.configs[chartId], ...patch } },
        })),
      resetConfig: (chartId) =>
        set((s) => {
          const next = { ...s.configs };
          delete next[chartId];
          return { configs: next };
        }),
      resetAll: () => set({ configs: {} }),
    }),
    { name: 'liquidhub-chart-theme' }
  )
);

export function useChartConfig(chartId: string, defaults: Partial<ChartConfig> = {}): ChartConfig {
  const globalPalette = useChartTheme((s) => s.globalPalette);
  const stored = useChartTheme((s) => s.configs[chartId]);
  return {
    ...defaultChartConfig,
    palette: globalPalette,
    ...defaults,
    ...stored,
  };
}
