import { Link } from 'react-router-dom';
import KpiCards from '../components/KpiCards';
import DataInput from '../components/DataInput';
import GlobalPaletteSwitcher from '../components/GlobalPaletteSwitcher';
import AboutSection from '../components/AboutSection';
import FaqSection from '../components/FaqSection';
import { useDataStore } from '../store/useDataStore';
import { chartCatalog } from '../components/chartCatalog';

export default function Dashboard() {
  const loadSample = useDataStore((s) => s.loadSample);
  const reset = useDataStore((s) => s.reset);
  const chartOverrides = useDataStore((s) => s.chartOverrides);

  return (
    <div className="page dashboard">
      <section className="page-hero">
        <div>
          <h1>Finanz-Dashboard</h1>
          <p className="subtitle">
            Erstelle Rentabilitäts- und Liquiditätsprognosen für deinen Businessplan.
            Öffne einen einzelnen Grafen, um ihm eigene Planungsdaten zuzuweisen,
            oder passe Farben und Chart-Typen individuell an. Alle Grafiken sind
            als PNG, CSV oder JSON herunterladbar.
          </p>
        </div>
        <div className="hero-actions">
          <button type="button" onClick={loadSample}>Beispieldaten</button>
          <button type="button" className="primary" onClick={() => reset()}>
            Reset
          </button>
        </div>
      </section>

      <GlobalPaletteSwitcher />

      <KpiCards />

      <div className="chart-grid">
        {chartCatalog.map((meta) => {
          const Component = meta.component;
          const hasOverride = chartOverrides[meta.id]?.enabled;
          return (
            <div key={meta.id} className="chart-slot">
              <Component />
              <div className="chart-slot-footer">
                {hasOverride && <span className="badge-override">eigene Daten</span>}
                <Link to={`/chart/${meta.slug}`} className="chart-slot-link">
                  Details & Planung →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <DataInput />

      <AboutSection />

      <FaqSection />
    </div>
  );
}
