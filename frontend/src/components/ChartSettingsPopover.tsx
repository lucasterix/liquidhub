import { paletteList, palettes } from '../theme/palettes';
import {
  ChartConfig,
  ChartTypeId,
  LegendPosition,
  useChartTheme,
} from '../theme/useChartTheme';

const TYPE_LABELS: Record<ChartTypeId, string> = {
  bar: 'Bar',
  'stacked-bar': 'Stacked Bar',
  line: 'Line',
  area: 'Area',
  doughnut: 'Doughnut',
  pie: 'Pie',
  polarArea: 'Polar',
  radar: 'Radar',
  waterfall: 'Waterfall',
  combo: 'Combo',
};

const LEGEND_POSITIONS: LegendPosition[] = ['top', 'bottom', 'left', 'right'];

type Props = {
  chartId: string;
  config: ChartConfig;
  availableTypes?: ChartTypeId[];
  defaults?: Partial<ChartConfig>;
  onClose: () => void;
};

export default function ChartSettingsPopover({
  chartId,
  config,
  availableTypes,
  onClose,
}: Props) {
  const setConfig = useChartTheme((s) => s.setConfig);
  const resetConfig = useChartTheme((s) => s.resetConfig);
  const setGlobalPalette = useChartTheme((s) => s.setGlobalPalette);

  const update = (patch: Partial<ChartConfig>) => setConfig(chartId, patch);

  return (
    <div className="chart-popover" role="dialog" aria-label="Chart-Einstellungen">
      <div className="popover-head">
        <strong>Anpassen</strong>
        <button type="button" className="chart-icon-btn" onClick={onClose} aria-label="Schließen">
          ×
        </button>
      </div>

      <div className="popover-section">
        <label className="popover-label">Farbpalette</label>
        <div className="palette-grid">
          {paletteList.map((p) => {
            const active = p.id === config.palette;
            return (
              <button
                key={p.id}
                type="button"
                className={`palette-chip${active ? ' active' : ''}`}
                onClick={() => update({ palette: p.id })}
                title={p.name}
              >
                <div className="palette-swatches">
                  {p.series.slice(0, 5).map((c, i) => (
                    <span key={i} style={{ background: c }} />
                  ))}
                </div>
                <span className="palette-name">{p.name}</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className="link-btn"
          onClick={() => setGlobalPalette(config.palette)}
          title="Aktive Palette als globalen Standard setzen"
        >
          Als globales Theme setzen
        </button>
      </div>

      {availableTypes && availableTypes.length > 1 && (
        <div className="popover-section">
          <label className="popover-label">Chart-Typ</label>
          <div className="type-grid">
            {availableTypes.map((t) => (
              <button
                key={t}
                type="button"
                className={`type-chip${t === config.chartType ? ' active' : ''}`}
                onClick={() => update({ chartType: t })}
              >
                {TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="popover-section">
        <label className="popover-label">Darstellung</label>
        <div className="toggle-row">
          <label className="toggle">
            <input
              type="checkbox"
              checked={config.showLegend}
              onChange={(e) => update({ showLegend: e.target.checked })}
            />
            <span>Legende</span>
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={config.showGrid}
              onChange={(e) => update({ showGrid: e.target.checked })}
            />
            <span>Gitter</span>
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={config.fill}
              onChange={(e) => update({ fill: e.target.checked })}
            />
            <span>Füllung</span>
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={config.beginAtZero}
              onChange={(e) => update({ beginAtZero: e.target.checked })}
            />
            <span>Y bei 0</span>
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={config.showDataLabels}
              onChange={(e) => update({ showDataLabels: e.target.checked })}
            />
            <span>Datenwerte</span>
          </label>
        </div>
      </div>

      {config.showLegend && (
        <div className="popover-section">
          <label className="popover-label">Legenden-Position</label>
          <div className="type-grid">
            {LEGEND_POSITIONS.map((pos) => (
              <button
                key={pos}
                type="button"
                className={`type-chip${pos === config.legendPosition ? ' active' : ''}`}
                onClick={() => update({ legendPosition: pos })}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="popover-section">
        <label className="popover-label">
          Linien-Smoothing <span className="dim">{config.tension.toFixed(2)}</span>
        </label>
        <input
          type="range"
          min={0}
          max={0.6}
          step={0.05}
          value={config.tension}
          onChange={(e) => update({ tension: Number(e.target.value) })}
        />
      </div>

      <div className="popover-section">
        <label className="popover-label">Titel</label>
        <input
          type="text"
          value={config.title ?? ''}
          placeholder="Standard-Titel verwenden"
          onChange={(e) => update({ title: e.target.value || undefined })}
        />
        <input
          type="text"
          value={config.subtitle ?? ''}
          placeholder="Untertitel"
          onChange={(e) => update({ subtitle: e.target.value || undefined })}
        />
      </div>

      <div className="popover-footer">
        <button
          type="button"
          className="link-btn"
          onClick={() => {
            resetConfig(chartId);
            onClose();
          }}
        >
          Auf Standard zurücksetzen
        </button>
        <span className="dim">
          {palettes[config.palette].name} · {TYPE_LABELS[config.chartType] ?? config.chartType}
        </span>
      </div>
    </div>
  );
}
