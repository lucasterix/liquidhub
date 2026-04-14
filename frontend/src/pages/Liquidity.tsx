import KpiCards from '../components/KpiCards';
import LiquidityChart from '../components/LiquidityChart';
import DataInput from '../components/DataInput';

export default function Liquidity() {
  return (
    <div className="page">
      <section className="page-hero">
        <div>
          <h1>Liquidity</h1>
          <p className="subtitle">
            Cashflow-Entwicklung und Kassenstand über den Planungszeitraum hinweg.
          </p>
        </div>
      </section>
      <KpiCards />
      <div className="chart-grid">
        <LiquidityChart />
      </div>
      <DataInput />
    </div>
  );
}
