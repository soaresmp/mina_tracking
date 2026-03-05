export interface MonthlyStats {
  month: string;
  productionOz: number;
  exportOz: number;
  revenueUSD: number;
  royaltiesUSD: number;
  taxesUSD: number;
  activeMiners: number;
  incidents: number;
}

export interface ExportBreakdown {
  destination: string;
  quantityOz: number;
  valueUSD: number;
  percentage: number;
  flag: string;
}

export interface ProvinceStats {
  province: string;
  productionOz: number;
  sites: number;
  miners: number;
  illicitHotspots: number;
  revenueUSD: number;
}

export interface KPIData {
  totalProductionYTDOz: number;
  totalProductionYTDChangePercent: number;
  totalExportValueUSD: number;
  totalExportValueChangePercent: number;
  totalRoyaltiesUSD: number;
  activeSites: number;
  totalLicensedMiners: number;
  illicitHotspotsActive: number;
  complianceRate: number;
  goldPriceUSDoz: number;
  goldPriceChange24h: number;
}

export const kpiData: KPIData = {
  totalProductionYTDOz: 66450,
  totalProductionYTDChangePercent: 12.4,
  totalExportValueUSD: 154820000,
  totalExportValueChangePercent: 18.7,
  totalRoyaltiesUSD: 7741000,
  activeSites: 7,
  totalLicensedMiners: 1758,
  illicitHotspotsActive: 6,
  complianceRate: 68.2,
  goldPriceUSDoz: 2329.50,
  goldPriceChange24h: 0.8
};

export const monthlyStats: MonthlyStats[] = [
  { month: 'Mar 2024', productionOz: 5420, exportOz: 5100, revenueUSD: 10890000, royaltiesUSD: 544000, taxesUSD: 820000, activeMiners: 1680, incidents: 3 },
  { month: 'Apr 2024', productionOz: 5640, exportOz: 5380, revenueUSD: 11250000, royaltiesUSD: 564000, taxesUSD: 852000, activeMiners: 1690, incidents: 2 },
  { month: 'May 2024', productionOz: 5900, exportOz: 5650, revenueUSD: 11600000, royaltiesUSD: 590000, taxesUSD: 880000, activeMiners: 1710, incidents: 4 },
  { month: 'Jun 2024', productionOz: 5720, exportOz: 5500, revenueUSD: 11380000, royaltiesUSD: 572000, taxesUSD: 862000, activeMiners: 1700, incidents: 2 },
  { month: 'Jul 2024', productionOz: 5980, exportOz: 5720, revenueUSD: 12150000, royaltiesUSD: 598000, taxesUSD: 902000, activeMiners: 1715, incidents: 5 },
  { month: 'Aug 2024', productionOz: 6120, exportOz: 5880, revenueUSD: 12490000, royaltiesUSD: 612000, taxesUSD: 922000, activeMiners: 1725, incidents: 3 },
  { month: 'Sep 2024', productionOz: 5840, exportOz: 5610, revenueUSD: 12080000, royaltiesUSD: 584000, taxesUSD: 882000, activeMiners: 1700, incidents: 2 },
  { month: 'Oct 2024', productionOz: 6290, exportOz: 6030, revenueUSD: 13120000, royaltiesUSD: 629000, taxesUSD: 950000, activeMiners: 1730, incidents: 1 },
  { month: 'Nov 2024', productionOz: 6140, exportOz: 5900, revenueUSD: 13560000, royaltiesUSD: 614000, taxesUSD: 938000, activeMiners: 1740, incidents: 3 },
  { month: 'Dec 2024', productionOz: 5960, exportOz: 5700, revenueUSD: 13820000, royaltiesUSD: 596000, taxesUSD: 920000, activeMiners: 1745, incidents: 2 },
  { month: 'Jan 2025', productionOz: 6180, exportOz: 5980, revenueUSD: 14210000, royaltiesUSD: 618000, taxesUSD: 948000, activeMiners: 1752, incidents: 4 },
  { month: 'Feb 2025', productionOz: 7260, exportOz: 7040, revenueUSD: 16980000, royaltiesUSD: 726000, taxesUSD: 1089000, activeMiners: 1758, incidents: 2 }
];

export const exportBreakdown: ExportBreakdown[] = [
  { destination: 'United Arab Emirates', quantityOz: 38200, valueUSD: 88960000, percentage: 57.5, flag: '🇦🇪' },
  { destination: 'South Africa', quantityOz: 14800, valueUSD: 34470000, percentage: 22.3, flag: '🇿🇦' },
  { destination: 'China', quantityOz: 8400, valueUSD: 19560000, percentage: 12.6, flag: '🇨🇳' },
  { destination: 'Switzerland', quantityOz: 3200, valueUSD: 7450000, percentage: 4.8, flag: '🇨🇭' },
  { destination: 'Other', quantityOz: 1850, valueUSD: 4380000, percentage: 2.8, flag: '🌍' }
];

export const provinceStats: ProvinceStats[] = [
  { province: 'Manica', productionOz: 43890, sites: 4, miners: 1182, illicitHotspots: 2, revenueUSD: 102210000 },
  { province: 'Tete', productionOz: 12960, sites: 3, miners: 446, illicitHotspots: 3, revenueUSD: 30190000 },
  { province: 'Sofala', productionOz: 4320, sites: 1, miners: 98, illicitHotspots: 2, revenueUSD: 10060000 },
  { province: 'Niassa', productionOz: 0, sites: 1, miners: 42, illicitHotspots: 1, revenueUSD: 0 },
  { province: 'Cabo Delgado', productionOz: 0, sites: 1, miners: 0, illicitHotspots: 2, revenueUSD: 0 },
  { province: 'Zambezia', productionOz: 0, sites: 0, miners: 0, illicitHotspots: 2, revenueUSD: 0 },
  { province: 'Gaza', productionOz: 0, sites: 0, miners: 0, illicitHotspots: 1, revenueUSD: 0 }
];

