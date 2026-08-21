import { getLanguageAlternates, ROUTE_MAP, SUPPORTED_LOCALES } from './i18n.js';
import { EXTRA_PAGES, EXTRA_SHARED } from './localized-content-extra.js';

const shared = {
  en: {
    badge: 'Made in the Czech Republic · stainless steel misting',
    primaryCta: 'Request a project quote',
    secondaryCta: 'View projects',
    trust: ['Direct water-main operation', 'No high-pressure pump', 'Stainless steel construction', 'Project support from design to installation'],
  },
  de: {
    badge: 'Hergestellt in Tschechien · Edelstahl-Nebeltechnik',
    primaryCta: 'Projekt unverbindlich anfragen',
    secondaryCta: 'Referenzen ansehen',
    trust: ['Direkter Anschluss an die Wasserleitung', 'Keine Hochdruckpumpe', 'Edelstahlkonstruktion', 'Projektbegleitung von Planung bis Montage'],
  },
};

Object.assign(shared, EXTRA_SHARED);

const pages = {
  home: {
    en: {
      title: 'Outdoor misting systems for cities, architecture and gardens',
      description: 'Design-led stainless steel misting systems by HolmTec for public spaces, parks, schools, hospitality and residential projects. Low-pressure operation directly from the water main, without a high-pressure pump.',
      keywords: 'outdoor misting systems, urban cooling, public space misting, stainless steel misting, misting columns, misting arches, Czech manufacturer',
      eyebrow: 'Smart outdoor cooling',
      heading: 'Cooling that becomes part of the architecture.',
      lead: 'MLŽIDLA® by HolmTec develops stainless steel misting elements for cities, public spaces, hospitality and private gardens. We combine clean industrial design, realistic water consumption and project-ready engineering with operation directly from the standard water supply.',
      sections: [
        ['For public spaces', 'Urban squares, parks, promenades, schools and sports grounds need robust cooling that is intuitive to use and easy to maintain. Our systems are designed as permanent architectural elements rather than temporary technical equipment.'],
        ['Without a high-pressure pump', 'Selected MLŽIDLA® systems use the pressure of the standard water main. This simplifies installation, reduces electrical infrastructure and makes the whole cooling concept easier to specify for municipalities and architects.'],
        ['From standard products to custom shapes', 'Choose established products such as BENDY®, GATE or LINEA, or send us a photo, sketch or symbol. We can prepare a realistic visualization and a non-binding project quotation.'],
      ],
    },
    de: {
      title: 'Nebelanlagen für Städte, Architektur und Gärten',
      description: 'Designorientierte Edelstahl-Nebelanlagen von HolmTec für öffentliche Räume, Parks, Schulen, Gastronomie und private Gärten. Niederdruckbetrieb direkt am Wasserleitungsnetz ohne Hochdruckpumpe.',
      keywords: 'Nebelanlage Außenbereich, Stadtklima Kühlung, Nebeldusche Stadt, Edelstahl Nebelanlage, Sprühnebel Anlage, öffentliche Räume Kühlung',
      eyebrow: 'Intelligente Außenkühlung',
      heading: 'Kühlung als Teil der Architektur.',
      lead: 'MLŽIDLA® by HolmTec entwickelt Edelstahl-Nebelelemente für Städte, öffentliche Räume, Gastronomie und private Gärten. Wir verbinden klares Produktdesign, realistische Verbrauchswerte und projektgerechte Technik mit einem Betrieb direkt am normalen Wasserleitungsnetz.',
      sections: [
        ['Für öffentliche Räume', 'Plätze, Parks, Promenaden, Schulen und Sportanlagen brauchen robuste Kühlung, die einfach zu bedienen und zu warten ist. Unsere Systeme sind als dauerhafte architektonische Elemente konzipiert.'],
        ['Ohne Hochdruckpumpe', 'Ausgewählte MLŽIDLA® Systeme nutzen den vorhandenen Leitungsdruck. Dadurch werden Installation, Elektroinfrastruktur und Ausschreibung für Kommunen und Planer deutlich einfacher.'],
        ['Serienprodukt oder Sonderanfertigung', 'Wählen Sie bewährte Produkte wie BENDY®, GATE oder LINEA oder senden Sie uns Foto, Skizze oder Symbol. Wir erstellen eine realistische Visualisierung und ein unverbindliches Projektangebot.'],
      ],
    },
  },
  catalog: {
    en: {
      title: 'Stainless steel misting systems and outdoor cooling products',
      description: 'Explore MLŽIDLA® stainless steel misting columns, arches, sculptural elements and modular outdoor cooling systems for cities, parks, hospitality and gardens.',
      keywords: 'misting system catalogue, misting arches, misting columns, outdoor cooling products, stainless steel misting manufacturer',
      eyebrow: 'Product portfolio',
      heading: 'A misting system for every scale of project.',
      lead: 'Our portfolio ranges from single stainless steel misting elements to walk-through gates, alleys and custom cooling zones. Products are developed for long-term outdoor operation and can be adapted to the scale, circulation and visual language of the site.',
      sections: [['Urban collection', 'Durable products for high-traffic public space, playgrounds, schools and sports facilities.'], ['Garden collection', 'Minimal stainless steel forms for terraces, gardens and residential courtyards.'], ['Custom production', 'Bespoke geometries, city symbols and project-specific assemblies based on a sketch or architectural concept.']],
    },
    de: {
      title: 'Edelstahl-Nebelanlagen und Produkte zur Außenkühlung',
      description: 'Entdecken Sie MLŽIDLA® Nebelsäulen, Nebelbögen, skulpturale Elemente und modulare Kühlsysteme aus Edelstahl für Städte, Parks, Gastronomie und Gärten.',
      keywords: 'Nebelanlagen Katalog, Nebelbogen, Nebelsäule, Außenkühlung Edelstahl, Hersteller Nebelanlagen',
      eyebrow: 'Produktportfolio',
      heading: 'Die passende Nebelanlage für jede Projektgröße.',
      lead: 'Unser Portfolio reicht vom einzelnen Edelstahl-Nebelelement bis zu begehbaren Toren, Alleen und individuell geplanten Kühlzonen. Die Produkte sind für dauerhaften Außenbetrieb entwickelt und lassen sich an Maßstab, Wegeführung und Architektur anpassen.',
      sections: [['Stadt-Kollektion', 'Robuste Lösungen für stark frequentierte Plätze, Spielplätze, Schulen und Sportanlagen.'], ['Garten-Kollektion', 'Minimalistische Edelstahlformen für Terrassen, Gärten und Wohnanlagen.'], ['Sonderanfertigung', 'Individuelle Geometrien, Stadtsymbole und projektspezifische Kombinationen nach Skizze oder Architekturkonzept.']],
    },
  },
  city: {
    en: {
      title: 'Urban misting systems for squares, parks and public spaces',
      description: 'Permanent stainless steel urban misting systems for municipalities, public squares, parks, schools and sports grounds. Project support, visualization and custom manufacturing by HolmTec.',
      keywords: 'urban misting system, city cooling, public square cooling, park misting, municipal heat mitigation',
      eyebrow: 'Urban cooling',
      heading: 'Permanent misting for places where people stay, walk and meet.',
      lead: 'Urban cooling must work technically, visually and operationally. MLŽIDLA® products are designed for public-space loads, straightforward maintenance and integration into paving, planting, seating and pedestrian routes.',
      sections: [['Municipal projects', 'We support project teams with dimensions, water connection requirements, product selection and visualizations suitable for internal approval or procurement documentation.'], ['High-traffic environments', 'Stainless steel construction, simple geometry and serviceable components make the systems suitable for daily public use.'], ['Cooling without visual clutter', 'The misting element is treated as street furniture or a small architectural object, so cooling does not have to look like temporary event equipment.']],
    },
    de: {
      title: 'Städtische Nebelanlagen für Plätze, Parks und öffentliche Räume',
      description: 'Dauerhafte Edelstahl-Nebelanlagen für Kommunen, Plätze, Parks, Schulen und Sportanlagen. Projektunterstützung, Visualisierung und Sonderfertigung von HolmTec.',
      keywords: 'Nebelanlage Stadt, Kühlung öffentlicher Raum, Stadtplatz Kühlung, Park Nebelanlage, Hitzeschutz Kommune',
      eyebrow: 'Stadtklima',
      heading: 'Dauerhafte Kühlung für Orte, an denen Menschen bleiben und sich begegnen.',
      lead: 'Städtische Kühlung muss technisch, gestalterisch und im täglichen Betrieb funktionieren. MLŽIDLA® Produkte sind für hohe öffentliche Belastung, einfache Wartung und die Integration in Beläge, Grünflächen, Sitzbereiche und Wege entwickelt.',
      sections: [['Kommunale Projekte', 'Wir unterstützen Planungsteams mit Abmessungen, Anforderungen an den Wasseranschluss, Produktauswahl und Visualisierungen für interne Freigaben oder Ausschreibungen.'], ['Hohe Besucherfrequenz', 'Edelstahl, klare Geometrie und wartbare Komponenten eignen sich für den täglichen Einsatz im öffentlichen Raum.'], ['Kühlung ohne technische Unruhe', 'Das Nebelelement wird wie Stadtmobiliar oder ein kleines architektonisches Objekt behandelt und wirkt nicht wie temporäre Veranstaltungstechnik.']],
    },
  },
  garden: {
    en: {
      title: 'Garden misting systems for terraces and residential outdoor spaces',
      description: 'Minimal stainless steel garden misting systems for terraces, private gardens and residential courtyards. Elegant cooling without a high-pressure pump.',
      keywords: 'garden misting system, patio misting, terrace cooling, residential misting, stainless steel garden mist',
      eyebrow: 'Residential cooling',
      heading: 'Quiet, minimal cooling for terraces and gardens.',
      lead: 'Garden misting should feel like part of the landscape. Slim stainless steel forms create a fine cooling zone without dominating planting, furniture or architecture.',
      sections: [['Minimal footprint', 'Compact forms can be positioned along seating, paths or planting edges.'], ['Simple operation', 'Low-pressure concepts can be connected to a standard water supply and combined with smart timing or valve control.'], ['Designed for the site', 'We can visualize the product directly in your garden photo before the final configuration is selected.']],
    },
    de: {
      title: 'Garten-Nebelanlagen für Terrassen und private Außenbereiche',
      description: 'Minimalistische Edelstahl-Nebelanlagen für Terrassen, private Gärten und Wohnhöfe. Elegante Kühlung ohne Hochdruckpumpe.',
      keywords: 'Nebelanlage Garten, Terrassenkühlung, Sprühnebel Terrasse, Garten Kühlung Edelstahl',
      eyebrow: 'Private Außenbereiche',
      heading: 'Ruhige, minimalistische Kühlung für Terrasse und Garten.',
      lead: 'Eine Garten-Nebelanlage sollte wie ein Teil der Landschaft wirken. Schlanke Edelstahlformen schaffen eine feine Kühlzone, ohne Bepflanzung, Möbel oder Architektur zu dominieren.',
      sections: [['Kleine Grundfläche', 'Kompakte Elemente lassen sich entlang von Sitzbereichen, Wegen oder Pflanzflächen positionieren.'], ['Einfache Bedienung', 'Niederdruckkonzepte können an die normale Wasserleitung angeschlossen und mit Zeit- oder Ventilsteuerung kombiniert werden.'], ['Für den konkreten Ort geplant', 'Wir können das Produkt vor der Auswahl direkt in Ihr Gartenfoto visualisieren.']],
    },
  },
  custom: {
    en: {
      title: 'Custom stainless steel misting sculptures and bespoke cooling',
      description: 'Custom misting shapes, city symbols and architectural cooling elements manufactured in stainless steel by HolmTec. From sketch and visualization to production.',
      keywords: 'custom misting sculpture, bespoke misting system, architectural misting, custom stainless steel water feature',
      eyebrow: 'Bespoke manufacturing',
      heading: 'Turn a symbol, sketch or idea into a real misting element.',
      lead: 'Custom MLŽIDLA® projects start with the place and the simplest manufacturable geometry. We translate logos, symbols and architectural ideas into stainless steel tube forms with realistic bend radii, nozzle positions and anchoring.',
      sections: [['From sketch to geometry', 'Send a drawing, city symbol, photo or simple idea. We reduce it to a clean, buildable tube geometry.'], ['Visualization before production', 'A realistic placement study helps verify scale, position and visual impact before pricing or manufacturing.'], ['Engineering review', 'Final geometry, profile diameter, anchoring, nozzle layout and water connection are checked before production.']],
    },
    de: {
      title: 'Individuelle Nebelskulpturen und Sonderanfertigungen aus Edelstahl',
      description: 'Individuelle Nebelformen, Stadtsymbole und architektonische Kühlelemente aus Edelstahl von HolmTec. Von Skizze und Visualisierung bis zur Fertigung.',
      keywords: 'Nebelskulptur Sonderanfertigung, individuelle Nebelanlage, architektonische Nebelanlage, Edelstahl Wasserelement Sonderbau',
      eyebrow: 'Sonderanfertigung',
      heading: 'Aus Symbol, Skizze oder Idee wird ein reales Nebelelement.',
      lead: 'Individuelle MLŽIDLA® Projekte beginnen mit dem Ort und der einfachsten realisierbaren Geometrie. Logos, Symbole und Architekturideen werden in Edelstahlrohrformen mit realistischen Biegeradien, Düsenpositionen und Verankerungen übersetzt.',
      sections: [['Von der Skizze zur Geometrie', 'Senden Sie Zeichnung, Stadtsymbol, Foto oder eine einfache Idee. Wir reduzieren sie auf eine klare und produzierbare Rohrgeometrie.'], ['Visualisierung vor der Fertigung', 'Eine realistische Einfügung hilft, Maßstab, Position und Wirkung vor Angebot und Produktion zu prüfen.'], ['Technische Prüfung', 'Geometrie, Rohrdurchmesser, Verankerung, Düsenanordnung und Wasseranschluss werden vor der Fertigung geprüft.']],
    },
  },
  technology: {
    en: { title: 'How low-pressure outdoor misting works', description: 'Learn how MLŽIDLA® outdoor misting cools public and private spaces using fine water droplets and standard water-main pressure, without a high-pressure pump.', keywords: 'how misting works, evaporative cooling outdoor, low pressure misting, water main misting', eyebrow: 'Technology', heading: 'Fine mist. Simple infrastructure.', lead: 'Cooling is created when fine water droplets evaporate into warm air and absorb heat. The effectiveness depends on temperature, humidity, airflow, nozzle geometry and placement.', sections: [['Water-main pressure', 'Selected products are designed to work without a separate high-pressure pump, simplifying infrastructure and service.'], ['Nozzle placement', 'Mist quality depends on nozzle type, pressure and spacing. We design the layout for the actual product and use case.'], ['Smart control', 'Timing, weather logic and valves can reduce unnecessary water use and keep operation predictable.']] },
    de: { title: 'So funktionieren Niederdruck-Nebelanlagen', description: 'Erfahren Sie, wie MLŽIDLA® Außenkühlung mit feinen Wassertröpfchen und normalem Leitungsdruck ohne Hochdruckpumpe funktioniert.', keywords: 'Nebelanlage Funktionsweise, Verdunstungskühlung Außenbereich, Niederdruck Nebelanlage', eyebrow: 'Technologie', heading: 'Feiner Nebel. Einfache Infrastruktur.', lead: 'Kühlung entsteht, wenn feine Wassertröpfchen in warmer Luft verdunsten und Wärme aufnehmen. Die Wirkung hängt von Temperatur, Luftfeuchtigkeit, Luftbewegung, Düsen und Positionierung ab.', sections: [['Leitungsdruck', 'Ausgewählte Produkte arbeiten ohne separate Hochdruckpumpe und vereinfachen damit Infrastruktur und Service.'], ['Düsenposition', 'Die Nebelqualität hängt von Düse, Druck und Abstand ab. Wir planen die Anordnung für das konkrete Produkt und den Einsatz.'], ['Intelligente Steuerung', 'Zeitsteuerung, Wetterlogik und Ventile reduzieren unnötigen Wasserverbrauch und machen den Betrieb planbar.']] },
  },
  smart: {
    en: { title: 'Smart control for outdoor misting systems', description: 'Smart valve, timing and sensor control for MLŽIDLA® outdoor misting systems. Automate operating times and reduce unnecessary water consumption.', keywords: 'smart misting control, misting valve wifi, outdoor misting automation', eyebrow: 'Smart control', heading: 'Run misting only when it makes sense.', lead: 'Smart control combines a water valve with schedules, remote operation and optional environmental logic. The goal is not complexity, but predictable operation and lower unnecessary consumption.', sections: [['Remote control', 'Operate or schedule the system without opening technical cabinets.'], ['Operational logic', 'Define active hours and conditions appropriate to the site and season.'], ['Project integration', 'Smart control can be included in the project specification together with the misting hardware.']] },
    de: { title: 'Smart-Steuerung für Außen-Nebelanlagen', description: 'Intelligente Ventil-, Zeit- und Sensorsteuerung für MLŽIDLA® Nebelanlagen. Betriebszeiten automatisieren und unnötigen Wasserverbrauch reduzieren.', keywords: 'Nebelanlage Smart Steuerung, WLAN Ventil Nebelanlage, automatische Nebelanlage', eyebrow: 'Smart-Steuerung', heading: 'Nebel nur dann, wenn er sinnvoll ist.', lead: 'Die Smart-Steuerung verbindet Wasserarmatur, Zeitpläne, Fernbedienung und optionale Umgebungslogik. Ziel ist nicht mehr Komplexität, sondern ein planbarer Betrieb mit weniger unnötigem Verbrauch.', sections: [['Fernsteuerung', 'System starten oder planen, ohne technische Schränke öffnen zu müssen.'], ['Betriebslogik', 'Aktive Zeiten und Bedingungen passend zu Ort und Saison definieren.'], ['Projektintegration', 'Die Steuerung kann gemeinsam mit der Nebeltechnik in die Projektspezifikation aufgenommen werden.']] },
  },
  references: {
    en: { title: 'Misting system projects and references', description: 'Selected MLŽIDLA® and HolmTec misting projects for public spaces, schools, parks, visitor attractions and private gardens in the Czech Republic.', keywords: 'misting system projects, urban cooling references, public space misting projects', eyebrow: 'Projects', heading: 'Real installations in real public and private spaces.', lead: 'References show the actual scale, materials and operating context better than a catalogue render. Our projects include public visitor environments, municipal spaces, schools and residential gardens.', sections: [['Public-space experience', 'Installations are designed around visitor flow, maintenance and integration with existing surfaces.'], ['Project-specific details', 'Each reference reflects the site, product configuration and required anchoring.'], ['Use our references as a starting point', 'Send us a similar location and we can recommend the closest product family or a custom configuration.']] },
    de: { title: 'Referenzen für Nebelanlagen und Stadtklima-Projekte', description: 'Ausgewählte MLŽIDLA® und HolmTec Projekte für öffentliche Räume, Schulen, Parks, Besucheranlagen und private Gärten in Tschechien.', keywords: 'Nebelanlage Referenzen, Stadtklima Projekte, Kühlung öffentlicher Raum Referenz', eyebrow: 'Referenzen', heading: 'Reale Anlagen in realen öffentlichen und privaten Räumen.', lead: 'Referenzen zeigen Maßstab, Material und Betriebssituation besser als reine Katalogrenderings. Unsere Projekte umfassen Besucherareale, kommunale Flächen, Schulen und private Gärten.', sections: [['Erfahrung im öffentlichen Raum', 'Anlagen werden mit Blick auf Besucherfluss, Wartung und vorhandene Oberflächen geplant.'], ['Projektspezifische Details', 'Jede Referenz berücksichtigt Standort, Produktkonfiguration und Verankerung.'], ['Referenz als Ausgangspunkt', 'Senden Sie uns einen ähnlichen Ort; wir empfehlen die passende Produktfamilie oder eine individuelle Konfiguration.']] },
  },
  contact: {
    en: { title: 'Contact HolmTec for outdoor misting projects', description: 'Contact HolmTec / MLŽIDLA® in Trutnov, Czech Republic for outdoor misting systems, project consultation, visualization, manufacturing and installation.', keywords: 'misting system manufacturer contact, HolmTec contact, Czech misting manufacturer', eyebrow: 'Contact', heading: 'Tell us where you need cooling.', lead: 'Send us the location, approximate dimensions and intended use. A photo or simple plan is enough for the first conversation.', sections: [['Project consultation', 'We help select the product family and identify the information needed for a quotation.'], ['Visualization', 'For suitable projects we can place the product into a site photo to verify scale and location.'], ['From Czech production to installation', 'HolmTec coordinates manufacturing, project details and installation support.']] },
    de: { title: 'HolmTec Kontakt für Nebelanlagen und Außenkühlung', description: 'Kontaktieren Sie HolmTec / MLŽIDLA® in Trutnov, Tschechien für Nebelanlagen, Projektberatung, Visualisierung, Fertigung und Montage.', keywords: 'Nebelanlage Hersteller Kontakt, HolmTec Kontakt, Nebelanlage Tschechien', eyebrow: 'Kontakt', heading: 'Beschreiben Sie uns den Ort, den Sie kühlen möchten.', lead: 'Senden Sie Standort, ungefähre Abmessungen und Nutzung. Für das erste Gespräch reichen ein Foto oder ein einfacher Plan.', sections: [['Projektberatung', 'Wir helfen bei Produktauswahl und den notwendigen Angaben für ein Angebot.'], ['Visualisierung', 'Bei geeigneten Projekten platzieren wir das Produkt in einem Foto, um Maßstab und Position zu prüfen.'], ['Von der Fertigung bis zur Montage', 'HolmTec koordiniert Produktion, technische Details und Montageunterstützung.']] },
  },
  inquiry: {
    en: { title: 'Request a non-binding quote for a misting system', description: 'Request a non-binding quotation for MLŽIDLA® outdoor misting. Send a photo, sketch or project description and receive a project-specific recommendation.', keywords: 'misting system quote, outdoor misting price, urban cooling quotation', eyebrow: 'Non-binding quotation', heading: 'Send the place. We will propose the next step.', lead: 'A useful quotation starts with the actual space. Send a photo, plan, dimensions or just a concise description of the project and the expected use.', sections: [['What to send', 'Location, approximate dimensions, type of users and whether the installation is permanent or seasonal.'], ['What we prepare', 'Recommended product or custom direction, technical questions and a price framework based on the supplied information.'], ['No commitment', 'The first enquiry and visualization workflow is designed to help define the project before a purchasing decision.']] },
    de: { title: 'Unverbindliches Angebot für eine Nebelanlage anfragen', description: 'Fordern Sie ein unverbindliches Angebot für MLŽIDLA® Außenkühlung an. Foto, Skizze oder Projektbeschreibung senden und projektspezifische Empfehlung erhalten.', keywords: 'Nebelanlage Angebot, Nebelanlage Preis, Stadtklima Angebot', eyebrow: 'Unverbindliche Anfrage', heading: 'Senden Sie den Ort. Wir schlagen den nächsten Schritt vor.', lead: 'Ein sinnvolles Angebot beginnt mit dem realen Ort. Senden Sie Foto, Plan, Abmessungen oder eine kurze Projektbeschreibung mit der geplanten Nutzung.', sections: [['Was wir benötigen', 'Standort, ungefähre Abmessungen, Nutzergruppe und ob die Installation dauerhaft oder saisonal sein soll.'], ['Was Sie erhalten', 'Produktempfehlung oder Sonderlösung, technische Rückfragen und einen Preisrahmen auf Basis Ihrer Angaben.'], ['Unverbindlich', 'Die erste Anfrage und Visualisierung dienen dazu, das Projekt vor einer Kaufentscheidung zu definieren.']] },
  },
  about: {
    en: { title: 'HolmTec — Czech manufacturer of stainless steel misting systems', description: 'HolmTec develops and manufactures MLŽIDLA® stainless steel misting products in the Czech Republic for public-space, architectural and residential projects.', keywords: 'HolmTec Czech manufacturer, stainless steel misting manufacturer, MLZIDLA', eyebrow: 'About HolmTec', heading: 'Engineering, stainless steel and outdoor cooling.', lead: 'HolmTec combines metalworking experience with product development for outdoor cooling. MLŽIDLA® is our dedicated product platform for stainless steel misting systems and project-specific installations.', sections: [['Czech manufacturing', 'Products and custom components are developed with direct manufacturing feedback.'], ['Project thinking', 'We treat geometry, anchoring, servicing and water connection as one system.'], ['Long-term development', 'Standard products and custom projects continuously feed improvements back into the portfolio.']] },
    de: { title: 'HolmTec — tschechischer Hersteller von Edelstahl-Nebelanlagen', description: 'HolmTec entwickelt und fertigt MLŽIDLA® Edelstahl-Nebelprodukte in Tschechien für öffentliche, architektonische und private Projekte.', keywords: 'HolmTec Hersteller Tschechien, Edelstahl Nebelanlage Hersteller, MLZIDLA', eyebrow: 'Über HolmTec', heading: 'Maschinenbau, Edelstahl und Außenkühlung.', lead: 'HolmTec verbindet Erfahrung in der Metallverarbeitung mit Produktentwicklung für Außenkühlung. MLŽIDLA® ist unsere Produktplattform für Edelstahl-Nebeltechnik und projektspezifische Installationen.', sections: [['Fertigung in Tschechien', 'Produkte und Sonderkomponenten werden mit direktem Feedback aus der Fertigung entwickelt.'], ['Projektorientierung', 'Geometrie, Verankerung, Service und Wasseranschluss werden als Gesamtsystem betrachtet.'], ['Kontinuierliche Entwicklung', 'Serienprodukte und Sonderprojekte fließen laufend in die Weiterentwicklung des Portfolios ein.']] },
  },
  faq: {
    en: { title: 'Outdoor misting FAQ — installation, water and maintenance', description: 'Frequently asked questions about MLŽIDLA® outdoor misting systems: water connection, pressure, installation, maintenance, winter preparation and smart control.', keywords: 'misting system FAQ, misting maintenance, outdoor misting installation', eyebrow: 'FAQ', heading: 'Technical questions before the project starts.', lead: 'The best misting configuration depends on the site, water supply and use. These are the topics we most often clarify before design and pricing.', sections: [['Water and pressure', 'We verify available pressure, connection point and expected operating regime before final configuration.'], ['Anchoring and installation', 'Permanent and removable solutions require different ground preparation and anchoring details.'], ['Maintenance and winter', 'Outdoor systems should be inspected, cleaned and prepared for freezing conditions according to the installed configuration.']] },
    de: { title: 'FAQ zu Außen-Nebelanlagen — Montage, Wasser und Wartung', description: 'Häufige Fragen zu MLŽIDLA® Nebelanlagen: Wasseranschluss, Druck, Montage, Wartung, Wintervorbereitung und Smart-Steuerung.', keywords: 'Nebelanlage FAQ, Wartung Nebelanlage, Montage Nebelanlage', eyebrow: 'FAQ', heading: 'Technische Fragen vor Projektstart.', lead: 'Die passende Konfiguration hängt von Standort, Wasserversorgung und Nutzung ab. Diese Punkte klären wir am häufigsten vor Planung und Angebot.', sections: [['Wasser und Druck', 'Vor der finalen Konfiguration prüfen wir verfügbaren Druck, Anschlusspunkt und geplante Betriebsweise.'], ['Verankerung und Montage', 'Dauerhafte und mobile Lösungen benötigen unterschiedliche Untergrund- und Verankerungsdetails.'], ['Wartung und Winter', 'Außenanlagen sollten entsprechend der installierten Konfiguration kontrolliert, gereinigt und frostsicher vorbereitet werden.']] },
  },
};

Object.entries(EXTRA_PAGES).forEach(([routeKey, localizedPages]) => {
  pages[routeKey] = { ...(pages[routeKey] || {}), ...localizedPages };
});

export function getLocalizedPage(routeKey, locale) {
  const page = pages[routeKey]?.[locale] || pages.home[locale];
  const common = shared[locale];
  return {
    ...page,
    ...common,
    routeKey,
    canonicalPath: ROUTE_MAP[routeKey]?.[locale] || ROUTE_MAP.home[locale],
    locale,
    alternates: getLanguageAlternates(routeKey),
  };
}

export const LOCALIZED_SEO_PAGES = Object.keys(pages).flatMap((routeKey) => SUPPORTED_LOCALES.filter((locale) => locale !== 'cs').map((locale) => {
  const page = getLocalizedPage(routeKey, locale);
  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    canonicalPath: page.canonicalPath,
    locale,
    alternates: page.alternates,
  };
}));
