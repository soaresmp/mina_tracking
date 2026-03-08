import React, { useState } from 'react';

type SourceCategory = 'all' | 'production' | 'regulatory' | 'geospatial' | 'market' | 'security';

interface DataSource {
  id: string;
  name: string;
  category: SourceCategory;
  provider: string;
  providerType: 'government' | 'international' | 'ngo' | 'commercial' | 'academic' | 'satellite';
  description: string;
  url: string;
  dataTypes: string[];
  coverage: string;
  updateFrequency: string;
  format: string;
  license: string;
  usedIn: string[];
  lastAccessed: string;
  reliability: 'high' | 'medium' | 'low';
  notes?: string;
}

const sources: DataSource[] = [
  // REGULATORY / GOVERNMENT
  {
    id: 'SRC-001',
    name: 'MIREME — Mining License Registry',
    category: 'regulatory',
    provider: 'Ministry of Mineral Resources and Energy (MIREME)',
    providerType: 'government',
    description: 'Official register of all mining concessions, licenses, exploration permits and operator details issued under the Mozambique Mining Law (Lei n.º 20/2014). Source of truth for all licensing data in this platform.',
    url: 'https://www.mireme.gov.mz',
    dataTypes: ['License numbers', 'License expiry dates', 'Concession areas (ha)', 'Operator names', 'Province/district locations', 'License type (large/small/ASM)'],
    coverage: 'National — all 10 provinces',
    updateFrequency: 'Real-time (administrative updates)',
    format: 'Government database (API integration planned)',
    license: 'Public record — Mozambique Mining Law',
    usedIn: ['Licensing Registry', 'Mining Map', 'Compliance Module'],
    lastAccessed: '2025-03-01',
    reliability: 'high'
  },
  {
    id: 'SRC-002',
    name: 'INAMI — National Mining Institute Data',
    category: 'regulatory',
    provider: 'Instituto Nacional de Minas (INAMI)',
    providerType: 'government',
    description: 'Technical and operational data from Mozambique\'s national mining regulator. Includes inspection records, geological assessments, artisanal mining zone designations and miner association registrations. Note: this platform tracks 10 of the ~95 designated ASM zones; nationally INAMI estimates 150+ gold-specific cooperative/association registrations across all provinces, with 53 holding active status at time of last report.',
    url: 'https://www.inami.gov.mz',
    dataTypes: ['Inspection dates', 'ASM zone designations (~95 nationally)', 'Cooperative/association registrations (53 active gold-sector)', 'Total gold-sector license holders (~1,858 new licenses issued H1 2025, all minerals)', 'Geological assessments', 'Worker registration data'],
    coverage: 'National',
    updateFrequency: 'Quarterly (inspection reports)',
    format: 'PDF reports, government database',
    license: 'Public record',
    usedIn: ['Licensing Registry', 'Statistics — Provinces', 'Compliance Module'],
    lastAccessed: '2025-02-28',
    reliability: 'high'
  },
  {
    id: 'SRC-003',
    name: 'DNGRM — Geological Survey of Mozambique',
    category: 'geospatial',
    provider: 'Direcção Nacional de Geologia e Recursos Minerais (DNGRM)',
    providerType: 'government',
    description: 'National geological survey data including mineral deposit locations, geological maps, gold grade assessments and geochemical survey results across all Mozambican provinces.',
    url: 'https://www.dngrm.gov.mz',
    dataTypes: ['Gold deposit coordinates', 'Geological unit classifications', 'Gold grade data (g/t)', 'Geochemical survey results', 'Deposit type classification'],
    coverage: 'National — geological maps 1:250,000',
    updateFrequency: 'Annual (survey updates)',
    format: 'GIS shapefiles, PDF geological reports',
    license: 'Government of Mozambique',
    usedIn: ['Mining Map', 'Mining Sites Registry — Geology field', 'Statistics'],
    lastAccessed: '2025-01-15',
    reliability: 'high',
    notes: 'Geology descriptions per site derived from DNGRM 2019–2023 survey reports'
  },
  {
    id: 'SRC-004',
    name: 'EITI Mozambique — Extractive Industries Transparency Initiative',
    category: 'regulatory',
    provider: 'EITI Mozambique / ITIE Moçambique',
    providerType: 'international',
    description: 'Annual EITI reconciliation reports disclosing payments by extractive companies to the government. Covers royalties, taxes, bonuses and license fees. Current EITI Board score: 82.5/100 (Moderate — Decision 2023-29).',
    url: 'https://eiti.org/countries/mozambique',
    dataTypes: ['Royalty payments by company', 'Tax revenues (corporate income tax, VAT)', 'License fees', 'Production volumes', 'Export values', 'State equity (EMEM participation)', 'EITI compliance corrective actions'],
    coverage: 'All large-scale and major small-scale operations',
    updateFrequency: 'Annual (EITI reconciliation report)',
    format: 'PDF reports, EITI Summary Data (open CSV)',
    license: 'Open Data — EITI',
    usedIn: ['Dashboard — Royalties & Revenue', 'Statistics — Audit Trail', 'Compliance — EITI Module'],
    lastAccessed: '2025-02-20',
    reliability: 'high',
    notes: 'EITI 2021 Report (most recent); 2022 report in preparation. Corrective actions due July 2025.'
  },
  {
    id: 'SRC-005',
    name: 'Banco de Moçambique — Export Transaction Records',
    category: 'regulatory',
    provider: 'Banco de Moçambique (Central Bank)',
    providerType: 'government',
    description: 'Central Bank foreign exchange and export transaction data. Used to verify gold export values, reconcile payment flows and identify discrepancies between declared and actual export volumes.',
    url: 'https://www.bancomoc.mz',
    dataTypes: ['Export transaction values (USD)', 'Destination country records', 'Export certificate references', 'Royalty payment verification', 'Foreign exchange receipts'],
    coverage: 'All formal gold export transactions via licensed exporters',
    updateFrequency: 'Monthly',
    format: 'Restricted — inter-agency data sharing protocol',
    license: 'Government inter-agency restricted',
    usedIn: ['Statistics — Audit Trail', 'Statistics — Export Destinations', 'Dashboard — Export Revenue'],
    lastAccessed: '2025-02-28',
    reliability: 'high'
  },

  // PRODUCTION DATA
  {
    id: 'SRC-006',
    name: 'USGS Mineral Industry Surveys — Mozambique',
    category: 'production',
    provider: 'United States Geological Survey (USGS)',
    providerType: 'international',
    description: 'Annual mineral industry reports for Mozambique compiled by the USGS National Minerals Information Center. Provides independently verified production estimates, export statistics and sector overview.',
    url: 'https://pubs.usgs.gov/myb/vol3/2019/myb3-2019-mozambique.pdf',
    dataTypes: ['Annual gold production estimates', 'Export value data', 'Company-level production data', 'ASM sector estimates', 'Investment data'],
    coverage: 'National — 2000 to 2022 (most recent available)',
    updateFrequency: 'Annual',
    format: 'PDF (Minerals Yearbook)',
    license: 'Public domain (US Government)',
    usedIn: ['Statistics — Production charts', 'Dashboard KPIs', 'Statistics — Province data'],
    lastAccessed: '2025-01-10',
    reliability: 'high'
  },
  {
    id: 'SRC-007',
    name: 'Metals of Africa Ltd — Fair Bride Gold Project (ASX Disclosures)',
    category: 'production',
    provider: 'Metals of Africa Ltd (ASX: MTA)',
    providerType: 'commercial',
    description: 'ASX-listed company disclosures for the Fair Bride Gold Project in Manica Province. Includes JORC-compliant resource estimates, production guidance, ore grade, processing capacity and operational updates.',
    url: 'https://www.metalsofafrica.com.au',
    dataTypes: ['JORC resource estimate (1.2M oz @ 2.3 g/t)', 'Annual production guidance (50,000 oz/yr)', 'Ore processing capacity', 'Capital expenditure', 'Operating cost data'],
    coverage: 'Fair Bride, Manica Province',
    updateFrequency: 'Quarterly (ASX quarterly activities reports)',
    format: 'ASX announcements, annual reports',
    license: 'Public (ASX listed)',
    usedIn: ['Mining Sites Registry — MZ-GOLD-001', 'Statistics — Site production data'],
    lastAccessed: '2025-02-15',
    reliability: 'high',
    notes: 'Fair Bride is the only large-scale gold mine currently operating in Mozambique'
  },
  {
    id: 'SRC-008',
    name: 'IUCN — Artisanal Gold Mining in Manica Province',
    category: 'production',
    provider: 'International Union for Conservation of Nature (IUCN)',
    providerType: 'ngo',
    description: 'Field research report on artisanal and small-scale gold mining (ASGM) in Manica Province, covering miner demographics, production methods, mercury use, and environmental impacts along the Revue River basin.',
    url: 'https://iucn.org/sites/default/files/import/downloads/gold_mining_in_mozambique.pdf',
    dataTypes: ['ASM miner population estimates', 'Production methods (alluvial vs hard rock)', 'Mercury use data', 'Environmental impact assessments', 'Cooperative structure data', 'Revue River contamination'],
    coverage: 'Manica Province — Sussundenga, Barue, Manica districts',
    updateFrequency: 'One-time (2012 study, supplemented by 2024 field data)',
    format: 'PDF Research Report',
    license: 'IUCN Open Access',
    usedIn: ['Illicit Hotspots — HOT-004 (Sussundenga)', 'Mining Sites Registry — ASM entries'],
    lastAccessed: '2025-01-20',
    reliability: 'medium',
    notes: 'Base study from 2012; mercury contamination finding corroborated by 2024 DNGRM environmental survey'
  },
  {
    id: 'SRC-009',
    name: 'KPMG — Mozambique Mining Country Guide',
    category: 'regulatory',
    provider: 'KPMG International',
    providerType: 'commercial',
    description: 'Comprehensive guide to mining regulation, taxation, fiscal regime and investment framework in Mozambique. Used for royalty rate verification, tax regime parameters and investment data.',
    url: 'https://assets.kpmg.com/content/dam/kpmg/pdf/2013/10/Mozambique-mining-country-guide.pdf',
    dataTypes: ['Royalty rates (gold: 5% of export value)', 'Corporate income tax rates', 'Import/export duty regimes', 'Mining law summary', 'Fiscal stability provisions', 'Investment data ($100M FDI estimate)'],
    coverage: 'National regulatory framework',
    updateFrequency: 'Periodic (last updated 2023)',
    format: 'PDF',
    license: 'Commercial (KPMG)',
    usedIn: ['Statistics — Royalties/Taxes calculation', 'Compliance Module — EITI corrective actions'],
    lastAccessed: '2025-01-25',
    reliability: 'high'
  },

  // GEOSPATIAL / MAPPING
  {
    id: 'SRC-010',
    name: 'OpenStreetMap / CARTO Dark Matter',
    category: 'geospatial',
    provider: 'OpenStreetMap Contributors / CARTO',
    providerType: 'commercial',
    description: 'Base map tiles used for the dark-mode map view. OpenStreetMap community-maintained geographic data provides administrative boundaries, roads, settlements and infrastructure.',
    url: 'https://www.openstreetmap.org',
    dataTypes: ['Administrative boundaries', 'Road networks', 'Settlement locations', 'River/water bodies', 'Infrastructure'],
    coverage: 'Global (Mozambique — full coverage)',
    updateFrequency: 'Continuous (community edits)',
    format: 'Tile server (PNG/WebP)',
    license: 'ODbL — Open Database Licence',
    usedIn: ['Mining Map — Dark base layer'],
    lastAccessed: '2025-03-05',
    reliability: 'high'
  },
  {
    id: 'SRC-011',
    name: 'Esri World Imagery (ArcGIS)',
    category: 'geospatial',
    provider: 'Esri / Various satellite providers',
    providerType: 'commercial',
    description: 'High-resolution satellite imagery base layer for the map. Provides visual context for mining site identification, vegetation analysis and land-use verification around concession areas.',
    url: 'https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9',
    dataTypes: ['Multispectral satellite imagery', 'Sub-metre resolution (select areas)', 'Annual imagery updates'],
    coverage: 'Global',
    updateFrequency: 'Annual (major updates) / semi-annual (select areas)',
    format: 'Tile server',
    license: 'Esri Terms of Use',
    usedIn: ['Mining Map — Satellite base layer'],
    lastAccessed: '2025-03-05',
    reliability: 'high'
  },
  {
    id: 'SRC-012',
    name: 'Copernicus Sentinel-2 SAR Imagery (ESA)',
    category: 'geospatial',
    provider: 'European Space Agency (ESA) / EU Copernicus Programme',
    providerType: 'international',
    description: 'Synthetic Aperture Radar (SAR) and multispectral imagery from the ESA Sentinel-2 satellite constellation. Used to detect ground disturbance, excavation activity and vegetation clearing indicative of illegal mining operations.',
    url: 'https://sentinel.esa.int/web/sentinel/missions/sentinel-2',
    dataTypes: ['SAR ground deformation detection', 'Multispectral land cover change', 'Temporal change analysis (2022–2025)', 'Vegetation clearing detection', 'Water body turbidity (mercury indicator)'],
    coverage: 'Mozambique — 10-day repeat cycle, 10m resolution',
    updateFrequency: 'Every 5–10 days',
    format: 'GeoTIFF (processed via Copernicus Open Access Hub)',
    license: 'Copernicus Open Licence (free)',
    usedIn: ['Illicit Hotspots — satellite confirmation flags', 'HOT-001 (Zambezia)', 'HOT-002 (Moatize)', 'HOT-004 (Sussundenga)', 'HOT-006 (Niassa)', 'HOT-008 (Cabo Delgado)'],
    lastAccessed: '2025-02-28',
    reliability: 'high',
    notes: 'SAR analysis conducted by DNGRM in partnership with SERVIR-Eastern & Southern Africa'
  },

  // SECURITY / ILLICIT ACTIVITY
  {
    id: 'SRC-013',
    name: 'UNODC — Illicit Gold Trade in East/Southern Africa',
    category: 'security',
    provider: 'United Nations Office on Drugs and Crime (UNODC)',
    providerType: 'international',
    description: 'UNODC research on illicit gold trade flows in Eastern and Southern Africa, covering smuggling routes, destination markets, involvement of organised criminal groups and border control vulnerabilities.',
    url: 'https://www.unodc.org/documents/data-and-analysis/tocta/TOCTA_EA_Southern_Africa.pdf',
    dataTypes: ['Smuggling route mapping', 'Criminal group activity', 'Border crossing vulnerability assessments', 'Estimated illicit volumes', 'Destination market data (UAE, Tanzania, Zanzibar)'],
    coverage: 'East/Southern Africa region — Mozambique, Zimbabwe, Malawi, Tanzania corridors',
    updateFrequency: 'Biannual research publications',
    format: 'PDF research reports',
    license: 'UN Open Access',
    usedIn: ['Illicit Hotspots — HOT-001, HOT-003, HOT-005, HOT-007', 'Dashboard alerts'],
    lastAccessed: '2025-02-10',
    reliability: 'high'
  },
  {
    id: 'SRC-014',
    name: 'Global Initiative Against Transnational Organised Crime (GI-TOC)',
    category: 'security',
    provider: 'GI-TOC / Observatory of Illicit Economies',
    providerType: 'ngo',
    description: 'Research and intelligence on illicit mineral economies in Mozambique including conflict-linked mining in Cabo Delgado, artisanal sector exploitation by armed groups, and corruption in mineral licensing.',
    url: 'https://globalinitiative.net/analysis/illicit-gold-africa/',
    dataTypes: ['Armed group involvement mapping', 'Conflict-linked mining intelligence', 'Corruption risk indicators', 'Beneficial ownership red flags', 'Cabo Delgado security situation'],
    coverage: 'Mozambique — focus on Cabo Delgado, Manica, Tete',
    updateFrequency: 'Quarterly intelligence updates',
    format: 'Research reports, intelligence briefs',
    license: 'Open Access (GI-TOC)',
    usedIn: ['Illicit Hotspots — HOT-008 (Cabo Delgado)', 'Compliance — Risk Register', 'Actor risk scores'],
    lastAccessed: '2025-02-25',
    reliability: 'high',
    notes: 'Key source for conflict-area mining risk in Cabo Delgado province'
  },
  {
    id: 'SRC-015',
    name: 'Mozambique Anti-Corruption Commission (CPC) Public Disclosures',
    category: 'regulatory',
    provider: 'Conselho de Prevenção da Corrupção (CPC)',
    providerType: 'government',
    description: 'Public disclosures from Mozambique\'s anti-corruption authority covering open investigations, enforcement actions, and asset declarations related to the extractives sector.',
    url: 'https://www.cpc.org.mz',
    dataTypes: ['Open investigation disclosures', 'Enforcement actions in mining sector', 'Tax evasion findings', 'Shell company alerts', 'EITI audit findings (2020 embezzlement case)'],
    coverage: 'National',
    updateFrequency: 'As disclosed (public notices)',
    format: 'PDF public notices',
    license: 'Public record',
    usedIn: ['Actor profiles — Niassa Gold Corp risk flags', 'Compliance — Risk Register', 'Dashboard alerts'],
    lastAccessed: '2025-03-01',
    reliability: 'high'
  },

  // MARKET DATA
  {
    id: 'SRC-016',
    name: 'LBMA Gold Price (London Bullion Market Association)',
    category: 'market',
    provider: 'London Bullion Market Association (LBMA)',
    providerType: 'commercial',
    description: 'The internationally recognised benchmark gold price (XAU/USD) used for export valuation, royalty calculations and revenue projections. Published twice daily (AM/PM fix). ICE Benchmark Administration (IBA) administrator.',
    url: 'https://www.lbma.org.uk/prices-and-data/precious-metal-prices',
    dataTypes: ['XAU/USD spot price', 'AM/PM fix prices', 'Historical daily prices', 'Price in multiple currencies (USD, GBP, EUR)'],
    coverage: 'Global benchmark',
    updateFrequency: 'Twice daily (business days)',
    format: 'API / CSV download',
    license: 'Commercial (LBMA licensed)',
    usedIn: ['Dashboard — Gold spot price banner', 'Statistics — Revenue calculations', 'Audit Trail — Transaction valuations'],
    lastAccessed: '2025-03-05',
    reliability: 'high',
    notes: 'Platform displays reference rate of $2,329.50/oz as at March 2025'
  },
  {
    id: 'SRC-017',
    name: 'UN COMTRADE — Mozambique Gold Export Statistics',
    category: 'market',
    provider: 'United Nations Statistics Division (UNSD)',
    providerType: 'international',
    description: 'UN international trade statistics database. Used to verify and cross-reference gold export volumes and values by destination country. HS Code 7108 (gold, non-monetary).',
    url: 'https://comtradeplus.un.org/',
    dataTypes: ['Export value by destination (HS 7108)', 'Export volume (kg/oz)', 'Trade partner data (UAE, South Africa, China, Switzerland)', 'Annual and monthly trade flows'],
    coverage: 'Mozambique — annual data 2015–2023',
    updateFrequency: 'Annual (with 12-month lag)',
    format: 'CSV / JSON API',
    license: 'UN Open Data',
    usedIn: ['Statistics — Export Destinations', 'Dashboard — Export breakdown chart'],
    lastAccessed: '2025-01-30',
    reliability: 'high',
    notes: 'UAE receives ~57.5% of Mozambican gold exports by value — confirmed by 2022 COMTRADE data ($409M total exports)'
  },
  {
    id: 'SRC-018',
    name: 'Mozambique Expert / MozambiqueExpert.com',
    category: 'production',
    provider: 'MozambiqueExpert (independent research)',
    providerType: 'commercial',
    description: 'Specialist Mozambique investment and resource research portal covering gold deposit inventory, project profiles, regulatory updates and artisanal sector overviews.',
    url: 'https://www.mozambiqueexpert.com/en/mozambique-gold-resources/',
    dataTypes: ['Gold deposit inventory', 'Project status updates', 'ASM sector overview', 'Historical production data', 'Investment climate assessments'],
    coverage: 'National',
    updateFrequency: 'Monthly',
    format: 'Web articles, research notes',
    license: 'Commercial (free articles)',
    usedIn: ['Mining Sites Registry — background data', 'Statistics — sector overview'],
    lastAccessed: '2025-02-01',
    reliability: 'medium'
  },

  // ACADEMIC
  {
    id: 'SRC-019',
    name: 'ResearchGate — Mineral Resources Potential in Mozambique',
    category: 'geospatial',
    provider: 'Dr. Albino Mahumane et al. (Eduardo Mondlane University)',
    providerType: 'academic',
    description: 'Peer-reviewed academic assessment of Mozambique\'s mineral resource potential, including gold deposit characterisation, geological context, and spatial distribution across provinces.',
    url: 'https://www.researchgate.net/publication/237447668_Mineral_resources_potential_in_Mozambique',
    dataTypes: ['Deposit characterisation', 'Provincial resource assessments', 'Greenstone belt mapping', 'Geological context for gold mineralisation', 'Reserve potential estimates'],
    coverage: 'National — geological systems',
    updateFrequency: 'Academic (one-time publication, 2008)',
    format: 'Peer-reviewed journal article',
    license: 'Academic open access',
    usedIn: ['Mining Sites Registry — Geology descriptions', 'Mining Map — geological context'],
    lastAccessed: '2025-01-18',
    reliability: 'medium',
    notes: 'Provides geological framework; supplemented by DNGRM 2019–2023 survey data'
  },
  {
    id: 'SRC-020',
    name: 'Wikipedia — Mineral Industry of Mozambique',
    category: 'production',
    provider: 'Wikipedia / Wikimedia Foundation',
    providerType: 'academic',
    description: 'Aggregated overview of Mozambique\'s mineral industry providing sector context, historical production figures, key companies and regulatory framework summary.',
    url: 'https://en.wikipedia.org/wiki/Mineral_industry_of_Mozambique',
    dataTypes: ['Sector overview', 'Key company listings', 'Historical context', 'Links to primary sources'],
    coverage: 'National',
    updateFrequency: 'Community-edited',
    format: 'Web',
    license: 'CC BY-SA',
    usedIn: ['Background context for registry and statistics'],
    lastAccessed: '2025-01-05',
    reliability: 'low',
    notes: 'Used for contextual background only; all specific data points verified against primary sources'
  }
];

