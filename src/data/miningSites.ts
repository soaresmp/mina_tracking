export type SiteStatus = 'active' | 'suspended' | 'under_review' | 'closed';
export type SiteType = 'large_scale' | 'small_scale' | 'artisanal';

export interface MiningSite {
  id: string;
  name: string;
  licenseNumber: string;
  type: SiteType;
  status: SiteStatus;
  province: string;
  district: string;
  coordinates: [number, number]; // [lat, lng]
  operator: string;
  operatorId: string;
  areaHectares: number;
  goldGradeGpt: number; // grams per tonne
  annualCapacityOz: number;
  ytdProductionOz: number;
  lastInspection: string;
  licenseExpiry: string;
  epcCompliant: boolean;
  eitiReporting: boolean;
  workers: number;
  elevation: number;
  geology: string;
  exportDestinations: string[];
  monthlyProduction: number[]; // last 12 months in oz
}

export const miningSites: MiningSite[] = [
  {
    id: 'MZ-GOLD-001',
    name: 'Fair Bride Gold Mine',
    licenseNumber: 'MIN-2019-4521',
    type: 'large_scale',
    status: 'active',
    province: 'Manica',
    district: 'Manica',
    coordinates: [-19.1077, 33.0777],
    operator: 'Metals of Africa Ltd',
    operatorId: 'OP-0012',
    areaHectares: 3240,
    goldGradeGpt: 2.3,
    annualCapacityOz: 50000,
    ytdProductionOz: 38420,
    lastInspection: '2025-01-15',
    licenseExpiry: '2029-06-30',
    epcCompliant: true,
    eitiReporting: true,
    workers: 487,
    elevation: 820,
    geology: 'Greenstone belt, quartz-veined schist',
    exportDestinations: ['UAE', 'South Africa', 'Switzerland'],
    monthlyProduction: [3100, 3250, 3400, 3200, 3350, 3450, 3280, 3520, 3410, 3290, 3380, 3790]
  },
  {
    id: 'MZ-GOLD-002',
    name: 'Manica Corridor ASM Zone A',
    licenseNumber: 'ASM-2021-1103',
    type: 'artisanal',
    status: 'active',
    province: 'Manica',
    district: 'Sussundenga',
    coordinates: [-19.2812, 33.3651],
    operator: 'Cooperativa Mineiros de Manica',
    operatorId: 'OP-0034',
    areaHectares: 210,
    goldGradeGpt: 0.8,
    annualCapacityOz: 3200,
    ytdProductionOz: 2180,
    lastInspection: '2024-11-20',
    licenseExpiry: '2026-12-31',
    epcCompliant: true,
    eitiReporting: true,
    workers: 340,
    elevation: 640,
    geology: 'Alluvial deposits, Revue River basin',
    exportDestinations: ['UAE'],
    monthlyProduction: [160, 175, 190, 185, 195, 200, 182, 210, 195, 188, 200, 320]
  },
  {
    id: 'MZ-GOLD-003',
    name: 'Chifumbazi Gold Deposit',
    licenseNumber: 'MIN-2022-7830',
    type: 'small_scale',
    status: 'active',
    province: 'Tete',
    district: 'Chifunde',
    coordinates: [-15.1421, 32.0188],
    operator: 'Tete Mining Resources Lda',
    operatorId: 'OP-0051',
    areaHectares: 780,
    goldGradeGpt: 1.6,
    annualCapacityOz: 12000,
    ytdProductionOz: 9840,
    lastInspection: '2025-02-08',
    licenseExpiry: '2028-03-15',
    epcCompliant: true,
    eitiReporting: true,
    workers: 156,
    elevation: 310,
    geology: 'Mafic-ultramafic complex, Chifunde greenstone',
    exportDestinations: ['UAE', 'China'],
    monthlyProduction: [780, 810, 850, 820, 870, 890, 820, 900, 850, 810, 840, 600]
  },
  {
    id: 'MZ-GOLD-004',
    name: 'Barue Alluvial Gold Zone',
    licenseNumber: 'ASM-2020-0887',
    type: 'artisanal',
    status: 'active',
    province: 'Manica',
    district: 'Barue',
    coordinates: [-18.2914, 33.6842],
    operator: 'Associação Mineiros Barue',
    operatorId: 'OP-0067',
    areaHectares: 145,
    goldGradeGpt: 0.6,
    annualCapacityOz: 1800,
    ytdProductionOz: 1290,
    lastInspection: '2024-09-12',
    licenseExpiry: '2025-12-31',
    epcCompliant: false,
    eitiReporting: false,
    workers: 215,
    elevation: 480,
    geology: 'Alluvial, Zambezi tributary deposits',
    exportDestinations: ['South Africa'],
    monthlyProduction: [95, 105, 110, 108, 112, 118, 105, 115, 110, 108, 112, 192]
  },
  {
    id: 'MZ-GOLD-005',
    name: 'Pungwe River Gold Concession',
    licenseNumber: 'MIN-2023-2241',
    type: 'small_scale',
    status: 'active',
    province: 'Sofala',
    district: 'Dondo',
    coordinates: [-19.6021, 34.7542],
    operator: 'Sofala Mineral Ventures Lda',
    operatorId: 'OP-0089',
    areaHectares: 420,
    goldGradeGpt: 0.9,
    annualCapacityOz: 6500,
    ytdProductionOz: 4320,
    lastInspection: '2024-12-05',
    licenseExpiry: '2027-08-20',
    epcCompliant: true,
    eitiReporting: true,
    workers: 98,
    elevation: 55,
    geology: 'Alluvial fluvial deposits, Pungwe River',
    exportDestinations: ['UAE', 'South Africa'],
    monthlyProduction: [340, 355, 370, 360, 380, 390, 360, 395, 375, 355, 365, 475]
  },
  {
    id: 'MZ-GOLD-006',
    name: 'Tsangano Hard Rock Mine',
    licenseNumber: 'MIN-2020-5519',
    type: 'small_scale',
    status: 'suspended',
    province: 'Tete',
    district: 'Tsangano',
    coordinates: [-15.7840, 34.2120],
    operator: 'Niassa Gold Corp',
    operatorId: 'OP-0102',
    areaHectares: 560,
    goldGradeGpt: 1.2,
    annualCapacityOz: 8000,
    ytdProductionOz: 1200,
    lastInspection: '2024-07-22',
    licenseExpiry: '2026-09-10',
    epcCompliant: false,
    eitiReporting: true,
    workers: 0,
    elevation: 750,
    geology: 'Precambrian granite-gneiss, quartz veins',
    exportDestinations: [],
    monthlyProduction: [600, 600, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  {
    id: 'MZ-GOLD-007',
    name: 'Niassa Exploration Block NB-12',
    licenseNumber: 'EXP-2024-0331',
    type: 'small_scale',
    status: 'under_review',
    province: 'Niassa',
    district: 'Marrupa',
    coordinates: [-13.2167, 36.9833],
    operator: 'Pan-African Minerals PLC',
    operatorId: 'OP-0118',
    areaHectares: 1200,
    goldGradeGpt: 1.8,
    annualCapacityOz: 0,
    ytdProductionOz: 0,
    lastInspection: '2025-01-30',
    licenseExpiry: '2026-01-30',
    epcCompliant: true,
    eitiReporting: true,
    workers: 42,
    elevation: 650,
    geology: 'Proterozoic basement, Marrupa complex',
    exportDestinations: [],
    monthlyProduction: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  {
    id: 'MZ-GOLD-008',
    name: 'Zambezi Valley Alluvial ASM Zone C',
    licenseNumber: 'ASM-2022-2018',
    type: 'artisanal',
    status: 'active',
    province: 'Tete',
    district: 'Moatize',
    coordinates: [-16.1055, 33.7442],
    operator: 'Cooperativa Zambezi Ouro',
    operatorId: 'OP-0135',
    areaHectares: 180,
    goldGradeGpt: 0.7,
    annualCapacityOz: 2400,
    ytdProductionOz: 1920,
    lastInspection: '2024-10-15',
    licenseExpiry: '2026-06-30',
    epcCompliant: true,
    eitiReporting: false,
    workers: 290,
    elevation: 155,
    geology: 'Zambezi alluvial floodplain',
    exportDestinations: ['South Africa'],
    monthlyProduction: [145, 155, 165, 160, 170, 175, 158, 178, 166, 159, 165, 324]
  },
  {
    id: 'MZ-GOLD-009',
    name: 'Revue River Primary Deposit',
    licenseNumber: 'MIN-2021-3344',
    type: 'small_scale',
    status: 'active',
    province: 'Manica',
    district: 'Gondola',
    coordinates: [-19.0500, 33.9500],
    operator: 'EMEM — Empresa Moçambicana de Exploração Mineira',
    operatorId: 'OP-0011',
    areaHectares: 650,
    goldGradeGpt: 1.1,
    annualCapacityOz: 9000,
    ytdProductionOz: 7280,
    lastInspection: '2025-02-20',
    licenseExpiry: '2029-03-15',
    epcCompliant: true,
    eitiReporting: true,
    workers: 128,
    elevation: 430,
    geology: 'Greenstone belt extension, Manica system',
    exportDestinations: ['UAE', 'South Africa', 'China'],
    monthlyProduction: [560, 590, 620, 600, 630, 650, 610, 660, 630, 600, 615, 515]
  },
  {
    id: 'MZ-GOLD-010',
    name: 'Cabo Delgado Northern Concession',
    licenseNumber: 'MIN-2023-8801',
    type: 'small_scale',
    status: 'under_review',
    province: 'Cabo Delgado',
    district: 'Mocimboa da Praia',
    coordinates: [-11.3500, 40.3500],
    operator: 'East Africa Resources Ltd',
    operatorId: 'OP-0149',
    areaHectares: 920,
    goldGradeGpt: 0.5,
    annualCapacityOz: 4000,
    ytdProductionOz: 0,
    lastInspection: '2024-08-10',
    licenseExpiry: '2025-08-10',
    epcCompliant: false,
    eitiReporting: false,
    workers: 0,
    elevation: 200,
    geology: 'Sedimentary cover, Rovuma basin margin',
    exportDestinations: [],
    monthlyProduction: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }
];

export const siteStatusColors: Record<SiteStatus, string> = {
  active: '#10b981',
  suspended: '#f59e0b',
  under_review: '#3b82f6',
  closed: '#ef4444'
};

export const siteTypeLabels: Record<SiteType, string> = {
  large_scale: 'Large Scale',
  small_scale: 'Small Scale',
  artisanal: 'Artisanal (ASM)'
};
