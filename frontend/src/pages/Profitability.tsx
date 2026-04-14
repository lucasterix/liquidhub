import KpiCards from '../components/KpiCards';
import ProfitabilityChart from '../components/ProfitabilityChart';
import DataInput from '../components/DataInput';

export default function Profitability() {
  return (
    <div className="page">
      <section className="page-hero">
        <div>
          <h1>Profitability</h1>
          <p className="subtitle">
            Umsatz, Kosten und Gewinnspanne je Periode – inklusive aggregierter KPIs.
          </p>
        </div>
      </section>
      <KpiCards />
      <div className="chart-grid">
        <ProfitabilityChart />
      </div>
      <DataInput />
    </div>
  );
}