export const complianceData = [
  { name: 'EITI Registered', value: 9, total: 15, color: '#10b981' },
  { name: 'KYC Verified', value: 12, total: 15, color: '#3b82f6' },
  { name: 'EPC Compliant', value: 8, total: 10, color: '#8b5cf6' },
  { name: 'License Valid', value: 8, total: 10, color: '#f59e0b' }
];

export const recentAlerts = [
  {
    id: 'ALT-001',
    type: 'critical',
    message: 'Niassa Gold Corp license suspension — environmental violations confirmed',
    timestamp: '2025-03-05T08:14:22Z',
    site: 'MZ-GOLD-006',
    actorId: 'OP-0102'
  },
  {
    id: 'ALT-002',
    type: 'warning',
    message: 'East Africa Resources Ltd license expiry approaching — Cabo Delgado concession',
    timestamp: '2025-03-05T07:30:10Z',
    site: 'MZ-GOLD-010',
    actorId: 'OP-0149'
  },
  {
    id: 'ALT-003',
    type: 'info',
    message: 'New illicit hotspot confirmed — Cabo Delgado Northern Footprint (satellite)',
    timestamp: '2025-03-04T22:05:44Z',
    site: null,
    actorId: null
  },
  {
    id: 'ALT-004',
    type: 'warning',
    message: 'Beira Precious Metals KYB renewal overdue — 163 days outstanding',
    timestamp: '2025-03-04T15:18:33Z',
    site: null,
    actorId: 'EXP-0003'
  },
  {
    id: 'ALT-005',
    type: 'critical',
    message: 'Manica-Zimbabwe border gold smuggling — law enforcement alert issued',
    timestamp: '2025-03-04T09:42:11Z',
    site: null,
    actorId: null
  },
  {
    id: 'ALT-006',
    type: 'info',
    message: 'Fair Bride Gold Mine (MZ-GOLD-001) — monthly production target exceeded +8.2%',
    timestamp: '2025-03-03T16:30:00Z',
    site: 'MZ-GOLD-001',
    actorId: 'OP-0012'
  },
  {
    id: 'ALT-007',
    type: 'warning',
    message: 'Mercury contamination detected near Sussundenga hotspot — DNGRM notified',
    timestamp: '2025-03-03T11:20:15Z',
    site: null,
    actorId: null
  },
  {
    id: 'ALT-008',
    type: 'info',
    message: 'Cooperativa Mineiros de Manica — Q4 2024 EITI report submitted',
    timestamp: '2025-03-02T14:00:00Z',
    site: 'MZ-GOLD-002',
    actorId: 'OP-0034'
  }
];

export const auditTrail = [
  {
    id: 'AUD-9941',
    date: '2025-03-05T10:22:00Z',
    actor: 'Metals of Africa Ltd',
    actorId: 'OP-0012',
    action: 'Gold Export',
    siteId: 'MZ-GOLD-001',
    quantityOz: 3790,
    valueUSD: 8827050,
    destination: 'UAE',
    exporterRef: 'EXP-0001',
    documentRef: 'EXP-CERT-2025-03-0041',
    status: 'cleared',
    royaltyPaid: 441350,
    taxPaid: 662854
  },
  {
    id: 'AUD-9940',
    date: '2025-03-04T15:45:00Z',
    actor: 'Tete Mining Resources Lda',
    actorId: 'OP-0051',
    action: 'Gold Export',
    siteId: 'MZ-GOLD-003',
    quantityOz: 820,
    valueUSD: 1910190,
    destination: 'China',
    exporterRef: 'EXP-0002',
    documentRef: 'EXP-CERT-2025-03-0040',
    status: 'cleared',
    royaltyPaid: 95510,
    taxPaid: 143265
  },
  {
    id: 'AUD-9939',
    date: '2025-03-04T09:30:00Z',
    actor: 'Cooperativa Mineiros de Manica',
    actorId: 'OP-0034',
    action: 'Gold Sale to MGE',
    siteId: 'MZ-GOLD-002',
    quantityOz: 210,
    valueUSD: 489195,
    destination: 'Domestic',
    exporterRef: 'EXP-0001',
    documentRef: 'MGE-PURCH-2025-03-0882',
    status: 'cleared',
    royaltyPaid: 24460,
    taxPaid: 36690
  },
  {
    id: 'AUD-9938',
    date: '2025-03-03T18:20:00Z',
    actor: 'Sofala Mineral Ventures Lda',
    actorId: 'OP-0089',
    action: 'Gold Export',
    siteId: 'MZ-GOLD-005',
    quantityOz: 395,
    valueUSD: 920153,
    destination: 'South Africa',
    exporterRef: 'EXP-0003',
    documentRef: 'EXP-CERT-2025-03-0039',
    status: 'under_review',
    royaltyPaid: 0,
    taxPaid: 0
  },
  {
    id: 'AUD-9937',
    date: '2025-03-03T11:00:00Z',
    actor: 'EMEM',
    actorId: 'OP-0011',
    action: 'Gold Export',
    siteId: 'MZ-GOLD-009',
    quantityOz: 630,
    valueUSD: 1467585,
    destination: 'UAE',
    exporterRef: 'EXP-0001',
    documentRef: 'EXP-CERT-2025-03-0038',
    status: 'cleared',
    royaltyPaid: 73380,
    taxPaid: 110069
  }
];
