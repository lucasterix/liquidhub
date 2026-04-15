import { ReactNode, useRef, useState, useEffect, MutableRefObject } from 'react';
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
  children: (args: ChartCardRenderArgs) => ReactNode;
};

export default function ChartCard({
  chartId,
  title,
  subtitle,
  defaults,
  availableTypes,
  exportRows,
  children,
}: Props) {
  const config = useChartConfig(chartId, defaults);
  const palette = palettes[config.palette];
  const chartRef = useRef<ChartJS | null>(null);

  const [openMenu, setOpenMenu] = useState<null | 'settings' | 'export'>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!openMenu) return;
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [openMenu]);

  const displayTitle = config.title ?? title;
  const displaySubtitle = config.subtitle ?? subtitle;

  return (
    <div className="chart-card" ref={containerRef}>
      <div className="chart-head">
        <div className="chart-head-text">
          <h3>{displayTitle}</h3>
          {displaySubtitle && <span className="chart-sub">{displaySubtitle}</span>}
        </div>
        <div className="chart-actions">
          <button
            type="button"
            className="chart-icon-btn"
            aria-label="Chart settings"
            title="Anpassen"
            onClick={() => setOpenMenu(openMenu === 'settings' ? null : 'settings')}
          >
            ⚙
          </button>
          <button
            type="button"
            className="chart-icon-btn"
            aria-label="Export chart"
            title="Herunterladen"
            onClick={() => setOpenMenu(openMenu === 'export' ? null : 'export')}
          >
            ⬇
          </button>
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
      </div>
      <div className="chart-canvas">{children({ palette, config, chartRef })}</div>
    </div>
  );
}
