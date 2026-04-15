import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { localizedCatalog } from './chartCatalog';
import { useT } from '../i18n/translations';

export default function ChartsMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const t = useT();
  const catalog = localizedCatalog(t);

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
        {t('nav.charts')}
        <span className="chevron" aria-hidden>{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div className="charts-menu-dropdown" role="menu">
          <div className="charts-menu-head">{t('nav.chartsHead')}</div>
          {catalog.map((c) => (
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
