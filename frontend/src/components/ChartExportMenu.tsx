import { MutableRefObject, useState } from 'react';
import type { Chart as ChartJS } from 'chart.js';
import type { ExportRow } from './ChartCard';
import { useT } from '../i18n/translations';

type Props = {
  chartRef: MutableRefObject<ChartJS | null>;
  title: string;
  exportRows?: () => ExportRow[];
  onClose: () => void;
};

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'chart';
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function rowsToCsv(rows: ExportRow[]): string {
  if (rows.length === 0) return '';
  const keys = Array.from(
    rows.reduce<Set<string>>((set, r) => {
      Object.keys(r).forEach((k) => set.add(k));
      return set;
    }, new Set())
  );
  const escape = (v: unknown): string => {
    const s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = keys.join(',');
  const body = rows.map((r) => keys.map((k) => escape(r[k])).join(',')).join('\n');
  return `${header}\n${body}`;
}

export default function ChartExportMenu({ chartRef, title, exportRows, onClose }: Props) {
  const base = sanitizeFilename(title);
  const [transparent, setTransparent] = useState(false);
  const t = useT();

  const renderCanvas = (scale: number): HTMLCanvasElement | null => {
    const chart = chartRef.current;
    if (!chart) return null;
    const canvas = chart.canvas;
    const w = canvas.width;
    const h = canvas.height;
    const off = document.createElement('canvas');
    off.width = w * scale;
    off.height = h * scale;
    const ctx = off.getContext('2d');
    if (!ctx) return null;
    ctx.scale(scale, scale);
    if (!transparent) {
      ctx.fillStyle = '#0b1120';
      ctx.fillRect(0, 0, w, h);
    }
    ctx.drawImage(canvas, 0, 0);
    return off;
  };

  const exportPng = (scale: number) => {
    const off = renderCanvas(scale);
    if (!off) return;
    off.toBlob((blob) => {
      if (blob) {
        const suffix = scale > 1 ? `@${scale}x` : '';
        const bgTag = transparent ? '-transparent' : '';
        triggerDownload(blob, `${base}${suffix}${bgTag}.png`);
      }
      onClose();
    }, 'image/png');
  };

  const exportCsv = () => {
    if (!exportRows) return;
    const rows = exportRows();
    const csv = rowsToCsv(rows);
    triggerDownload(new Blob([csv], { type: 'text/csv;charset=utf-8' }), `${base}.csv`);
    onClose();
  };

  const exportJson = () => {
    if (!exportRows) return;
    const rows = exportRows();
    const json = JSON.stringify(rows, null, 2);
    triggerDownload(new Blob([json], { type: 'application/json' }), `${base}.json`);
    onClose();
  };

  const copyPng = async () => {
    const off = renderCanvas(1);
    if (!off) return;
    await new Promise<void>((resolve) => {
      off.toBlob(async (blob) => {
        if (blob && 'clipboard' in navigator && 'write' in navigator.clipboard) {
          try {
            const item = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([item]);
          } catch {
            /* ignore */
          }
        }
        resolve();
      }, 'image/png');
    });
    onClose();
  };

  return (
    <div className="chart-popover export-menu" role="menu">
      <div className="popover-head">
        <strong>{t('export.title')}</strong>
        <button type="button" className="chart-icon-btn" onClick={onClose} aria-label="×">
          ×
        </button>
      </div>
      <div className="popover-section">
        <label className="toggle">
          <input
            type="checkbox"
            checked={transparent}
            onChange={(e) => setTransparent(e.target.checked)}
          />
          <span>{t('export.transparent')}</span>
        </label>
      </div>
      <div className="export-list">
        <button type="button" className="export-item" onClick={() => exportPng(1)}>
          <span>{t('export.png')}</span>
          <span className="dim">{t('export.pngStandard')}</span>
        </button>
        <button type="button" className="export-item" onClick={() => exportPng(2)}>
          <span>{t('export.png2x')}</span>
          <span className="dim">{t('export.pngHires')}</span>
        </button>
        <button type="button" className="export-item" onClick={() => exportPng(3)}>
          <span>{t('export.png3x')}</span>
          <span className="dim">{t('export.pngPrint')}</span>
        </button>
        <button type="button" className="export-item" onClick={copyPng}>
          <span>{t('export.clipboard')}</span>
          <span className="dim">{t('export.clipboardSub')}</span>
        </button>
        <button
          type="button"
          className="export-item"
          onClick={exportCsv}
          disabled={!exportRows}
        >
          <span>{t('export.csv')}</span>
          <span className="dim">{t('export.csvSub')}</span>
        </button>
        <button
          type="button"
          className="export-item"
          onClick={exportJson}
          disabled={!exportRows}
        >
          <span>{t('export.json')}</span>
          <span className="dim">{t('export.jsonSub')}</span>
        </button>
      </div>
    </div>
  );
}