const categoryLabels: Record<SourceCategory, string> = {
  all: 'All Sources',
  production: 'Production & Industry',
  regulatory: 'Regulatory & Legal',
  geospatial: 'Geospatial & Mapping',
  market: 'Market & Trade',
  security: 'Security & Intelligence',
};

const categoryColors: Record<SourceCategory, string> = {
  all: '#64748b',
  production: '#f59e0b',
  regulatory: '#3b82f6',
  geospatial: '#10b981',
  market: '#8b5cf6',
  security: '#ef4444',
};

const providerTypeColors: Record<DataSource['providerType'], string> = {
  government: '#10b981',
  international: '#3b82f6',
  ngo: '#8b5cf6',
  commercial: '#f59e0b',
  academic: '#94a3b8',
  satellite: '#06b6d4',
};

const providerTypeLabels: Record<DataSource['providerType'], string> = {
  government: 'Government',
  international: 'International Org.',
  ngo: 'NGO / Civil Society',
  commercial: 'Commercial',
  academic: 'Academic',
  satellite: 'Satellite / Remote Sensing',
};

const DataSources: React.FC = () => {
  const [category, setCategory] = useState<SourceCategory>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = sources.filter(s => {
    const matchCat = category === 'all' || s.category === category;
    const matchSearch = !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.provider.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const categories = ['all', 'regulatory', 'production', 'geospatial', 'market', 'security'] as SourceCategory[];

  const reliabilityColor = (r: DataSource['reliability']) =>
    r === 'high' ? '#10b981' : r === 'medium' ? '#f59e0b' : '#ef4444';

  const totalSources = sources.length;
  const categoryCount = (cat: SourceCategory) =>
    cat === 'all' ? totalSources : sources.filter(s => s.category === cat).length;

  return (
    <div style={{ padding: '24px', overflowY: 'auto', height: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
          Data Sources & References
        </h1>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
          Complete inventory of all data sources, datasets and methodologies used in this platform
        </p>
      </div>

      {/* Summary Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e2433 0%, #252d3d 100%)',
        border: '1px solid #3b82f622', borderRadius: 14, padding: 20, marginBottom: 24
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
          {[
            { label: 'Total Sources', value: totalSources, color: '#f1f5f9' },
            { label: 'Government', value: sources.filter(s => s.providerType === 'government').length, color: '#10b981' },
            { label: 'International Orgs', value: sources.filter(s => s.providerType === 'international').length, color: '#3b82f6' },
            { label: 'Commercial', value: sources.filter(s => s.providerType === 'commercial').length, color: '#f59e0b' },
            { label: 'NGO / Academic', value: sources.filter(s => s.providerType === 'ngo' || s.providerType === 'academic').length, color: '#8b5cf6' },
            { label: 'High Reliability', value: sources.filter(s => s.reliability === 'high').length, color: '#10b981' },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: item.color }}>{item.value}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search sources…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            background: '#1e2433', border: '1px solid #2d3748', borderRadius: 8,
            padding: '8px 14px', color: '#f1f5f9', fontSize: 13, width: 260,
            outline: 'none'
          }}
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
                background: category === cat ? `${categoryColors[cat]}22` : '#1e2433',
                color: category === cat ? categoryColors[cat] : '#64748b',
                border: category === cat ? `1px solid ${categoryColors[cat]}44` : '1px solid #2d3748',
                fontSize: 12, fontWeight: 600, transition: 'all 0.2s'
              } as React.CSSProperties}
            >
              {categoryLabels[cat]} ({categoryCount(cat)})
            </button>
          ))}
        </div>
        <div style={{ color: '#64748b', fontSize: 13, marginLeft: 'auto' }}>
          {filtered.length} sources
        </div>
      </div>

      {/* Source Cards */}
      {filtered.map(src => {
        const isExpanded = expandedId === src.id;
        const catColor = categoryColors[src.category];
        const ptColor = providerTypeColors[src.providerType];

        return (
          <div key={src.id} style={{
            background: '#1e2433', border: '1px solid #2d3748',
            borderRadius: 12, overflow: 'hidden', marginBottom: 10
          }}>
            {/* Header Row */}
            <div
              onClick={() => setExpandedId(isExpanded ? null : src.id)}
              style={{
                padding: '14px 18px', cursor: 'pointer',
                display: 'flex', alignItems: 'flex-start', gap: 14,
                background: isExpanded ? '#252d3d' : 'transparent'
              }}
            >
              {/* Category colour strip */}
              <div style={{
                width: 4, alignSelf: 'stretch', borderRadius: 2,
                background: catColor, flexShrink: 0, minHeight: 32
              }} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace' }}>{src.id}</span>
                  <span style={{
                    fontSize: 11, padding: '1px 7px', borderRadius: 4,
                    background: `${catColor}22`, color: catColor, fontWeight: 600
                  }}>{categoryLabels[src.category]}</span>
                  <span style={{
                    fontSize: 11, padding: '1px 7px', borderRadius: 4,
                    background: `${ptColor}22`, color: ptColor, fontWeight: 600
                  }}>{providerTypeLabels[src.providerType]}</span>
                </div>
                <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{src.name}</div>
                <div style={{ color: '#64748b', fontSize: 12 }}>{src.provider}</div>
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                <span style={{
                  fontSize: 11, padding: '2px 8px', borderRadius: 4, fontWeight: 700,
                  background: `${reliabilityColor(src.reliability)}22`,
                  color: reliabilityColor(src.reliability),
                  border: `1px solid ${reliabilityColor(src.reliability)}44`
                }}>
                  {src.reliability.toUpperCase()} RELIABILITY
                </span>
                <span style={{ color: '#64748b', fontSize: 16 }}>{isExpanded ? '▲' : '▼'}</span>
              </div>
            </div>

            {/* Expanded Detail */}
            {isExpanded && (
              <div style={{ padding: '0 18px 20px 36px', borderTop: '1px solid #2d3748' }}>
                <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, marginTop: 14, marginBottom: 16 }}>
                  {src.description}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
                  {/* Left column */}
                  <div>
                    <SectionHeader label="Source Details" />
                    <InfoRow label="URL / Reference" value={
                      <a href={src.url} target="_blank" rel="noopener noreferrer"
                        style={{ color: '#3b82f6', textDecoration: 'none', fontSize: 12, wordBreak: 'break-all' }}
                        onClick={e => e.stopPropagation()}>
                        {src.url}
                      </a>
                    } />
                    <InfoRow label="Coverage" value={src.coverage} />
                    <InfoRow label="Update Frequency" value={src.updateFrequency} />
                    <InfoRow label="Format" value={src.format} />
                    <InfoRow label="License" value={src.license} />
                    <InfoRow label="Last Accessed" value={src.lastAccessed} />
                  </div>

                  {/* Right column */}
                  <div>
                    <SectionHeader label="Data Types Provided" />
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {src.dataTypes.map((dt, i) => (
                        <li key={i} style={{ color: '#cbd5e1', fontSize: 12, marginBottom: 4 }}>{dt}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Used in */}
                  <div>
                    <SectionHeader label="Used In This Platform" />
                    {src.usedIn.map((u, i) => (
                      <div key={i} style={{
                        background: '#0f1117', border: '1px solid #1e293b',
                        borderRadius: 6, padding: '4px 10px', marginBottom: 4,
                        color: '#94a3b8', fontSize: 12
                      }}>📌 {u}</div>
                    ))}
                    {src.notes && (
                      <div style={{
                        marginTop: 10, padding: '8px 12px',
                        background: '#f59e0b11', border: '1px solid #f59e0b33',
                        borderRadius: 6, color: '#fde68a', fontSize: 12, lineHeight: 1.5
                      }}>
                        💡 {src.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, color: '#475569' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <div style={{ fontSize: 18 }}>No sources match your search</div>
        </div>
      )}

      {/* Disclaimer */}
      <div style={{
        marginTop: 24, padding: 20,
        background: '#1e2433', border: '1px solid #3b82f622',
        borderRadius: 12
      }}>
        <div style={{ color: '#3b82f6', fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
          ℹ️ Data Usage & Disclaimer
        </div>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          This platform integrates data from {totalSources} sources across government, international organisations, commercial providers, and open-access repositories.
          Production volumes, export values and royalty figures presented as real-time or near real-time data are based on the latest available official reports and are
          updated as new disclosures become available. All financial calculations use LBMA gold reference rates. Illicit hotspot intelligence is derived from
          satellite analysis, law enforcement alerts and community reporting — these are intelligence assessments and should not be treated as prosecutorial evidence.
          Full API integration with MIREME, INAMI and Banco de Moçambique is recommended for production deployment to achieve true real-time data flows.
        </p>
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ label: string }> = ({ label }) => (
  <div style={{ color: '#475569', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginTop: 4 }}>
    {label}
  </div>
);

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
    <span style={{ fontSize: 12, color: '#64748b', flexShrink: 0, minWidth: 110 }}>{label}:</span>
    <span style={{ fontSize: 12, color: '#cbd5e1', flex: 1 }}>{value}</span>
  </div>
);

export default DataSources;
