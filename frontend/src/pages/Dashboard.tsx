import { Link } from 'react-router-dom';
import KpiCards from '../components/KpiCards';
import DataInput from '../components/DataInput';
import GlobalPaletteSwitcher from '../components/GlobalPaletteSwitcher';
import AboutSection from '../components/AboutSection';
import FaqSection from '../components/FaqSection';
import { useDataStore } from '../store/useDataStore';
import { chartCatalog } from '../components/chartCatalog';
import { useT } from '../i18n/translations';

export default function Dashboard() {
  const loadSample = useDataStore((s) => s.loadSample);
  const reset = useDataStore((s) => s.reset);
  const chartOverrides = useDataStore((s) => s.chartOverrides);
  const t = useT();

  return (
    <div className="page dashboard">
      <section className="page-hero">
        <div>
          <h1>{t('dashboard.title')}</h1>
          <p className="subtitle">{t('dashboard.subtitle')}</p>
        </div>
        <div className="hero-actions">
          <button type="button" onClick={loadSample}>{t('dashboard.loadSample')}</button>
          <button type="button" className="primary" onClick={() => reset()}>
            {t('dashboard.reset')}
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
                {hasOverride && <span className="badge-override">{t('dashboard.badgeOverride')}</span>}
                <Link to={`/chart/${meta.slug}`} className="chart-slot-link">
                  {t('dashboard.slotLink')}
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
