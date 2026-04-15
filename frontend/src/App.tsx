import { useEffect } from 'react';
import { NavLink, Route, Routes, Navigate, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ChartDetailPage from './pages/ChartDetailPage';
import Impressum from './pages/Impressum';
import ChartsMenu from './components/ChartsMenu';
import CurrencySwitcher from './components/CurrencySwitcher';
import LanguageSwitcher from './components/LanguageSwitcher';
import ThemeSwitcher from './components/ThemeSwitcher';
import { useLanguage } from './i18n/useLanguage';
import { useUiTheme } from './theme/useUiTheme';
import { useT } from './i18n/translations';

export default function App() {
  const lang = useLanguage((s) => s.lang);
  const mode = useUiTheme((s) => s.mode);
  const t = useT();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', mode === 'light' ? '#f5f7fb' : '#0b1120');
  }, [mode]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">💰</span>
          <span className="brand-name">LiquidHub</span>
        </div>
        <div className="app-header-right">
          <nav className="app-nav">
            <NavLink to="/dashboard">{t('nav.dashboard')}</NavLink>
            <ChartsMenu />
          </nav>
          <CurrencySwitcher />
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chart/:slug" element={<ChartDetailPage />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/profitability" element={<Navigate to="/chart/profitability" replace />} />
          <Route path="/liquidity" element={<Navigate to="/chart/liquidity" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
      <footer className="app-footer">
        <span>
          © {new Date().getFullYear()} {t('footer.copyright')}
        </span>
        <nav className="footer-nav">
          <Link to="/dashboard">{t('nav.dashboard')}</Link>
          <Link to="/impressum">{t('footer.impressum')}</Link>
          <a href="mailto:vorstand@pebs.eu">{t('footer.contact')}</a>
        </nav>
      </footer>
    </div>
  );
}
