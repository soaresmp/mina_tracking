export type ThreatLevel = 'critical' | 'high' | 'medium' | 'low';
export type HotspotType = 'illegal_mining' | 'smuggling_route' | 'illicit_buyer' | 'border_crossing';

export interface IllicitHotspot {
  id: string;
  name: string;
  type: HotspotType;
  threatLevel: ThreatLevel;
  coordinates: [number, number];
  province: string;
  district: string;
  description: string;
  detectedDate: string;
  lastUpdated: string;
  estimatedMiners?: number;
  estimatedOzPerMonth?: number;
  satelliteConfirmed: boolean;
  communityReported: boolean;
  lawEnforcementAlert: boolean;
  status: 'active' | 'monitored' | 'resolved';
  nearestLegalSite?: string;
  distanceToLegalSiteKm?: number;
}

export const illicitHotspots: IllicitHotspot[] = [
  {
    id: 'HOT-001',
    name: 'Zambezia North Border Zone',
    type: 'smuggling_route',
    threatLevel: 'critical',
    coordinates: [-16.8500, 35.2800],
    province: 'Zambezia',
    district: 'Milange',
    description: 'Major cross-border smuggling corridor to Malawi. SAR satellite imagery shows frequent nocturnal movements. Estimated 80-120 kg/month gold transiting through without documentation.',
    detectedDate: '2023-08-15',
    lastUpdated: '2025-02-28',
    estimatedMiners: 800,
    estimatedOzPerMonth: 2800,
    satelliteConfirmed: true,
    communityReported: true,
    lawEnforcementAlert: true,
    status: 'active',
    nearestLegalSite: 'MZ-GOLD-008',
    distanceToLegalSiteKm: 145
  },
  {
    id: 'HOT-002',
    name: 'Moatize Informal Mining Camp',
    type: 'illegal_mining',
    threatLevel: 'high',
    coordinates: [-16.2218, 33.5540],
    province: 'Tete',
    district: 'Moatize',
    description: 'Unregistered artisanal mining operation operating adjacent to licensed ASM Zone C. Approximately 400-500 informal miners. No environmental controls or safety equipment. DNGRM inspection pending.',
    detectedDate: '2024-01-20',
    lastUpdated: '2025-02-15',
    estimatedMiners: 450,
    estimatedOzPerMonth: 1100,
    satelliteConfirmed: true,
    communityReported: true,
    lawEnforcementAlert: false,
    status: 'monitored',
    nearestLegalSite: 'MZ-GOLD-008',
    distanceToLegalSiteKm: 12
  },
  {
    id: 'HOT-003',
    name: 'Manica-Zimbabwe Border Crossing (Informal)',
    type: 'border_crossing',
    threatLevel: 'critical',
    coordinates: [-18.9500, 32.8800],
    province: 'Manica',
    district: 'Manica',
    description: 'Gold smuggling through informal border crossing points between Mozambique and Zimbabwe. Intelligence reports indicate organised criminal groups operating nightly. Gold sourced from both Mozambican and Zimbabwean illegal mines.',
    detectedDate: '2022-11-10',
    lastUpdated: '2025-03-01',
    estimatedMiners: 0,
    estimatedOzPerMonth: 3500,
    satelliteConfirmed: false,
    communityReported: true,
    lawEnforcementAlert: true,
    status: 'active'
  },
  {
    id: 'HOT-004',
    name: 'Sussundenga Ravine Camp',
    type: 'illegal_mining',
    threatLevel: 'high',
    coordinates: [-19.5500, 33.0100],
    province: 'Manica',
    district: 'Sussundenga',
    description: 'Remote canyon artisanal mining. Sentinel-2 satellite imagery shows active excavation and mercury use. Mercury contamination of the Revue River tributaries detected in 2024 environmental survey.',
    detectedDate: '2024-03-05',
    lastUpdated: '2025-01-20',
    estimatedMiners: 280,
    estimatedOzPerMonth: 650,
    satelliteConfirmed: true,
    communityReported: false,
    lawEnforcementAlert: false,
    status: 'monitored',
    nearestLegalSite: 'MZ-GOLD-002',
    distanceToLegalSiteKm: 38
  },
  {
    id: 'HOT-005',
    name: 'Chinde Coastal Export Point',
    type: 'illicit_buyer',
    threatLevel: 'medium',
    coordinates: [-17.9612, 36.4610],
    province: 'Zambezia',
    district: 'Chinde',
    description: 'Small coastal town used by unlicensed gold buyers. Dhow boat traffic transporting unverified gold to Tanzania and Zanzibar. Customs flagged suspicious cargo declarations in 2024.',
    detectedDate: '2024-06-18',
    lastUpdated: '2025-02-10',
    estimatedMiners: 0,
    estimatedOzPerMonth: 820,
    satelliteConfirmed: false,
    communityReported: true,
    lawEnforcementAlert: true,
    status: 'monitored'
  },
  {
    id: 'HOT-006',
    name: 'Niassa Province Remote Zone',
    type: 'illegal_mining',
    threatLevel: 'medium',
    coordinates: [-12.9500, 35.7800],
    province: 'Niassa',
    district: 'Lago',
    description: 'Remote alluvial gold deposits in Niassa NR buffer zone. Limited access has delayed formal assessment. Drone surveillance in Oct 2024 confirmed small-scale illegal activity, approximately 80-120 miners.',
    detectedDate: '2024-09-22',
    lastUpdated: '2025-01-05',
    estimatedMiners: 100,
    estimatedOzPerMonth: 180,
    satelliteConfirmed: true,
    communityReported: false,
    lawEnforcementAlert: false,
    status: 'monitored'
  },
  {
    id: 'HOT-007',
    name: 'Tete-Malawi Border Track',
    type: 'smuggling_route',
    threatLevel: 'high',
    coordinates: [-14.5000, 35.8500],
    province: 'Tete',
    district: 'Angónia',
    description: 'Cross-border track used for gold smuggling to Malawi, bypassing official Zobue border post. Intelligence indicates weekly convoys of 10-20 kg gold. Linked to illegal mining in Tsangano district.',
    detectedDate: '2023-05-14',
    lastUpdated: '2025-02-20',
    estimatedMiners: 0,
    estimatedOzPerMonth: 1500,
    satelliteConfirmed: false,
    communityReported: true,
    lawEnforcementAlert: true,
    status: 'active',
    nearestLegalSite: 'MZ-GOLD-006',
    distanceToLegalSiteKm: 55
  },
  {
    id: 'HOT-008',
    name: 'Cabo Delgado Northern Footprint',
    type: 'illegal_mining',
    threatLevel: 'high',
    coordinates: [-12.1800, 39.7200],
    province: 'Cabo Delgado',
    district: 'Muidumbe',
    description: 'Conflict-adjacent area where armed non-state actors may be controlling artisanal mining activity. Security situation prevents formal investigation. SAR data shows new excavation activity since Q3 2024.',
    detectedDate: '2024-07-01',
    lastUpdated: '2025-02-28',
    estimatedMiners: 200,
    estimatedOzPerMonth: 480,
    satelliteConfirmed: true,
    communityReported: false,
    lawEnforcementAlert: true,
    status: 'active'
  },
  {
    id: 'HOT-009',
    name: 'Gaza Province Alluvial Site',
    type: 'illegal_mining',
    threatLevel: 'low',
    coordinates: [-22.3500, 33.5200],
    province: 'Gaza',
    district: 'Mabalane',
    description: 'Small-scale informal alluvial gold panning along Limpopo River tributaries. Low production estimates. Community has applied for formal ASM designation — application under review at INAMI.',
    detectedDate: '2024-11-08',
    lastUpdated: '2025-01-15',
    estimatedMiners: 55,
    estimatedOzPerMonth: 85,
    satelliteConfirmed: false,
    communityReported: true,
    lawEnforcementAlert: false,
    status: 'monitored'
  },
  {
    id: 'HOT-010',
    name: 'Buzi River Informal Panning',
    type: 'illegal_mining',
    threatLevel: 'low',
    coordinates: [-19.9000, 34.4800],
    province: 'Sofala',
    district: 'Buzi',
    description: 'Seasonal artisanal gold panning in the Buzi River. Activity correlates with dry season (May–October). Miners reportedly sell gold to unlicensed buyers in Beira.',
    detectedDate: '2024-05-20',
    lastUpdated: '2024-10-30',
    estimatedMiners: 90,
    estimatedOzPerMonth: 120,
    satelliteConfirmed: false,
    communityReported: true,
    lawEnforcementAlert: false,
    status: 'monitored',
    nearestLegalSite: 'MZ-GOLD-005',
    distanceToLegalSiteKm: 28
  }
];

export const threatLevelColors: Record<ThreatLevel, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#84cc16'
};

export const hotspotTypeLabels: Record<HotspotType, string> = {
  illegal_mining: 'Illegal Mining',
  smuggling_route: 'Smuggling Route',
  illicit_buyer: 'Illicit Buyer',
  border_crossing: 'Illicit Border Crossing'
};
