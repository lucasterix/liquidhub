import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { CSV_EXAMPLE, JSON_EXAMPLE } from '../lib/sampleData';

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
    const onClose = () => setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onClose);
    window.addEventListener('scroll', onClose, true);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onClose);
      window.removeEventListener('scroll', onClose, true);
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
          <strong>Import-Format</strong>
          <button
            type="button"
            className="chart-icon-btn small"
            onClick={() => setOpen(false)}
            aria-label="Schließen"
          >
            ×
          </button>
        </div>
        <div className="popover-section">
          <p className="import-help-intro">
            Planungsdaten können als CSV oder JSON importiert werden. Jede Zeile
            entspricht einer Periode mit den Feldern <code>label</code>,{' '}
            <code>revenue</code>, <code>costs</code>, <code>cashIn</code> und{' '}
            <code>cashOut</code> (alle Beträge als Zahl ohne Währungssymbol).
          </p>
        </div>
        <div className="popover-section">
          <label className="popover-label">CSV-Beispiel</label>
          <pre className="code-block">{CSV_EXAMPLE}</pre>
        </div>
        <div className="popover-section">
          <label className="popover-label">JSON-Beispiel</label>
          <pre className="code-block">{JSON_EXAMPLE}</pre>
        </div>
        <div className="popover-section">
          <span className="dim">
            Tipp: Lade dir einen bestehenden Graphen als CSV/JSON herunter
            (⬇-Icon auf jedem Chart), passe ihn im Editor an und importiere ihn
            wieder hoch.
          </span>
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
        aria-label="Import-Format anzeigen"
        aria-expanded={open}
        title="Welches Format erwartet der Import?"
      >
        ?
      </button>
      {popover && createPortal(popover, document.body)}
    </>
  );
}
