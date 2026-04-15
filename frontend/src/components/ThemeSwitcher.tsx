import { useUiTheme } from '../theme/useUiTheme';
import { useT } from '../i18n/translations';

export default function ThemeSwitcher() {
  const mode = useUiTheme((s) => s.mode);
  const toggle = useUiTheme((s) => s.toggleMode);
  const t = useT();

  return (
    <button
      type="button"
      className="theme-switcher"
      onClick={toggle}
      aria-label={t('header.themeTitle')}
      title={t('header.themeTitle')}
    >
      <span aria-hidden>{mode === 'dark' ? '☀' : '☾'}</span>
    </button>
  );
}
