import KpiCards from '../components/KpiCards';
import ProfitabilityChart from '../components/ProfitabilityChart';
import LiquidityChart from '../components/LiquidityChart';
import CostStructureChart from '../components/CostStructureChart';
import WaterfallChart from '../components/WaterfallChart';
import RevenueMarginChart from '../components/RevenueMarginChart';
import CashFlowChart from '../components/CashFlowChart';
import GlobalPaletteSwitcher from '../components/GlobalPaletteSwitcher';
import DataInput from '../components/DataInput';
import { useDataStore } from '../store/useDataStore';

export default function Dashboard() {
  const loadSample = useDataStore((s) => s.loadSample);
  const reset = useDataStore((s) => s.reset);

  return (
    <div className="page dashboard">
      <section className="page-hero">
        <div>
          <h1>Finanz-Dashboard</h1>
          <p className="subtitle">
            Erstelle Rentabilitäts- und Liquiditätsprognosen für deinen Businessplan.
            Trage deine Daten ein oder importiere eine CSV – die Grafiken aktualisieren
            sich live. Jeder Chart ist individuell anpassbar und als PNG / CSV / JSON
            herunterladbar.
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
        <ProfitabilityChart />
        <LiquidityChart />
        <RevenueMarginChart />
        <CashFlowChart />
        <WaterfallChart />
        <CostStructureChart />
      </div>

      <DataInput />
    </div>
  );
}
