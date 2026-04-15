import { paletteList } from '../theme/palettes';
import { useChartTheme } from '../theme/useChartTheme';
import { useT } from '../i18n/translations';

export default function GlobalPaletteSwitcher() {
  const globalPalette = useChartTheme((s) => s.globalPalette);
  const setGlobalPalette = useChartTheme((s) => s.setGlobalPalette);
  const resetAll = useChartTheme((s) => s.resetAll);
  const t = useT();

  return (
    <div className="palette-switcher">
      <span className="palette-switcher-label">{t('palette.label')}</span>
      <div className="palette-switcher-chips">
        {paletteList.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`palette-chip-mini${p.id === globalPalette ? ' active' : ''}`}
            onClick={() => setGlobalPalette(p.id)}
            title={p.name}
            aria-label={p.name}
          >
            <span style={{ background: p.series[0] }} />
            <span style={{ background: p.series[1] }} />
            <span style={{ background: p.series[2] }} />
          </button>
        ))}
      </div>
      <button
        type="button"
        className="link-btn"
        onClick={resetAll}
        title={t('palette.resetOverrides')}
      >
        {t('palette.resetOverrides')}
      </button>
    </div>
  );
}
