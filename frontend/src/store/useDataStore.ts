import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Period } from '../types';

type DataState = {
  startingCash: number;
  periods: Period[];
  setStartingCash: (v: number) => void;
  setPeriods: (p: Period[]) => void;
  upsertPeriod: (index: number, patch: Partial<Period>) => void;
  addPeriod: () => void;
  removePeriod: (index: number) => void;
  reset: () => void;
  loadSample: () => void;
};

const samplePeriods: Period[] = [
  { label: 'Jan', revenue: 48000, costs: 32000, cashIn: 42000, cashOut: 34000 },
  { label: 'Feb', revenue: 52000, costs: 33500, cashIn: 47000, cashOut: 35000 },
  { label: 'Mar', revenue: 61000, costs: 36000, cashIn: 54000, cashOut: 37500 },
  { label: 'Apr', revenue: 58000, costs: 35000, cashIn: 55000, cashOut: 36000 },
  { label: 'May', revenue: 67000, costs: 38500, cashIn: 60000, cashOut: 39500 },
  { label: 'Jun', revenue: 72000, costs: 41000, cashIn: 66000, cashOut: 41500 },
];

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      startingCash: 25000,
      periods: samplePeriods,
      setStartingCash: (v) => set({ startingCash: v }),
      setPeriods: (periods) => set({ periods }),
      upsertPeriod: (index, patch) =>
        set((s) => ({
          periods: s.periods.map((p, i) => (i === index ? { ...p, ...patch } : p)),
        })),
      addPeriod: () =>
        set((s) => ({
          periods: [
            ...s.periods,
            { label: `P${s.periods.length + 1}`, revenue: 0, costs: 0, cashIn: 0, cashOut: 0 },
          ],
        })),
      removePeriod: (index) =>
        set((s) => ({ periods: s.periods.filter((_, i) => i !== index) })),
      reset: () => set({ startingCash: 25000, periods: samplePeriods }),
      loadSample: () => set({ startingCash: 25000, periods: samplePeriods }),
    }),
    { name: 'liquidhub-data' }
  )
);
