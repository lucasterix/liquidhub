import { useParams, Link, Navigate } from 'react-router-dom';
import { findChartBySlug, chartCatalog } from '../components/chartCatalog';
import ChartDataInput from '../components/ChartDataInput';

export default function ChartDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const meta = slug ? findChartBySlug(slug) : undefined;

  if (!meta) return <Navigate to="/dashboard" replace />;

  const ChartComponent = meta.component;

  return (
    <div className="page chart-detail">
      <section className="page-hero">
        <div>
          <nav className="breadcrumb">
            <Link to="/dashboard">Dashboard</Link>
            <span className="sep">›</span>
            <span>{meta.title}</span>
          </nav>
          <h1>{meta.title}</h1>
          <p className="subtitle">{meta.description}</p>
        </div>
        <div className="hero-actions">
          <Link to="/dashboard" className="button-link">
            ← Zurück zur Übersicht
          </Link>
        </div>
      </section>

      <div className="chart-grid chart-grid-single">
        <ChartComponent />
      </div>

      <ChartDataInput chartId={meta.id} chartTitle={meta.title} />

      <section className="chart-related">
        <h3>Weitere Grafen</h3>
        <div className="chart-related-list">
          {chartCatalog
            .filter((c) => c.slug !== meta.slug)
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
