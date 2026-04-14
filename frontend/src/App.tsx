import { NavLink, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Profitability from './pages/Profitability';
import Liquidity from './pages/Liquidity';

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">💰</span>
          <span className="brand-name">LiquidHub</span>
        </div>
        <nav className="app-nav">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/profitability">Profitability</NavLink>
          <NavLink to="/liquidity">Liquidity</NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profitability" element={<Profitability />} />
          <Route path="/liquidity" element={<Liquidity />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
      <footer className="app-footer">LiquidHub — Financial Graphics Dashboard</footer>
    </div>
  );
}
