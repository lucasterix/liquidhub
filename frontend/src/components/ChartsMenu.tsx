import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { chartCatalog } from './chartCatalog';

export default function ChartsMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const activeChart = location.pathname.startsWith('/chart/');

  return (
    <div className="charts-menu" ref={wrapRef}>
      <button
        type="button"
        className={`charts-menu-trigger${activeChart ? ' active' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        Grafen
        <span className="chevron" aria-hidden>{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div className="charts-menu-dropdown" role="menu">
          <div className="charts-menu-head">Alle Grafen</div>
          {chartCatalog.map((c) => (
            <NavLink
              key={c.slug}
              to={`/chart/${c.slug}`}
              className="charts-menu-item"
              role="menuitem"
            >
              <strong>{c.title}</strong>
              <span className="dim">{c.subtitle}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
