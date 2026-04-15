import { MutableRefObject } from 'react';
import type { Chart as ChartJS } from 'chart.js';
import type { ExportRow } from './ChartCard';

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

  const exportPng = (scale: number) => {
    const chart = chartRef.current;
    if (!chart) return;
    const canvas = chart.canvas;
    const w = canvas.width;
    const h = canvas.height;
    const off = document.createElement('canvas');
    off.width = w * scale;
    off.height = h * scale;
    const ctx = off.getContext('2d');
    if (!ctx) return;
    ctx.scale(scale, scale);
    ctx.fillStyle = '#0b1120';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(canvas, 0, 0);
    off.toBlob((blob) => {
      if (blob) triggerDownload(blob, `${base}${scale > 1 ? `@${scale}x` : ''}.png`);
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
    const chart = chartRef.current;
    if (!chart) return;
    const canvas = chart.canvas;
    await new Promise<void>((resolve) => {
      canvas.toBlob(async (blob) => {
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
        <strong>Export</strong>
        <button type="button" className="chart-icon-btn" onClick={onClose} aria-label="Schließen">
          ×
        </button>
      </div>
      <div className="export-list">
        <button type="button" className="export-item" onClick={() => exportPng(1)}>
          <span>PNG</span>
          <span className="dim">Standard-Auflösung</span>
        </button>
        <button type="button" className="export-item" onClick={() => exportPng(2)}>
          <span>PNG @2x</span>
          <span className="dim">Hohe Auflösung</span>
        </button>
        <button type="button" className="export-item" onClick={() => exportPng(3)}>
          <span>PNG @3x</span>
          <span className="dim">Print-Qualität</span>
        </button>
        <button type="button" className="export-item" onClick={copyPng}>
          <span>In Zwischenablage</span>
          <span className="dim">Als Bild kopieren</span>
        </button>
        <button
          type="button"
          className="export-item"
          onClick={exportCsv}
          disabled={!exportRows}
        >
          <span>CSV</span>
          <span className="dim">Rohdaten tabellarisch</span>
        </button>
        <button
          type="button"
          className="export-item"
          onClick={exportJson}
          disabled={!exportRows}
        >
          <span>JSON</span>
          <span className="dim">Strukturierte Daten</span>
        </button>
      </div>
    </div>
  );
}
