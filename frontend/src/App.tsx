import { NavLink, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ChartDetailPage from './pages/ChartDetailPage';
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
          <Route path="/profitability" element={<Navigate to="/chart/profitability" replace />} />
          <Route path="/liquidity" element={<Navigate to="/chart/liquidity" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
      <footer className="app-footer">LiquidHub — Financial Graphics Dashboard</footer>
    </div>
  );
}
