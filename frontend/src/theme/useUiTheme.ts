import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UiMode = 'dark' | 'light';

type UiThemeState = {
  mode: UiMode;
  setMode: (mode: UiMode) => void;
  toggleMode: () => void;
};

export const useUiTheme = create<UiThemeState>()(
  persist(
    (set) => ({
      mode: 'dark',
      setMode: (mode) => set({ mode }),
      toggleMode: () => set((s) => ({ mode: s.mode === 'dark' ? 'light' : 'dark' })),
    }),
    { name: 'liquidhub-ui-theme' }
  )
);

export type ChartTokens = {
  grid: string;
  tick: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipTitle: string;
  tooltipBody: string;
  pointRing: string;
};

const darkTokens: ChartTokens = {
  grid: 'rgba(91, 112, 160, 0.12)',
  tick: '#9ba9c8',
  tooltipBg: 'rgba(10, 16, 32, 0.95)',
  tooltipBorder: 'rgba(110, 168, 255, 0.3)',
  tooltipTitle: '#e9eefb',
  tooltipBody: '#9ba9c8',
  pointRing: '#0b1120',
};

const lightTokens: ChartTokens = {
  grid: 'rgba(15, 30, 60, 0.1)',
  tick: '#475a7b',
  tooltipBg: 'rgba(255, 255, 255, 0.97)',
  tooltipBorder: 'rgba(66, 99, 235, 0.35)',
  tooltipTitle: '#0b1120',
  tooltipBody: '#475a7b',
  pointRing: '#ffffff',
};

export function getChartTokens(mode: UiMode): ChartTokens {
  return mode === 'light' ? lightTokens : darkTokens;
}
