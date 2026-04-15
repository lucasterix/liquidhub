import { useLanguage, Lang } from './useLanguage';

type Dict = Record<string, string>;

const de: Dict = {
  // Header / nav
  'nav.dashboard': 'Dashboard',
  'nav.charts': 'Grafen',
  'nav.chartsHead': 'Alle Grafen',
  'header.currencyTitle': 'Währung wechseln',
  'header.languageTitle': 'Sprache wechseln',
  'header.themeTitle': 'Hell/Dunkel wechseln',

  // Dashboard hero
  'dashboard.title': 'Finanz-Dashboard',
  'dashboard.subtitle':
    'Erstelle Rentabilitäts- und Liquiditätsprognosen für deinen Businessplan. Öffne einen einzelnen Grafen, um ihm eigene Planungsdaten zuzuweisen, oder passe Farben und Chart-Typen individuell an. Alle Grafiken sind als PNG, CSV oder JSON herunterladbar.',
  'dashboard.loadSample': 'Beispieldaten',
  'dashboard.reset': 'Reset',
  'dashboard.slotLink': 'Details & Planung →',
  'dashboard.badgeOverride': 'eigene Daten',

  // KPI cards
  'kpi.totalRevenue': 'Total Revenue',
  'kpi.totalCosts': 'Total Costs',
  'kpi.profit': 'Gewinn',
  'kpi.endingCash': 'Ending Cash',
  'kpi.minCash': 'Liquiditäts-Tief',
  'kpi.periods': 'Perioden',
  'kpi.sumAll': 'Summe aller Ausgaben',
  'kpi.margin': 'Marge',
  'kpi.vsStart': 'vs. Start',
  'kpi.bottleneck': 'Engpass!',
  'kpi.healthy': 'im grünen Bereich',

  // Global palette switcher
  'palette.label': 'Theme',
  'palette.resetOverrides': 'Reset Overrides',

  // Chart actions
  'chart.settingsTitle': 'Anpassen',
  'chart.exportTitle': 'Herunterladen',
  'chart.settingsLabel': 'Chart settings',
  'chart.exportLabel': 'Export chart',

  // Settings popover
  'settings.title': 'Anpassen',
  'settings.palette': 'Farbpalette',
  'settings.setGlobal': 'Als globales Theme setzen',
  'settings.customColors': 'Eigene Farben (Hex)',
  'settings.removeAllCustom': 'Alle eigenen Farben entfernen',
  'settings.chartType': 'Chart-Typ',
  'settings.appearance': 'Darstellung',
  'settings.toggleLegend': 'Legende',
  'settings.toggleGrid': 'Gitter',
  'settings.toggleYZero': 'Y bei 0',
  'settings.legendPosition': 'Legenden-Position',
  'settings.smoothing': 'Linien-Smoothing',
  'settings.titleLabel': 'Titel',
  'settings.titlePlaceholder': 'Standard-Titel verwenden',
  'settings.subtitlePlaceholder': 'Untertitel',
  'settings.resetDefault': 'Auf Standard zurücksetzen',
  'settings.series': 'Serie',
  'settings.reset': 'Zurücksetzen',

  // Export menu
  'export.title': 'Export',
  'export.transparent': 'Transparenter Hintergrund',
  'export.png': 'PNG',
  'export.pngStandard': 'Standard-Auflösung',
  'export.png2x': 'PNG @2x',
  'export.pngHires': 'Hohe Auflösung',
  'export.png3x': 'PNG @3x',
  'export.pngPrint': 'Print-Qualität',
  'export.clipboard': 'In Zwischenablage',
  'export.clipboardSub': 'Als Bild kopieren',
  'export.csv': 'CSV',
  'export.csvSub': 'Rohdaten tabellarisch',
  'export.json': 'JSON',
  'export.jsonSub': 'Strukturierte Daten',

  // Data input
  'data.planning': 'Planungsdaten',
  'data.hint': 'Label, Umsatz, Kosten, Cash In/Out pro Periode',
  'data.loadSample': 'Load sample',
  'data.random': '🎲 Zufallsdaten',
  'data.randomTitle': 'Realistische Zufallszahlen',
  'data.import': 'Import CSV / JSON',
  'data.startingCash': 'Starting cash',
  'data.colPeriod': 'Period',
  'data.colRevenue': 'Revenue',
  'data.colCosts': 'Costs',
  'data.colCashIn': 'Cash In',
  'data.colCashOut': 'Cash Out',
  'data.addPeriod': '+ Add period',
  'data.ownDataToggle': 'Eigene Daten',
  'data.removeOverride': 'Override entfernen',
  'data.removeOverrideTitle': 'Override löschen und globale Daten verwenden',
  'data.usesOwn': 'Dieser Graf nutzt eigene Planungsdaten. Änderungen wirken nur hier.',
  'data.usesGlobal':
    'Aktuell werden die globalen Planungsdaten verwendet. Aktiviere den Override, um eigene Daten zu hinterlegen.',

  // Import help
  'help.title': 'Import-Format',
  'help.intro':
    'Planungsdaten können als CSV oder JSON importiert werden. Jede Zeile entspricht einer Periode mit den Feldern',
  'help.introSuffix': '(alle Beträge als Zahl ohne Währungssymbol).',
  'help.csvExample': 'CSV-Beispiel',
  'help.jsonExample': 'JSON-Beispiel',
  'help.tip':
    'Tipp: Lade dir einen bestehenden Graphen als CSV/JSON herunter (⬇-Icon auf jedem Chart), passe ihn im Editor an und importiere ihn wieder hoch.',

  // Chart detail page
  'detail.back': '← Zurück zur Übersicht',
  'detail.related': 'Weitere Grafen',
  'detail.breadcrumbHome': 'Dashboard',
  'detail.dragHint': 'ziehen zum Ändern',

  // Chart catalog titles + subtitles
  'chart.profitability.title': 'Profitability Forecast',
  'chart.profitability.subtitle': 'Umsatz, Kosten und Gewinn pro Periode',
  'chart.profitability.description':
    'Vergleicht Erlöse und Kosten Periode für Periode. Stacked- und Horizontal-Modus zeigen die Zusammensetzung der Kosten zum Erlös.',
  'chart.liquidity.title': 'Liquidity Forecast',
  'chart.liquidity.subtitle': 'Kassenstand & Netto-Cashflow',
  'chart.liquidity.description':
    'Projiziert den Kassenstand anhand von Cash-In/Out. Area-Modus macht die Entwicklung sofort sichtbar.',
  'chart.revenueMargin.title': 'Umsatz & Marge',
  'chart.revenueMargin.subtitle': 'Umsatz pro Periode mit Margen-Linie',
  'chart.revenueMargin.description':
    'Kombiniert absolute Umsätze mit relativer Marge auf zwei Y-Achsen. Ideal für Kennzahlen-Reviews.',
  'chart.cashFlow.title': 'Cash Flow',
  'chart.cashFlow.subtitle': 'Zu- und Abflüsse pro Periode',
  'chart.cashFlow.description':
    'Zeigt Cash-In vs. Cash-Out pro Periode — wahlweise gestapelt, nebeneinander oder als Area.',
  'chart.waterfall.title': 'Profit Waterfall',
  'chart.waterfall.subtitle': 'Periodische Beiträge zum Gesamtergebnis',
  'chart.waterfall.description':
    'Zeigt, wie sich jede Periode zum kumulierten Gewinn addiert. Positive Schritte grün, negative rot.',
  'chart.costStructure.title': 'Kostenverteilung',
  'chart.costStructure.subtitle': 'Anteil der Kosten pro Periode',
  'chart.costStructure.description':
    'Visualisiert die prozentuale Verteilung der Gesamtkosten auf die einzelnen Perioden.',

  // About section
  'about.title': 'LiquidHub — Professionelle Liquiditätsplanung & Cashflow-Forecasts',
  'about.lead':
    'LiquidHub ist ein webbasiertes Dashboard für Rentabilitäts- und Liquiditätsprognosen. Es richtet sich an Gründer:innen, Geschäftsführungen kleiner und mittelständischer Unternehmen, Unternehmensberater:innen und Controller:innen, die Finanzkennzahlen schnell visualisieren und Businesspläne auf eine solide Zahlenbasis stellen wollen.',
  'about.t1.title': 'Rentabilitätsprognose',
  'about.t1.body':
    'Erfassen Sie Umsatz, Kosten und Gewinn pro Periode und vergleichen Sie Szenarien direkt nebeneinander. Stacked-Bar-, Horizontal-Bar- und Kombi-Ansichten zeigen auf einen Blick, wie sich das Verhältnis von Erlösen zu Ausgaben entwickelt und wo die Margen-Hebel liegen.',
  'about.t2.title': 'Liquiditätsforecast',
  'about.t2.body':
    'Projektieren Sie den Kassenstand über Monate oder Quartale hinweg, inklusive Netto-Cashflow und Liquiditätstief. Das gestapelte Area-Diagramm macht Engpässe sofort sichtbar, bevor sie zu echten Finanzierungslücken werden.',
  'about.t3.title': 'Profit-Waterfall',
  'about.t3.body':
    'Visualisieren Sie Periode für Periode, welchen Beitrag jeder Monat zum kumulierten Gesamtergebnis leistet. Positive Entwicklung wird hervorgehoben, negative Beiträge bleiben deutlich erkennbar.',
  'about.t4.title': 'Kostenstruktur & KPIs',
  'about.t4.body':
    'Doughnut-, Pie- und Polar-Diagramme zeigen die prozentuale Kostenverteilung; die KPI-Leiste aggregiert Total-Umsatz, Total-Kosten, Marge, Ending Cash und Liquiditätstief in fünf Kennzahlen.',
  'about.t5.title': '13 Währungen, exportierbar',
  'about.t5.body':
    'Wechseln Sie live zwischen EUR, USD, GBP, CHF, JPY, CNY, SEK, NOK, DKK, PLN, CZK, CAD und AUD — alle Achsen, Tooltips und KPIs formatieren sich automatisch nach dem jeweiligen Locale. Jeder Chart ist als PNG (1x/2x/3x), CSV oder JSON exportierbar.',
  'about.t6.title': 'Individualisierung',
  'about.t6.body':
    'Acht professionelle Farbpaletten sowie freie Hex-Farben pro Serie, editierbare Titel, Legendenposition, Smoothing, Grid-Sichtbarkeit und 13 Chart-Typen. Jeder Graph kann zusätzlich mit eigenen Planungsdaten befüllt werden, unabhängig vom globalen Datensatz.',
  'about.usecasesTitle': 'Typische Einsatzszenarien',
  'about.uc1': 'Businessplan für Gründer:innen: Drei-Jahres-Finanzplan inklusive Rentabilitätsvorschau und Liquiditätsforecast — als PNG-Export direkt ins Pitch-Deck einfügen.',
  'about.uc2': 'Investoren-Pitch: Wasserfall-Chart und Margen-Combo zeigen Investoren auf einen Blick, wie sich das Geschäftsmodell finanziell entwickelt.',
  'about.uc3': 'Controlling & Monatsreport: Aktuelle IST-Werte importieren, Abweichungen vom Plan erkennen, individuelle Farbschemen passend zum Corporate Design.',
  'about.uc4': 'Beratungsmandate: Schneller Szenarien-Vergleich durch per-Chart-Overrides. Best-Case, Base-Case und Worst-Case parallel halten.',
  'about.uc5': 'Hochschul- und Weiterbildungskontexte: Praxisnahes Werkzeug zur Vermittlung der Unterschiede zwischen GuV, Cashflow-Rechnung und Liquiditätsplanung.',

  // FAQ
  'faq.title': 'Häufig gestellte Fragen',
  'faq.lead':
    'Die meistgestellten Fragen rund um Liquiditätsplanung, Cashflow-Forecasts und Businessplan-Finanzteile — kurz und praxisnah beantwortet.',
  'faq.q1': 'Was ist eine Liquiditätsplanung?',
  'faq.a1':
    'Eine Liquiditätsplanung ist eine systematische Vorausschau aller erwarteten Ein- und Auszahlungen eines Unternehmens über einen definierten Zeitraum. Sie zeigt, ob ein Unternehmen zu jedem Zeitpunkt zahlungsfähig bleibt, identifiziert Liquiditätslücken frühzeitig und ist Pflichtbestandteil jedes fundierten Businessplans.',
  'faq.q2': 'Wie erstelle ich eine Cashflow-Prognose für meinen Businessplan?',
  'faq.a2':
    'Eine Cashflow-Prognose entsteht in vier Schritten: 1) Startkapital festlegen, 2) erwartete Einzahlungen pro Periode schätzen (Umsatz, Eigenkapital, Darlehen), 3) Auszahlungen zuordnen (Personal, Material, Miete, Steuern), 4) den kumulierten Kassenstand Periode für Periode fortschreiben. LiquidHub automatisiert die Berechnung und visualisiert das Ergebnis als Linien-, Area- oder Wasserfall-Chart.',
  'faq.q3': 'Was ist der Unterschied zwischen Rentabilität und Liquidität?',
  'faq.a3':
    'Rentabilität misst den Gewinn im Verhältnis zum Umsatz oder eingesetzten Kapital — sie sagt, ob das Geschäftsmodell wirtschaftlich funktioniert. Liquidität hingegen misst die jederzeitige Zahlungsfähigkeit. Ein Unternehmen kann rentabel sein und trotzdem in eine Liquiditätskrise geraten, wenn Zahlungseingänge zeitlich verzögert sind.',
  'faq.q4': 'Welche Daten brauche ich für eine Liquiditätsplanung?',
  'faq.a4':
    'Für jede Planungsperiode (meist Monat oder Quartal) benötigen Sie: Label, erwarteter Umsatz, erwartete Kosten, tatsächliche Einzahlungen (Cash In) und Auszahlungen (Cash Out). LiquidHub importiert diese Daten wahlweise als CSV oder JSON und zeigt sofort die resultierenden Grafiken an.',
  'faq.q5': 'Ist LiquidHub kostenlos?',
  'faq.a5':
    'Ja. LiquidHub ist ein kostenfreies Tool der gemeinnützigen PEBS gUG. Es speichert keine Daten auf Servern, alle Eingaben verbleiben im Browser-Speicher (localStorage). Der Export der Grafiken als PNG, CSV oder JSON ist uneingeschränkt möglich.',
  'faq.q6': 'Kann ich LiquidHub statt Excel für den Finanzplan nutzen?',
  'faq.a6':
    'LiquidHub ist eine spezialisierte Alternative zu Excel-Vorlagen für Finanzpläne: statt statischer Tabellen erhalten Sie interaktive, live aktualisierte Visualisierungen mit 13 Chart-Typen, individuellen Farbschemen, Multi-Währungs-Unterstützung und Export-Funktionen. Für einfache Gründungs-Businesspläne, Investoren-Pitches und Controlling-Reviews ist das Tool eine vollwertige Alternative.',
  'faq.q7': 'Welche Chart-Typen unterstützt LiquidHub?',
  'faq.a7':
    'Balkendiagramm, gestapelte Balken, horizontale Balken, horizontale gestapelte Balken, Liniendiagramm, Flächendiagramm, Step-Linie, Kreisdiagramm, Donut, Polar-Area, Wasserfall und Combo-Charts mit zwei Y-Achsen. Jeder Chart-Typ lässt sich einzeln konfigurieren: Farbpalette, eigene Hex-Farben, Achsenbeschriftung, Legendenposition, Titel.',
  'faq.q8': 'Unterstützt LiquidHub mehrere Währungen?',
  'faq.a8':
    'Ja. Neben Euro werden US-Dollar, Britisches Pfund, Schweizer Franken, Japanischer Yen, Chinesischer Yuan, Schwedische, Norwegische und Dänische Krone, Polnischer Złoty, Tschechische Krone sowie Kanadischer und Australischer Dollar unterstützt. Ein Umschalter im Header wechselt alle Grafiken und KPIs live.',

  // Footer
  'footer.copyright': 'PEBS gUG — LiquidHub Financial Dashboard',
  'footer.impressum': 'Impressum',
  'footer.contact': 'Kontakt',

  // Impressum headings
  'imp.title': 'Impressum',
  'imp.subtitle': 'Angaben gemäß § 5 TMG und § 55 Abs. 2 RStV.',
};

