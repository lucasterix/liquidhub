import { useState } from 'react';
import { paletteList, palettes, seriesColor, isValidHex } from '../theme/palettes';
import {
  ChartConfig,
  ChartTypeId,
  LegendPosition,
  useChartTheme,
} from '../theme/useChartTheme';
import { useT } from '../i18n/translations';

const TYPE_LABELS: Record<ChartTypeId, string> = {
  bar: 'Bar',
  'stacked-bar': 'Stacked Bar',
  'horizontal-bar': 'Horizontal Bar',
  'horizontal-bar-stacked': 'Horizontal Stacked',
  line: 'Line',
  area: 'Area',
  'step-line': 'Step Line',
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
  const [hexDrafts, setHexDrafts] = useState<Record<number, string>>({});
  const t = useT();
  const COLOR_SLOT_LABELS = [1, 2, 3, 4, 5, 6].map((n) => `${t('settings.series')} ${n}`);

  const update = (patch: Partial<ChartConfig>) => setConfig(chartId, patch);

  const activePalette = palettes[config.palette];

  const handleColorChange = (slot: number, raw: string) => {
    setHexDrafts((d) => ({ ...d, [slot]: raw }));
    if (isValidHex(raw)) {
      const next = [...(config.customColors ?? [])];
      while (next.length <= slot) next.push(null);
      next[slot] = raw;
      update({ customColors: next });
    }
  };

  const clearCustomColor = (slot: number) => {
    const next = [...(config.customColors ?? [])];
    if (slot < next.length) next[slot] = null;
    update({ customColors: next });
    setHexDrafts((d) => {
      const copy = { ...d };
      delete copy[slot];
      return copy;
    });
  };

  const clearAllCustom = () => {
    update({ customColors: [] });
    setHexDrafts({});
  };

  return (
    <div className="chart-popover" role="dialog" aria-label={t('settings.title')}>
      <div className="popover-head">
        <strong>{t('settings.title')}</strong>
        <button type="button" className="chart-icon-btn" onClick={onClose} aria-label="×">
          ×
        </button>
      </div>

      <div className="popover-section">
        <label className="popover-label">{t('settings.palette')}</label>
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
          title={t('settings.setGlobal')}
        >
          {t('settings.setGlobal')}
        </button>
      </div>

      <div className="popover-section">
        <label className="popover-label">{t('settings.customColors')}</label>
        <div className="color-slots">
          {COLOR_SLOT_LABELS.map((label, slot) => {
            const override = config.customColors?.[slot] ?? null;
            const effective = seriesColor(activePalette, slot, config.customColors);
            const draft = hexDrafts[slot] ?? override ?? '';
            return (
              <div key={slot} className="color-slot">
                <label className="color-slot-label">{label}</label>
                <div className="color-slot-row">
                  <span className="color-swatch" style={{ background: effective }} />
                  <input
                    type="color"
                    value={isValidHex(draft) ? draft : effective}
                    onChange={(e) => handleColorChange(slot, e.target.value)}
                    aria-label={`${label} Farbwähler`}
                  />
                  <input
                    type="text"
                    value={draft}
                    placeholder={effective}
                    onChange={(e) => handleColorChange(slot, e.target.value)}
                    className="hex-input"
                    aria-label={`${label} Hex-Code`}
                  />
                  {override && (
                    <button
                      type="button"
                      className="chart-icon-btn small"
                      onClick={() => clearCustomColor(slot)}
                      title={t('settings.reset')}
                      aria-label={t('settings.reset')}
                    >
                      ↺
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {config.customColors && config.customColors.some((c) => c) && (
          <button type="button" className="link-btn" onClick={clearAllCustom}>
            {t('settings.removeAllCustom')}
          </button>
        )}
      </div>

      {availableTypes && availableTypes.length > 1 && (
        <div className="popover-section">
          <label className="popover-label">{t('settings.chartType')}</label>
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
        <label className="popover-label">{t('settings.appearance')}</label>
        <div className="toggle-row">
          <label className="toggle">
            <input
              type="checkbox"
              checked={config.showLegend}
              onChange={(e) => update({ showLegend: e.target.checked })}
            />
            <span>{t('settings.toggleLegend')}</span>
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={config.showGrid}
              onChange={(e) => update({ showGrid: e.target.checked })}
            />
            <span>{t('settings.toggleGrid')}</span>
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={config.beginAtZero}
              onChange={(e) => update({ beginAtZero: e.target.checked })}
            />
            <span>{t('settings.toggleYZero')}</span>
          </label>
        </div>
      </div>

      {config.showLegend && (
        <div className="popover-section">
          <label className="popover-label">{t('settings.legendPosition')}</label>
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
          {t('settings.smoothing')} <span className="dim">{config.tension.toFixed(2)}</span>
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
        <label className="popover-label">{t('settings.titleLabel')}</label>
        <input
          type="text"
          value={config.title ?? ''}
          placeholder={t('settings.titlePlaceholder')}
          onChange={(e) => update({ title: e.target.value || undefined })}
        />
        <input
          type="text"
          value={config.subtitle ?? ''}
          placeholder={t('settings.subtitlePlaceholder')}
          onChange={(e) => update({ subtitle: e.target.value || undefined })}
        />
      </div>

      <div className="popover-footer">
        <button
          type="button"
          className="link-btn"
          onClick={() => {
            resetConfig(chartId);
            setHexDrafts({});
            onClose();
          }}
        >
          {t('settings.resetDefault')}
        </button>
        <span className="dim">
          {palettes[config.palette].name} · {TYPE_LABELS[config.chartType] ?? config.chartType}
        </span>
      </div>
    </div>
  );
}
