import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, LayersControl, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { miningSites, siteStatusColors, siteTypeLabels } from '../../data/miningSites';
import { illicitHotspots, threatLevelColors, hotspotTypeLabels } from '../../data/illicitHotspots';

const { BaseLayer, Overlay } = LayersControl;

const MapView: React.FC = () => {
  const [showSites, setShowSites] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);

  const mozambiqueCenter: [number, number] = [-18.0, 35.0];

  const totalProductionOz = miningSites.reduce((sum, s) => sum + s.ytdProductionOz, 0);
  const activeSites = miningSites.filter(s => s.status === 'active');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1e293b', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
              Mining Operations Map
            </h1>
            <p style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>
              Republic of Mozambique — Authorized sites, concessions & illicit hotspots
            </p>
          </div>
          {/* Layer Toggles */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowSites(!showSites)}
              style={{
                padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
                background: showSites ? '#10b98122' : '#1e2433',
                color: showSites ? '#10b981' : '#64748b',
                border: showSites ? '1px solid #10b98144' : '1px solid #2d3748',
                fontSize: 13, fontWeight: 600, transition: 'all 0.2s'
              } as React.CSSProperties}
            >
              📍 Licensed Sites ({miningSites.length})
            </button>
            <button
              onClick={() => setShowHotspots(!showHotspots)}
              style={{
                padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
                background: showHotspots ? '#ef444422' : '#1e2433',
                color: showHotspots ? '#ef4444' : '#64748b',
                border: showHotspots ? '1px solid #ef444444' : '1px solid #2d3748',
                fontSize: 13, fontWeight: 600, transition: 'all 0.2s'
              } as React.CSSProperties}
            >
              🚨 Illicit Hotspots ({illicitHotspots.length})
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div style={{ display: 'flex', gap: 24, marginTop: 12, flexWrap: 'wrap' }}>
          {[
            { label: 'Active Sites', value: `${activeSites.length}`, color: '#10b981' },
            { label: 'YTD Production', value: `${totalProductionOz.toLocaleString()} oz`, color: '#f59e0b' },
            { label: 'Critical Hotspots', value: `${illicitHotspots.filter(h => h.threatLevel === 'critical').length}`, color: '#ef4444' },
            { label: 'High Threat', value: `${illicitHotspots.filter(h => h.threatLevel === 'high').length}`, color: '#f97316' },
            { label: 'Provinces Covered', value: '7', color: '#3b82f6' }
          ].map((stat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: stat.color }} />
              <span style={{ color: '#64748b', fontSize: 12 }}>{stat.label}:</span>
              <span style={{ color: stat.color, fontWeight: 600, fontSize: 12 }}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer
          center={mozambiqueCenter}
          zoom={6}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
        >
          <ZoomControl position="bottomright" />

          <LayersControl position="topright">
            <BaseLayer checked name="Dark (OpenStreetMap)">
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                maxZoom={19}
              />
            </BaseLayer>
            <BaseLayer name="Satellite (Esri)">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                maxZoom={19}
              />
            </BaseLayer>
            <BaseLayer name="Terrain (OpenTopoMap)">
              <TileLayer
                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                attribution='Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap'
                maxZoom={17}
              />
            </BaseLayer>

            {/* Licensed Mining Sites */}
            {showSites && (
              <Overlay checked name="Licensed Mining Sites">
                <>
                  {miningSites.map(site => {
                    const color = siteStatusColors[site.status];
                    const isActive = site.status === 'active';
                    const radius = site.type === 'large_scale' ? 14 : site.type === 'small_scale' ? 10 : 7;

                    return (
                      <CircleMarker
                        key={site.id}
                        center={site.coordinates}
                        radius={radius}
                        pathOptions={{
                          fillColor: color,
                          color: isActive ? color : '#fff',
                          weight: 2,
                          opacity: 1,
                          fillOpacity: 0.85
                        }}
                      >
                        <Tooltip permanent={false} direction="top">
                          <div style={{ minWidth: 160 }}>
                            <strong>{site.name}</strong>
                            <br />{site.id} • {siteTypeLabels[site.type]}
                            <br />Status: <span style={{ color }}>{site.status}</span>
                            <br />YTD: {site.ytdProductionOz.toLocaleString()} oz
                          </div>
                        </Tooltip>
                        <Popup>
                          <div style={{ minWidth: 240, fontFamily: 'sans-serif' }}>
                            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: '#1e293b' }}>
                              {site.name}
                            </div>
                            <table style={{ width: '100%', fontSize: 12 }}>
                              <tbody>
                                <tr><td style={{ color: '#64748b', paddingRight: 8 }}>ID:</td><td>{site.id}</td></tr>
                                <tr><td style={{ color: '#64748b' }}>Type:</td><td>{siteTypeLabels[site.type]}</td></tr>
                                <tr><td style={{ color: '#64748b' }}>Status:</td><td style={{ color, fontWeight: 600 }}>{site.status.toUpperCase()}</td></tr>
                                <tr><td style={{ color: '#64748b' }}>Province:</td><td>{site.province}</td></tr>
                                <tr><td style={{ color: '#64748b' }}>District:</td><td>{site.district}</td></tr>
                                <tr><td style={{ color: '#64748b' }}>Operator:</td><td>{site.operator}</td></tr>
                                <tr><td style={{ color: '#64748b' }}>License:</td><td>{site.licenseNumber}</td></tr>
                                <tr><td style={{ color: '#64748b' }}>Expiry:</td><td>{site.licenseExpiry}</td></tr>
                                <tr><td style={{ color: '#64748b' }}>Grade:</td><td>{site.goldGradeGpt} g/t</td></tr>
                                <tr><td style={{ color: '#64748b' }}>Capacity:</td><td>{site.annualCapacityOz.toLocaleString()} oz/yr</td></tr>
                                <tr><td style={{ color: '#64748b' }}>YTD Prod.:</td><td><strong>{site.ytdProductionOz.toLocaleString()} oz</strong></td></tr>
                                <tr><td style={{ color: '#64748b' }}>Workers:</td><td>{site.workers}</td></tr>
                                <tr><td style={{ color: '#64748b' }}>Area:</td><td>{site.areaHectares.toLocaleString()} ha</td></tr>
                                <tr><td style={{ color: '#64748b' }}>EITI:</td><td>{site.eitiReporting ? '✅' : '❌'}</td></tr>
                                <tr><td style={{ color: '#64748b' }}>EPC:</td><td>{site.epcCompliant ? '✅' : '❌'}</td></tr>
                                <tr><td style={{ color: '#64748b' }}>Exports:</td><td>{site.exportDestinations.join(', ') || 'None'}</td></tr>
                              </tbody>
                            </table>
                            <div style={{ marginTop: 8, padding: '4px 8px', background: '#f8fafc', borderRadius: 4, fontSize: 11, color: '#64748b' }}>
                              📍 {site.coordinates[0].toFixed(4)}, {site.coordinates[1].toFixed(4)} • {site.elevation}m
                            </div>
                          </div>
                        </Popup>
                      </CircleMarker>
                    );
                  })}
                </>
              </Overlay>
            )}

            {/* Illicit Hotspots */}
            {showHotspots && (
              <Overlay checked name="Illicit Hotspots">
                <>
                  {illicitHotspots.map(hotspot => {
                    const color = threatLevelColors[hotspot.threatLevel];
                    const isPulsing = hotspot.status === 'active';
                    const radius = hotspot.threatLevel === 'critical' ? 16 :
                      hotspot.threatLevel === 'high' ? 13 :
                      hotspot.threatLevel === 'medium' ? 10 : 8;

                    return (
                      <CircleMarker
                        key={hotspot.id}
                        center={hotspot.coordinates}
                        radius={radius}
                        pathOptions={{
                          fillColor: color,
                          color: color,
                          weight: 2,
                          opacity: 0.9,
                          fillOpacity: isPulsing ? 0.6 : 0.3,
                          dashArray: hotspot.status === 'monitored' ? '4,4' : undefined
                        }}
                      >
                        <Tooltip permanent={false} direction="top">
                          <div style={{ minWidth: 160 }}>
                            <strong>⚠️ {hotspot.name}</strong>
                            <br />{hotspotTypeLabels[hotspot.type]}
                            <br />Threat: <span style={{ color, fontWeight: 700 }}>{hotspot.threatLevel.toUpperCase()}</span>
                            {hotspot.estimatedOzPerMonth && (
                              <><br />Est. {hotspot.estimatedOzPerMonth.toLocaleString()} oz/month</>
                            )}
                          </div>
                        </Tooltip>
                        <Popup>
                          <div style={{ minWidth: 260, fontFamily: 'sans-serif' }}>
                            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: '#7f1d1d' }}>
                              ⚠️ {hotspot.name}
                            </div>
                            <div style={{
                              display: 'inline-block', padding: '2px 8px', borderRadius: 4, marginBottom: 8,
                              background: `${color}22`, color, fontWeight: 700, fontSize: 11,
                              border: `1px solid ${color}44`
                            }}>{hotspot.threatLevel.toUpperCase()} THREAT — {hotspot.status.toUpperCase()}</div>
                            <div style={{ fontSize: 12, color: '#374151', marginBottom: 8, lineHeight: 1.5 }}>
                              {hotspot.description}
                            </div>
                            <table style={{ width: '100%', fontSize: 12 }}>
                              <tbody>
                                <tr><td style={{ color: '#64748b', paddingRight: 8 }}>Type:</td><td>{hotspotTypeLabels[hotspot.type]}</td></tr>
                                <tr><td style={{ color: '#64748b' }}>Province:</td><td>{hotspot.province}</td></tr>
                                <tr><td style={{ color: '#64748b' }}>District:</td><td>{hotspot.district}</td></tr>
                                {hotspot.estimatedMiners != null && hotspot.estimatedMiners > 0 && (
                                  <tr><td style={{ color: '#64748b' }}>Est. Miners:</td><td>{hotspot.estimatedMiners.toLocaleString()}</td></tr>
                                )}
                                {hotspot.estimatedOzPerMonth != null && (
                                  <tr><td style={{ color: '#64748b' }}>Est. Output:</td><td>{hotspot.estimatedOzPerMonth.toLocaleString()} oz/month</td></tr>
                                )}
                                <tr><td style={{ color: '#64748b' }}>Detected:</td><td>{hotspot.detectedDate}</td></tr>
                                <tr><td style={{ color: '#64748b' }}>Updated:</td><td>{hotspot.lastUpdated}</td></tr>
                                <tr><td style={{ color: '#64748b' }}>Satellite:</td><td>{hotspot.satelliteConfirmed ? '✅ Confirmed' : '❌ Not confirmed'}</td></tr>
                                <tr><td style={{ color: '#64748b' }}>LE Alert:</td><td>{hotspot.lawEnforcementAlert ? '🚔 Issued' : 'No'}</td></tr>
                                {hotspot.nearestLegalSite && (
                                  <tr><td style={{ color: '#64748b' }}>Nearest Site:</td><td>{hotspot.nearestLegalSite} ({hotspot.distanceToLegalSiteKm}km)</td></tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </Popup>
                      </CircleMarker>
                    );
                  })}
                </>
              </Overlay>
            )}
          </LayersControl>
        </MapContainer>

        {/* Map Legend */}
        <div style={{
          position: 'absolute', bottom: 40, left: 12, zIndex: 1000,
          background: 'rgba(15, 17, 23, 0.92)', border: '1px solid #2d3748',
          borderRadius: 10, padding: '12px 16px', minWidth: 200,
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            Legend
          </div>

          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase' }}>
            Licensed Sites
          </div>
          {[
            { label: 'Active', color: '#10b981' },
            { label: 'Suspended', color: '#f59e0b' },
            { label: 'Under Review', color: '#3b82f6' }
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: item.color }} />
              <span style={{ fontSize: 12, color: '#cbd5e1' }}>{item.label}</span>
            </div>
          ))}

          <div style={{ fontSize: 11, color: '#64748b', marginTop: 10, marginBottom: 6, fontWeight: 600, textTransform: 'uppercase' }}>
            Illicit Hotspots
          </div>
          {[
            { label: 'Critical', color: '#ef4444' },
            { label: 'High', color: '#f97316' },
            { label: 'Medium', color: '#f59e0b' },
            { label: 'Low', color: '#84cc16' }
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: item.color, opacity: 0.7 }} />
              <span style={{ fontSize: 12, color: '#cbd5e1' }}>{item.label}</span>
            </div>
          ))}

          <div style={{ borderTop: '1px solid #2d3748', marginTop: 8, paddingTop: 8 }}>
            <div style={{ fontSize: 11, color: '#475569' }}>Circle size = scale</div>
            <div style={{ fontSize: 11, color: '#475569' }}>Dashed = monitored</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
