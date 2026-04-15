export type PaletteId =
  | 'ocean'
  | 'sunset'
  | 'forest'
  | 'corporate'
  | 'neon'
  | 'pastel'
  | 'mono'
  | 'vibrant';

export type Palette = {
  id: PaletteId;
  name: string;
  series: string[];
  positive: string;
  negative: string;
  grid: string;
  tooltipBg: string;
  tooltipBorder: string;
};

export const palettes: Record<PaletteId, Palette> = {
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    series: ['#6ea8ff', '#7bf0c4', '#ff6b81', '#ffcf6b', '#a78bfa', '#f472b6', '#34d399', '#fb923c'],
    positive: '#7bf0c4',
    negative: '#ff6b81',
    grid: 'rgba(91, 112, 160, 0.12)',
    tooltipBg: 'rgba(10, 16, 32, 0.95)',
    tooltipBorder: 'rgba(110, 168, 255, 0.3)',
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    series: ['#ff6b6b', '#ffa94d', '#ffd93d', '#c86dd7', '#ff477e', '#ff8c42', '#e8590c', '#d6336c'],
    positive: '#ffa94d',
    negative: '#ff477e',
    grid: 'rgba(200, 109, 215, 0.14)',
    tooltipBg: 'rgba(32, 10, 20, 0.95)',
    tooltipBorder: 'rgba(255, 107, 107, 0.35)',
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    series: ['#40c057', '#20c997', '#94d82d', '#12b886', '#66a80f', '#82c91e', '#099268', '#37b24d'],
    positive: '#40c057',
    negative: '#e03131',
    grid: 'rgba(64, 192, 87, 0.14)',
    tooltipBg: 'rgba(8, 22, 16, 0.95)',
    tooltipBorder: 'rgba(64, 192, 87, 0.35)',
  },
  corporate: {
    id: 'corporate',
    name: 'Corporate',
    series: ['#4263eb', '#5c7cfa', '#748ffc', '#22b8cf', '#339af0', '#1864ab', '#15aabf', '#0ca678'],
    positive: '#22b8cf',
    negative: '#e8590c',
    grid: 'rgba(91, 112, 160, 0.14)',
    tooltipBg: 'rgba(10, 16, 32, 0.95)',
    tooltipBorder: 'rgba(66, 99, 235, 0.35)',
  },
  neon: {
    id: 'neon',
    name: 'Neon',
    series: ['#00f5ff', '#ff00e5', '#fbff00', '#00ff88', '#ff0066', '#8b00ff', '#ff6600', '#76ff03'],
    positive: '#00ff88',
    negative: '#ff0066',
    grid: 'rgba(0, 245, 255, 0.12)',
    tooltipBg: 'rgba(12, 0, 24, 0.95)',
    tooltipBorder: 'rgba(0, 245, 255, 0.45)',
  },
  pastel: {
    id: 'pastel',
    name: 'Pastel',
    series: ['#a5d8ff', '#b2f2bb', '#ffd8a8', '#ffc9c9', '#eebefa', '#d0bfff', '#99e9f2', '#ffec99'],
    positive: '#b2f2bb',
    negative: '#ffc9c9',
    grid: 'rgba(165, 216, 255, 0.14)',
    tooltipBg: 'rgba(14, 18, 34, 0.95)',
    tooltipBorder: 'rgba(165, 216, 255, 0.35)',
  },
  mono: {
    id: 'mono',
    name: 'Mono',
    series: ['#e9eefb', '#c4cad9', '#9ba9c8', '#6a7796', '#4a5470', '#353e58', '#242a3d', '#141928'],
    positive: '#e9eefb',
    negative: '#6a7796',
    grid: 'rgba(155, 169, 200, 0.1)',
    tooltipBg: 'rgba(10, 14, 24, 0.95)',
    tooltipBorder: 'rgba(155, 169, 200, 0.35)',
  },
  vibrant: {
    id: 'vibrant',
    name: 'Vibrant',
    series: ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590', '#277da1'],
    positive: '#90be6d',
    negative: '#f94144',
    grid: 'rgba(144, 190, 109, 0.14)',
    tooltipBg: 'rgba(12, 18, 28, 0.95)',
    tooltipBorder: 'rgba(248, 150, 30, 0.4)',
  },
};

export const paletteList: Palette[] = Object.values(palettes);

export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function seriesColor(palette: Palette, index: number): string {
  return palette.series[index % palette.series.length];
}
