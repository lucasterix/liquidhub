export default function AboutSection() {
  return (
    <section className="about-section" aria-labelledby="about-heading">
      <header className="about-header">
        <h2 id="about-heading">
          LiquidHub — Professionelle Liquiditätsplanung & Cashflow-Forecasts
        </h2>
        <p className="about-lead">
          LiquidHub ist ein webbasiertes Dashboard für Rentabilitäts- und
          Liquiditätsprognosen. Es richtet sich an Gründer:innen, Geschäftsführungen
          kleiner und mittelständischer Unternehmen, Unternehmensberater:innen und
          Controller:innen, die Finanzkennzahlen schnell visualisieren und
          Businesspläne auf eine solide Zahlenbasis stellen wollen.
        </p>
      </header>

      <div className="about-grid">
        <article>
          <h3>Rentabilitätsprognose</h3>
          <p>
            Erfassen Sie Umsatz, Kosten und Gewinn pro Periode und vergleichen Sie
            Szenarien direkt nebeneinander. Stacked-Bar-, Horizontal-Bar- und
            Kombi-Ansichten zeigen auf einen Blick, wie sich das Verhältnis von
            Erlösen zu Ausgaben entwickelt und wo die Margen-Hebel liegen.
          </p>
        </article>
        <article>
          <h3>Liquiditätsforecast</h3>
          <p>
            Projektieren Sie den Kassenstand über Monate oder Quartale hinweg,
            inklusive Netto-Cashflow und Liquiditätstief. Das gestapelte
            Area-Diagramm macht Engpässe sofort sichtbar, bevor sie zu echten
            Finanzierungslücken werden.
          </p>
        </article>
        <article>
          <h3>Profit-Waterfall</h3>
          <p>
            Visualisieren Sie Periode für Periode, welchen Beitrag jeder Monat zum
            kumulierten Gesamtergebnis leistet. Positive Entwicklung wird
            hervorgehoben, negative Beiträge bleiben deutlich erkennbar.
          </p>
        </article>
        <article>
          <h3>Kostenstruktur & KPIs</h3>
          <p>
            Doughnut-, Pie- und Polar-Diagramme zeigen die prozentuale Kostenverteilung;
            die KPI-Leiste aggregiert Total-Umsatz, Total-Kosten, Marge, Ending Cash
            und Liquiditätstief in fünf Kennzahlen.
          </p>
        </article>
        <article>
          <h3>13 Währungen, exportierbar</h3>
          <p>
            Wechseln Sie live zwischen EUR, USD, GBP, CHF, JPY, CNY, SEK, NOK, DKK,
            PLN, CZK, CAD und AUD — alle Achsen, Tooltips und KPIs formatieren sich
            automatisch nach dem jeweiligen Locale. Jeder Chart ist als PNG
            (1x/2x/3x), CSV oder JSON exportierbar.
          </p>
        </article>
        <article>
          <h3>Individualisierung</h3>
          <p>
            Acht professionelle Farbpaletten sowie freie Hex-Farben pro Serie,
            editierbare Titel, Legendenposition, Smoothing, Grid-Sichtbarkeit und
            13 Chart-Typen. Jeder Graph kann zusätzlich mit eigenen Planungsdaten
            befüllt werden, unabhängig vom globalen Datensatz.
          </p>
        </article>
      </div>

      <div className="about-usecases">
        <h3>Typische Einsatzszenarien</h3>
        <ul>
          <li>
            <strong>Businessplan für Gründer:innen:</strong> Drei-Jahres-Finanzplan
            inklusive Rentabilitätsvorschau und Liquiditätsforecast — als PNG-Export
            direkt ins Pitch-Deck einfügen.
          </li>
          <li>
            <strong>Investoren-Pitch:</strong> Wasserfall-Chart und Margen-Combo
            zeigen Investoren auf einen Blick, wie sich das Geschäftsmodell
            finanziell entwickelt.
          </li>
          <li>
            <strong>Controlling & Monatsreport:</strong> Aktuelle IST-Werte importieren,
            Abweichungen vom Plan erkennen, individuelle Farbschemen passend zum
            Corporate Design.
          </li>
          <li>
            <strong>Beratungsmandate:</strong> Schneller Szenarien-Vergleich durch
            per-Chart-Overrides. Best-Case, Base-Case und Worst-Case parallel halten.
          </li>
          <li>
            <strong>Hochschul- und Weiterbildungskontexte:</strong> Praxisnahes Werkzeug
            zur Vermittlung der Unterschiede zwischen GuV, Cashflow-Rechnung und
            Liquiditätsplanung.
          </li>
        </ul>
      </div>
    </section>
  );
}
