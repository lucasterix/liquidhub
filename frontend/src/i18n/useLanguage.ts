import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Lang = 'de' | 'en';

type LangState = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

export const useLanguage = create<LangState>()(
  persist(
    (set) => ({
      lang: 'de',
      setLang: (lang) => set({ lang }),
    }),
    { name: 'liquidhub-lang' }
  )
);
