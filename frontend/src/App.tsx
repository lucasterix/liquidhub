import { NavLink, Route, Routes, Navigate, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ChartDetailPage from './pages/ChartDetailPage';
import Impressum from './pages/Impressum';
import ChartsMenu from './components/ChartsMenu';
import CurrencySwitcher from './components/CurrencySwitcher';

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">💰</span>
          <span className="brand-name">LiquidHub</span>
        </div>
        <div className="app-header-right">
          <nav className="app-nav">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <ChartsMenu />
          </nav>
          <CurrencySwitcher />
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
        <span>© {new Date().getFullYear()} PEBS gUG — LiquidHub Financial Dashboard</span>
        <nav className="footer-nav">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/impressum">Impressum</Link>
          <a href="mailto:vorstand@pebs.eu">Kontakt</a>
        </nav>
      </footer>
    </div>
  );
}
