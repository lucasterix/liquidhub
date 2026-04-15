import { ReactNode, useRef, useState, useEffect, useCallback, MutableRefObject } from 'react';
import { createPortal } from 'react-dom';
import type { Chart as ChartJS } from 'chart.js';
import { useChartConfig, ChartConfig, ChartTypeId } from '../theme/useChartTheme';
import { palettes, Palette } from '../theme/palettes';
import ChartSettingsPopover from './ChartSettingsPopover';
import ChartExportMenu from './ChartExportMenu';

export type ExportRow = Record<string, string | number>;

export type ChartCardRenderArgs = {
  palette: Palette;
  config: ChartConfig;
  chartRef: MutableRefObject<ChartJS | null>;
};

type Props = {
  chartId: string;
  title: string;
  subtitle?: string;
  defaults?: Partial<ChartConfig>;
  availableTypes?: ChartTypeId[];
  exportRows?: () => ExportRow[];
  headerExtras?: ReactNode;
  children: (args: ChartCardRenderArgs) => ReactNode;
};

type PopoverPos = { top: number; left: number };

const POPOVER_MARGIN = 8;
const SETTINGS_WIDTH = 340;
const EXPORT_WIDTH = 260;

function computePosition(anchor: DOMRect, width: number, height = 520): PopoverPos {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let left = anchor.right - width;
  if (left < POPOVER_MARGIN) left = POPOVER_MARGIN;
  if (left + width > vw - POPOVER_MARGIN) left = vw - width - POPOVER_MARGIN;
  let top = anchor.bottom + 6;
  if (top + height > vh - POPOVER_MARGIN) {
    top = Math.max(POPOVER_MARGIN, anchor.top - height - 6);
  }
  return { top, left };
}

export default function ChartCard({
  chartId,
  title,
  subtitle,
  defaults,
  availableTypes,
  exportRows,
  headerExtras,
  children,
}: Props) {
  const config = useChartConfig(chartId, defaults);
  const palette = palettes[config.palette];
  const chartRef = useRef<ChartJS | null>(null);

  const [openMenu, setOpenMenu] = useState<null | 'settings' | 'export'>(null);
  const [pos, setPos] = useState<PopoverPos | null>(null);

  const actionsRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const settingsBtnRef = useRef<HTMLButtonElement | null>(null);
  const exportBtnRef = useRef<HTMLButtonElement | null>(null);

  const openSettings = useCallback(() => {
    const r = settingsBtnRef.current?.getBoundingClientRect();
    if (r) setPos(computePosition(r, SETTINGS_WIDTH));
    setOpenMenu((m) => (m === 'settings' ? null : 'settings'));
  }, []);

  const openExport = useCallback(() => {
    const r = exportBtnRef.current?.getBoundingClientRect();
    if (r) setPos(computePosition(r, EXPORT_WIDTH, 420));
    setOpenMenu((m) => (m === 'export' ? null : 'export'));
  }, []);

  useEffect(() => {
    if (!openMenu) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (actionsRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      setOpenMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    const onResize = () => setOpenMenu(null);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [openMenu]);

  const displayTitle = config.title ?? title;
  const displaySubtitle = config.subtitle ?? subtitle;

  const popoverNode = openMenu && pos && (
    <div
      ref={popoverRef}
      className="chart-popover-portal"
      style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 1000 }}
    >
      {openMenu === 'settings' && (
        <ChartSettingsPopover
          chartId={chartId}
          config={config}
          availableTypes={availableTypes}
          defaults={defaults}
          onClose={() => setOpenMenu(null)}
        />
      )}
      {openMenu === 'export' && (
        <ChartExportMenu
          chartRef={chartRef}
          title={displayTitle}
          exportRows={exportRows}
          onClose={() => setOpenMenu(null)}
        />
      )}
    </div>
  );

  return (
    <div className="chart-card">
      <div className="chart-head">
        <div className="chart-head-text">
          <h3>{displayTitle}</h3>
          {displaySubtitle && <span className="chart-sub">{displaySubtitle}</span>}
        </div>
        <div className="chart-actions" ref={actionsRef}>
          {headerExtras}
          <button
            type="button"
            ref={settingsBtnRef}
            className="chart-icon-btn"
            aria-label="Chart settings"
            title="Anpassen"
            onClick={openSettings}
          >
            ⚙
          </button>
          <button
            type="button"
            ref={exportBtnRef}
            className="chart-icon-btn"
            aria-label="Export chart"
            title="Herunterladen"
            onClick={openExport}
          >
            ⬇
          </button>
        </div>
      </div>
      <div className="chart-canvas">{children({ palette, config, chartRef })}</div>
      {popoverNode && createPortal(popoverNode, document.body)}
    </div>
  );
}
