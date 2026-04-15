import { useParams, Link, Navigate } from 'react-router-dom';
import { findChartBySlug, localizedCatalog } from '../components/chartCatalog';
import ChartDataInput from '../components/ChartDataInput';
import { useT } from '../i18n/translations';

export default function ChartDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const t = useT();
  const base = slug ? findChartBySlug(slug) : undefined;

  if (!base) return <Navigate to="/dashboard" replace />;

  const ChartComponent = base.component;
  const title = t(base.titleKey);
  const description = t(base.descriptionKey);
  const catalog = localizedCatalog(t);

  return (
    <div className="page chart-detail">
      <section className="page-hero">
        <div>
          <nav className="breadcrumb">
            <Link to="/dashboard">{t('detail.breadcrumbHome')}</Link>
            <span className="sep">›</span>
            <span>{title}</span>
          </nav>
          <h1>{title}</h1>
          <p className="subtitle">{description}</p>
        </div>
        <div className="hero-actions">
          <Link to="/dashboard" className="button-link">
            {t('detail.back')}
          </Link>
        </div>
      </section>

      <div className="chart-grid chart-grid-single">
        <ChartComponent />
      </div>

      <ChartDataInput chartId={base.id} chartTitle={title} />

      <section className="chart-related">
        <h3>{t('detail.related')}</h3>
        <div className="chart-related-list">
          {catalog
            .filter((c) => c.slug !== base.slug)
            .map((c) => (
              <Link key={c.slug} to={`/chart/${c.slug}`} className="chart-related-item">
                <strong>{c.title}</strong>
                <span className="dim">{c.subtitle}</span>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
