import { useState, useRef, useEffect } from 'react';
import { currencies, currencyList, useCurrency, CurrencyCode } from '../store/useCurrency';

export default function CurrencySwitcher() {
  const code = useCurrency((s) => s.code);
  const setCurrency = useCurrency((s) => s.setCurrency);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

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

  const current = currencies[code];

  return (
    <div className="currency-switcher" ref={wrapRef}>
      <button
        type="button"
        className="currency-switcher-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        title="Währung wechseln"
      >
        <span className="currency-symbol">{current.symbol}</span>
        <span className="currency-code">{current.code}</span>
        <span className="chevron" aria-hidden>{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div className="currency-switcher-dropdown" role="listbox">
          {currencyList.map((c) => (
            <button
              key={c.code}
              type="button"
              role="option"
              aria-selected={c.code === code}
              className={`currency-option${c.code === code ? ' active' : ''}`}
              onClick={() => {
                setCurrency(c.code as CurrencyCode);
                setOpen(false);
              }}
            >
              <span className="currency-option-symbol">{c.symbol}</span>
              <div className="currency-option-text">
                <strong>{c.code}</strong>
                <span className="dim">{c.label}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