const en: Dict = {
  // Header / nav
  'nav.dashboard': 'Dashboard',
  'nav.charts': 'Charts',
  'nav.chartsHead': 'All charts',
  'header.currencyTitle': 'Switch currency',
  'header.languageTitle': 'Switch language',
  'header.themeTitle': 'Toggle light / dark',

  // Dashboard hero
  'dashboard.title': 'Finance Dashboard',
  'dashboard.subtitle':
    'Build profitability and liquidity forecasts for your business plan. Open an individual chart to give it its own planning data, or customise colours and chart types. Every graphic can be exported as PNG, CSV, or JSON.',
  'dashboard.loadSample': 'Sample data',
  'dashboard.reset': 'Reset',
  'dashboard.slotLink': 'Details & planning →',
  'dashboard.badgeOverride': 'custom data',

  // KPI cards
  'kpi.totalRevenue': 'Total Revenue',
  'kpi.totalCosts': 'Total Costs',
  'kpi.profit': 'Profit',
  'kpi.endingCash': 'Ending Cash',
  'kpi.minCash': 'Liquidity Low',
  'kpi.periods': 'periods',
  'kpi.sumAll': 'Sum of all expenses',
  'kpi.margin': 'Margin',
  'kpi.vsStart': 'vs. start',
  'kpi.bottleneck': 'Bottleneck!',
  'kpi.healthy': 'healthy',

  // Global palette switcher
  'palette.label': 'Theme',
  'palette.resetOverrides': 'Reset overrides',

  // Chart actions
  'chart.settingsTitle': 'Customise',
  'chart.exportTitle': 'Download',
  'chart.settingsLabel': 'Chart settings',
  'chart.exportLabel': 'Export chart',

  // Settings popover
  'settings.title': 'Customise',
  'settings.palette': 'Colour palette',
  'settings.setGlobal': 'Set as global theme',
  'settings.customColors': 'Custom colours (hex)',
  'settings.removeAllCustom': 'Remove all custom colours',
  'settings.chartType': 'Chart type',
  'settings.appearance': 'Appearance',
  'settings.toggleLegend': 'Legend',
  'settings.toggleGrid': 'Grid',
  'settings.toggleYZero': 'Y at 0',
  'settings.legendPosition': 'Legend position',
  'settings.smoothing': 'Line smoothing',
  'settings.titleLabel': 'Title',
  'settings.titlePlaceholder': 'Use default title',
  'settings.subtitlePlaceholder': 'Subtitle',
  'settings.resetDefault': 'Reset to default',
  'settings.series': 'Series',
  'settings.reset': 'Reset',

  // Export menu
  'export.title': 'Export',
  'export.transparent': 'Transparent background',
  'export.png': 'PNG',
  'export.pngStandard': 'Standard resolution',
  'export.png2x': 'PNG @2x',
  'export.pngHires': 'High resolution',
  'export.png3x': 'PNG @3x',
  'export.pngPrint': 'Print quality',
  'export.clipboard': 'To clipboard',
  'export.clipboardSub': 'Copy as image',
  'export.csv': 'CSV',
  'export.csvSub': 'Raw tabular data',
  'export.json': 'JSON',
  'export.jsonSub': 'Structured data',

  // Data input
  'data.planning': 'Planning data',
  'data.hint': 'Label, revenue, costs, cash in/out per period',
  'data.loadSample': 'Load sample',
  'data.random': '🎲 Random data',
  'data.randomTitle': 'Realistic random numbers',
  'data.import': 'Import CSV / JSON',
  'data.startingCash': 'Starting cash',
  'data.colPeriod': 'Period',
  'data.colRevenue': 'Revenue',
  'data.colCosts': 'Costs',
  'data.colCashIn': 'Cash In',
  'data.colCashOut': 'Cash Out',
  'data.addPeriod': '+ Add period',
  'data.ownDataToggle': 'Own data',
  'data.removeOverride': 'Remove override',
  'data.removeOverrideTitle': 'Delete override and fall back to global data',
  'data.usesOwn': 'This chart uses its own planning data. Changes apply here only.',
  'data.usesGlobal':
    'Currently using the global planning data. Enable the override to maintain a dedicated dataset.',

  // Import help
  'help.title': 'Import format',
  'help.intro':
    'Planning data can be imported as CSV or JSON. Each row corresponds to one period with fields',
  'help.introSuffix': '(all amounts as plain numbers, without a currency symbol).',
  'help.csvExample': 'CSV example',
  'help.jsonExample': 'JSON example',
  'help.tip':
    'Tip: download an existing chart as CSV/JSON (⬇ icon on every chart), edit it in your editor, and import it back.',

  // Chart detail page
  'detail.back': '← Back to overview',
  'detail.related': 'Other charts',
  'detail.breadcrumbHome': 'Dashboard',
  'detail.dragHint': 'drag to edit',

  // Chart catalog titles + subtitles
  'chart.profitability.title': 'Profitability Forecast',
  'chart.profitability.subtitle': 'Revenue, costs, and profit per period',
  'chart.profitability.description':
    'Compares earnings and expenses period by period. Stacked and horizontal modes show how costs roll up to revenue.',
  'chart.liquidity.title': 'Liquidity Forecast',
  'chart.liquidity.subtitle': 'Cash position & net cashflow',
  'chart.liquidity.description':
    'Projects the cash balance from cash-in / cash-out figures. Area mode surfaces the trajectory at a glance.',
  'chart.revenueMargin.title': 'Revenue & Margin',
  'chart.revenueMargin.subtitle': 'Revenue per period with margin line',
  'chart.revenueMargin.description':
    'Combines absolute revenue with relative margin on two Y axes. Ideal for KPI reviews.',
  'chart.cashFlow.title': 'Cash Flow',
  'chart.cashFlow.subtitle': 'Inflows and outflows per period',
  'chart.cashFlow.description':
    'Shows cash-in vs. cash-out per period — stacked, side by side, or as an area.',
  'chart.waterfall.title': 'Profit Waterfall',
  'chart.waterfall.subtitle': 'Per-period contributions to the total',
  'chart.waterfall.description':
    'Shows how each period adds to cumulative profit. Positive steps in green, negative in red.',
  'chart.costStructure.title': 'Cost Structure',
  'chart.costStructure.subtitle': 'Share of costs per period',
  'chart.costStructure.description':
    'Visualises the percentage distribution of total costs across individual periods.',

  // About section
  'about.title': 'LiquidHub — Professional liquidity planning & cashflow forecasts',
  'about.lead':
    'LiquidHub is a web-based dashboard for profitability and liquidity forecasts. It is built for founders, managing directors of small and medium-sized businesses, consultants, and controllers who need to visualise financial KPIs quickly and anchor their business plans on solid numbers.',
  'about.t1.title': 'Profitability forecast',
  'about.t1.body':
    'Capture revenue, costs, and profit per period and compare scenarios side by side. Stacked-bar, horizontal-bar, and combo views show at a glance how the earnings-to-expenses ratio evolves and where the margin levers sit.',
  'about.t2.title': 'Liquidity forecast',
  'about.t2.body':
    'Project the cash balance across months or quarters, including net cashflow and liquidity lows. The stacked area diagram surfaces bottlenecks before they turn into real funding gaps.',
  'about.t3.title': 'Profit waterfall',
  'about.t3.body':
    'Visualise how each period contributes to the cumulative total. Positive progress is highlighted; negative contributions remain clearly visible.',
  'about.t4.title': 'Cost structure & KPIs',
  'about.t4.body':
    'Doughnut, pie, and polar charts show the percentage distribution of costs; the KPI strip aggregates total revenue, total costs, margin, ending cash, and liquidity low into five tiles.',
  'about.t5.title': '13 currencies, exportable',
  'about.t5.body':
    'Switch live between EUR, USD, GBP, CHF, JPY, CNY, SEK, NOK, DKK, PLN, CZK, CAD, and AUD — axes, tooltips, and KPIs all reformat to the selected locale. Every chart is exportable as PNG (1x/2x/3x), CSV, or JSON.',
  'about.t6.title': 'Deep customisation',
  'about.t6.body':
    'Eight professional palettes plus free hex colours per series, editable titles, legend position, smoothing, grid visibility, and 13 chart types. Each chart can additionally carry its own planning data, independent of the global dataset.',
  'about.usecasesTitle': 'Typical use cases',
  'about.uc1':
    'Business plan for founders: three-year financial plan including profitability and liquidity forecasts — export as PNG straight into the pitch deck.',
  'about.uc2':
    'Investor pitch: the waterfall chart and margin combo show investors at a glance how the business model evolves financially.',
  'about.uc3':
    'Controlling & monthly reporting: import actuals, spot plan deviations, and apply custom colour schemes matching the corporate design.',
  'about.uc4':
    'Consulting engagements: fast scenario comparisons via per-chart overrides. Keep best case, base case, and worst case in parallel.',
  'about.uc5':
    'Education & training: a hands-on tool to teach the differences between P&L, cashflow statement, and liquidity plan.',

  // FAQ
  'faq.title': 'Frequently asked questions',
  'faq.lead':
    'The most common questions around liquidity planning, cashflow forecasts, and business-plan finance — answered concisely and practically.',
  'faq.q1': 'What is liquidity planning?',
  'faq.a1':
    'Liquidity planning is a systematic forecast of all expected cash inflows and outflows of a business over a defined period. It shows whether the company stays solvent at every point in time, surfaces liquidity gaps early, and is a mandatory part of any sound business plan.',
  'faq.q2': 'How do I build a cashflow forecast for my business plan?',
  'faq.a2':
    'A cashflow forecast has four steps: 1) set the starting cash balance, 2) estimate cash inflows per period (revenue, equity, loans), 3) assign cash outflows (payroll, material, rent, taxes), 4) roll the cumulative cash position forward period by period. LiquidHub automates the arithmetic and visualises the result as line, area, or waterfall.',
  'faq.q3': 'What is the difference between profitability and liquidity?',
  'faq.a3':
    'Profitability measures profit relative to revenue or invested capital — it tells you whether the business model works economically. Liquidity measures the ability to pay at all times. A company can be profitable and still hit a liquidity crunch if cash inflows are delayed.',
  'faq.q4': 'What data do I need for liquidity planning?',
  'faq.a4':
    'For each planning period (typically a month or quarter) you need: label, expected revenue, expected costs, actual cash-in, and cash-out. LiquidHub imports these as CSV or JSON and instantly renders the resulting charts.',
  'faq.q5': 'Is LiquidHub free?',
  'faq.a5':
    'Yes. LiquidHub is a free tool from the non-profit PEBS gUG. No data is stored on servers — everything lives in browser localStorage. Exporting charts as PNG, CSV, or JSON is unrestricted.',
  'faq.q6': 'Can I use LiquidHub instead of Excel for my financial plan?',
  'faq.a6':
    'LiquidHub is a specialised alternative to Excel templates: instead of static tables you get interactive live visualisations with 13 chart types, custom colour schemes, multi-currency support, and export functions. For simple founder business plans, investor pitches, and controlling reviews, it is a complete replacement.',
  'faq.q7': 'Which chart types does LiquidHub support?',
  'faq.a7':
    'Bar, stacked bar, horizontal bar, horizontal stacked bar, line, area, step line, pie, doughnut, polar area, waterfall, and combo charts with two Y axes. Every chart type can be configured individually: palette, custom hex colours, axis labels, legend position, title.',
  'faq.q8': 'Does LiquidHub support multiple currencies?',
  'faq.a8':
    'Yes. On top of Euro, LiquidHub supports US Dollar, British Pound, Swiss Franc, Japanese Yen, Chinese Yuan, Swedish / Norwegian / Danish Krone, Polish Złoty, Czech Koruna, and Canadian / Australian Dollar. A header switch updates every chart and KPI live.',

  // Footer
  'footer.copyright': 'PEBS gUG — LiquidHub Financial Dashboard',
  'footer.impressum': 'Legal notice',
  'footer.contact': 'Contact',

  // Impressum
  'imp.title': 'Legal notice',
  'imp.subtitle': 'Information according to § 5 TMG and § 55 (2) RStV.',
};

const dicts: Record<Lang, Dict> = { de, en };

export function translate(lang: Lang, key: string): string {
  return dicts[lang][key] ?? de[key] ?? key;
}

export function useT(): (key: string) => string {
  const lang = useLanguage((s) => s.lang);
  return (key: string) => translate(lang, key);
}
