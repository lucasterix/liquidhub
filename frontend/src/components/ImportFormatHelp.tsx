import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { CSV_EXAMPLE, JSON_EXAMPLE } from '../lib/sampleData';
import { useT } from '../i18n/translations';

type Pos = { top: number; left: number };

const WIDTH = 460;

function computePosition(anchor: DOMRect): Pos {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let left = anchor.right - WIDTH;
  if (left < 8) left = 8;
  if (left + WIDTH > vw - 8) left = vw - WIDTH - 8;
  let top = anchor.bottom + 6;
  if (top + 420 > vh - 8) top = Math.max(8, anchor.top - 420 - 6);
  return { top, left };
}

export default function ImportFormatHelp() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);
  const t = useT();

  const toggle = useCallback(() => {
    const r = btnRef.current?.getBoundingClientRect();
    if (r) setPos(computePosition(r));
    setOpen((v) => !v);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t)) return;
      if (popRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onResize = () => setOpen(false);
    const onScroll = (e: Event) => {
      const t = e.target as Node | null;
      if (t && popRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [open]);

  const popover = open && pos && (
    <div
      ref={popRef}
      className="chart-popover-portal"
      style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 1000 }}
    >
      <div className="chart-popover import-help">
        <div className="popover-head">
          <strong>{t('help.title')}</strong>
          <button
            type="button"
            className="chart-icon-btn small"
            onClick={() => setOpen(false)}
            aria-label="×"
          >
            ×
          </button>
        </div>
        <div className="popover-section">
          <p className="import-help-intro">
            {t('help.intro')} <code>label</code>, <code>revenue</code>,{' '}
            <code>costs</code>, <code>cashIn</code>, <code>cashOut</code>{' '}
            {t('help.introSuffix')}
          </p>
        </div>
        <div className="popover-section">
          <label className="popover-label">{t('help.csvExample')}</label>
          <pre className="code-block">{CSV_EXAMPLE}</pre>
        </div>
        <div className="popover-section">
          <label className="popover-label">{t('help.jsonExample')}</label>
          <pre className="code-block">{JSON_EXAMPLE}</pre>
        </div>
        <div className="popover-section">
          <span className="dim">{t('help.tip')}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        ref={btnRef}
        className="help-icon-btn"
        onClick={toggle}
        aria-label={t('help.title')}
        aria-expanded={open}
        title={t('help.title')}
      >
        ?
      </button>
      {popover && createPortal(popover, document.body)}
    </>
  );
}
