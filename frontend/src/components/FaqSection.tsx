import { useState } from 'react';

type FaqItem = { q: string; a: string };

const FAQ: FaqItem[] = [
  {
    q: 'Was ist eine Liquiditätsplanung?',
    a: 'Eine Liquiditätsplanung ist eine systematische Vorausschau aller erwarteten Ein- und Auszahlungen eines Unternehmens über einen definierten Zeitraum. Sie zeigt, ob ein Unternehmen zu jedem Zeitpunkt zahlungsfähig bleibt, identifiziert Liquiditätslücken frühzeitig und ist Pflichtbestandteil jedes fundierten Businessplans.',
  },
  {
    q: 'Wie erstelle ich eine Cashflow-Prognose für meinen Businessplan?',
    a: 'Eine Cashflow-Prognose entsteht in vier Schritten: 1) Startkapital festlegen, 2) erwartete Einzahlungen pro Periode schätzen (Umsatz, Eigenkapital, Darlehen), 3) Auszahlungen zuordnen (Personal, Material, Miete, Steuern), 4) den kumulierten Kassenstand Periode für Periode fortschreiben. LiquidHub automatisiert die Berechnung und visualisiert das Ergebnis als Linien-, Area- oder Wasserfall-Chart.',
  },
  {
    q: 'Was ist der Unterschied zwischen Rentabilität und Liquidität?',
    a: 'Rentabilität misst den Gewinn im Verhältnis zum Umsatz oder eingesetzten Kapital — sie sagt, ob das Geschäftsmodell wirtschaftlich funktioniert. Liquidität hingegen misst die jederzeitige Zahlungsfähigkeit. Ein Unternehmen kann rentabel sein und trotzdem in eine Liquiditätskrise geraten, wenn Zahlungseingänge zeitlich verzögert sind.',
  },
  {
    q: 'Welche Daten brauche ich für eine Liquiditätsplanung?',
    a: 'Für jede Planungsperiode (meist Monat oder Quartal) benötigen Sie: Label, erwarteter Umsatz, erwartete Kosten, tatsächliche Einzahlungen (Cash In) und Auszahlungen (Cash Out). LiquidHub importiert diese Daten wahlweise als CSV oder JSON und zeigt sofort die resultierenden Grafiken an.',
  },
  {
    q: 'Ist LiquidHub kostenlos?',
    a: 'Ja. LiquidHub ist ein kostenfreies Tool der gemeinnützigen PEBS gUG. Es speichert keine Daten auf Servern, alle Eingaben verbleiben im Browser-Speicher (localStorage). Der Export der Grafiken als PNG, CSV oder JSON ist uneingeschränkt möglich.',
  },
  {
    q: 'Kann ich LiquidHub statt Excel für den Finanzplan nutzen?',
    a: 'LiquidHub ist eine spezialisierte Alternative zu Excel-Vorlagen für Finanzpläne: statt statischer Tabellen erhalten Sie interaktive, live aktualisierte Visualisierungen mit 13 Chart-Typen, individuellen Farbschemen, Multi-Währungs-Unterstützung und Export-Funktionen. Für einfache Gründungs-Businesspläne, Investoren-Pitches und Controlling-Reviews ist das Tool eine vollwertige Alternative.',
  },
  {
    q: 'Welche Chart-Typen unterstützt LiquidHub?',
    a: 'Balkendiagramm, gestapelte Balken, horizontale Balken, horizontale gestapelte Balken, Liniendiagramm, Flächendiagramm, Step-Linie, Kreisdiagramm, Donut, Polar-Area, Wasserfall und Combo-Charts mit zwei Y-Achsen. Jeder Chart-Typ lässt sich einzeln konfigurieren: Farbpalette, eigene Hex-Farben, Achsenbeschriftung, Legendenposition, Titel.',
  },
  {
    q: 'Unterstützt LiquidHub mehrere Währungen?',
    a: 'Ja. Neben Euro werden US-Dollar, Britisches Pfund, Schweizer Franken, Japanischer Yen, Chinesischer Yuan, Schwedische, Norwegische und Dänische Krone, Polnischer Złoty, Tschechische Krone sowie Kanadischer und Australischer Dollar unterstützt. Ein Umschalter im Header wechselt alle Grafiken und KPIs live.',
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="faq-section" aria-labelledby="faq-heading">
      <header className="faq-header">
        <h2 id="faq-heading">Häufig gestellte Fragen</h2>
        <p>
          Die meistgestellten Fragen rund um Liquiditätsplanung, Cashflow-Forecasts und
          Businessplan-Finanzteile — kurz und praxisnah beantwortet.
        </p>
      </header>
      <div className="faq-list">
        {FAQ.map((item, i) => {
          const open = openIdx === i;
          return (
            <article
              key={i}
              className={`faq-item${open ? ' open' : ''}`}
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <button
                type="button"
                className="faq-question"
                aria-expanded={open}
                onClick={() => setOpenIdx(open ? null : i)}
              >
                <span itemProp="name">{item.q}</span>
                <span className="faq-chevron" aria-hidden>
                  {open ? '−' : '+'}
                </span>
              </button>
              {open && (
                <div
                  className="faq-answer"
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <p itemProp="text">{item.a}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
