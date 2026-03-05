import React, { useState, useMemo } from 'react';
import { actors, actorTypeLabels, actorTypeColors, kycStatusColors, Actor, ActorType, KYCStatus } from '../../data/actors';
import { miningSites, siteStatusColors, SiteStatus, MiningSite } from '../../data/miningSites';

type RegistryTab = 'actors' | 'sites';

const RiskBadge: React.FC<{ score: number }> = ({ score }) => {
  const color = score >= 70 ? '#ef4444' : score >= 40 ? '#f59e0b' : '#10b981';
  const label = score >= 70 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW';
  return (
    <span style={{
      background: `${color}22`, color, border: `1px solid ${color}44`,
      padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700
    }}>{label} ({score})</span>
  );
};

const StatusBadge: React.FC<{ status: string; color: string }> = ({ status, color }) => (
  <span style={{
    background: `${color}22`, color, border: `1px solid ${color}44`,
    padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
    textTransform: 'capitalize'
  }}>{status.replace(/_/g, ' ')}</span>
);

const ActorCard: React.FC<{ actor: Actor; expanded: boolean; onToggle: () => void }> = ({
  actor, expanded, onToggle
}) => {
  const typeColor = actorTypeColors[actor.type];
  const kycColor = kycStatusColors[actor.kycStatus];

  return (
    <div style={{
      background: '#1e2433', border: `1px solid ${actor.riskScore >= 70 ? '#ef444433' : '#2d3748'}`,
      borderRadius: 10, overflow: 'hidden', marginBottom: 12
    }}>
      <div
        onClick={onToggle}
        style={{
          padding: '14px 18px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 14,
          background: expanded ? '#252d3d' : 'transparent',
          transition: 'background 0.2s'
        }}
      >
        {/* Type indicator */}
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: `${typeColor}22`, border: `1px solid ${typeColor}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0
        }}>
          {actor.type === 'operator' ? '🏭' :
           actor.type === 'miner' ? '⛏️' :
           actor.type === 'exporter' ? '📦' :
           actor.type === 'processor' ? '🔬' :
           actor.type === 'government' ? '🏛️' : '💰'}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 14 }}>{actor.name}</span>
            {actor.riskScore >= 40 && (
              <span style={{ fontSize: 14 }}>{actor.riskScore >= 70 ? '🚩' : '⚠️'}</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{
              background: `${typeColor}22`, color: typeColor, border: `1px solid ${typeColor}33`,
              padding: '1px 7px', borderRadius: 4, fontSize: 11
            }}>{actorTypeLabels[actor.type]}</span>
            <span style={{ color: '#64748b', fontSize: 12 }}>{actor.id}</span>
            <span style={{ color: '#64748b', fontSize: 12 }}>•</span>
            <span style={{ color: '#64748b', fontSize: 12 }}>{actor.province}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <StatusBadge status={actor.kycStatus} color={kycColor} />
          <RiskBadge score={actor.riskScore} />
          <span style={{ color: '#64748b', fontSize: 16, marginLeft: 4 }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '0 18px 18px 18px', borderTop: '1px solid #2d3748' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginTop: 16 }}>

            {/* Identity */}
            <div>
              <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Identity & Registration</div>
              <InfoRow label="Registration No." value={actor.registrationNumber} />
              <InfoRow label="Tax ID (NUIT)" value={actor.taxId} />
              <InfoRow label="Country" value={actor.country} />
              <InfoRow label="Province" value={actor.province} />
              <InfoRow label="Address" value={actor.address} />
              <InfoRow label="Phone" value={actor.contactPhone} />
              <InfoRow label="Email" value={actor.contactEmail} />
              <InfoRow label="Registered" value={actor.registrationDate} />
            </div>

            {/* Compliance */}
            <div>
              <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Compliance & Licensing</div>
              <InfoRow label="KYC Status" value={actor.kycStatus.toUpperCase()} valueColor={kycColor} />
              <InfoRow label="KYB Status" value={actor.kybStatus.toUpperCase()} valueColor={kycStatusColors[actor.kybStatus]} />
              <InfoRow label="Compliance" value={actor.complianceLevel.replace('_', ' ').toUpperCase()} valueColor={actor.complianceLevel === 'full' ? '#10b981' : actor.complianceLevel === 'partial' ? '#f59e0b' : '#ef4444'} />
              <InfoRow label="EITI Registered" value={actor.eitiRegistered ? '✅ Yes' : '❌ No'} />
              {actor.licenseNumber && <InfoRow label="License No." value={actor.licenseNumber} />}
              {actor.licenseExpiry && <InfoRow label="License Expiry" value={actor.licenseExpiry} />}
              {actor.exportPermit && <InfoRow label="Export Permit" value={actor.exportPermit} />}
              <InfoRow label="Last Audit" value={actor.lastAudit} />
              <InfoRow label="Bank Account" value={actor.bankAccount} />
            </div>

            {/* Ownership */}
            <div>
              <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Directors & Beneficial Owners</div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: '#64748b' }}>Directors:</span>
                {actor.directors.map((d, i) => (
                  <div key={i} style={{ color: '#cbd5e1', fontSize: 13, marginTop: 2 }}>• {d}</div>
                ))}
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: '#64748b' }}>Beneficial Owners:</span>
                {actor.beneficialOwners.map((o, i) => (
                  <div key={i} style={{ color: '#cbd5e1', fontSize: 13, marginTop: 2 }}>• {o}</div>
                ))}
              </div>
              <InfoRow label="Annual Turnover" value={`$${(actor.annualTurnoverUSD / 1000000).toFixed(1)}M USD`} />
              <InfoRow label="Associated Sites" value={actor.associatedSites.join(', ') || 'None'} />
            </div>

            {/* Risk Flags */}
            {actor.flaggedReasons.length > 0 && (
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ color: '#ef4444', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                  🚩 Risk Flags & Compliance Issues
                </div>
                {actor.flaggedReasons.map((reason, i) => (
                  <div key={i} style={{
                    background: '#ef444411', border: '1px solid #ef444433',
                    borderRadius: 6, padding: '6px 12px', marginBottom: 6,
                    color: '#fca5a5', fontSize: 13
                  }}>⚠️ {reason}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string; valueColor?: string }> = ({ label, value, valueColor }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, gap: 8 }}>
    <span style={{ fontSize: 12, color: '#64748b', flexShrink: 0 }}>{label}</span>
    <span style={{ fontSize: 12, color: valueColor || '#cbd5e1', textAlign: 'right', fontWeight: valueColor ? 600 : 400 }}>{value}</span>
  </div>
);

const SiteRow: React.FC<{ site: MiningSite; expanded: boolean; onToggle: () => void }> = ({
  site, expanded, onToggle
}) => {
  const statusColor = siteStatusColors[site.status];
  const progressPct = Math.min(100, (site.ytdProductionOz / site.annualCapacityOz) * 100) || 0;

  return (
    <div style={{
      background: '#1e2433', border: `1px solid #2d3748`,
      borderRadius: 10, overflow: 'hidden', marginBottom: 10
    }}>
      <div onClick={onToggle} style={{
        padding: '14px 18px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 12,
        background: expanded ? '#252d3d' : 'transparent'
      }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: statusColor, boxShadow: `0 0 8px ${statusColor}`,
          flexShrink: 0
        }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 14 }}>{site.name}</span>
            <span style={{ color: '#64748b', fontSize: 12 }}>{site.id}</span>
          </div>
          <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>
            {site.province} • {site.district} • {site.type.replace('_', ' ')}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 600 }}>
            {site.ytdProductionOz.toLocaleString()} oz
          </div>
          <div style={{ color: '#64748b', fontSize: 11 }}>YTD production</div>
        </div>
        <StatusBadge status={site.status} color={statusColor} />
        <span style={{ color: '#64748b', fontSize: 16 }}>{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div style={{ padding: '0 18px 18px 18px', borderTop: '1px solid #2d3748' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginTop: 16 }}>
            <div>
              <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Site Details</div>
              <InfoRow label="License No." value={site.licenseNumber} />
              <InfoRow label="License Expiry" value={site.licenseExpiry} />
              <InfoRow label="Operator" value={site.operator} />
              <InfoRow label="Province" value={site.province} />
              <InfoRow label="District" value={site.district} />
              <InfoRow label="Coordinates" value={`${site.coordinates[0].toFixed(4)}, ${site.coordinates[1].toFixed(4)}`} />
              <InfoRow label="Elevation" value={`${site.elevation}m`} />
              <InfoRow label="Area" value={`${site.areaHectares.toLocaleString()} ha`} />
            </div>
            <div>
              <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Production Data</div>
              <InfoRow label="Gold Grade" value={`${site.goldGradeGpt} g/t`} />
              <InfoRow label="Annual Capacity" value={`${site.annualCapacityOz.toLocaleString()} oz/yr`} />
              <InfoRow label="YTD Production" value={`${site.ytdProductionOz.toLocaleString()} oz`} />
              <InfoRow label="Workers" value={site.workers.toLocaleString()} />
              <InfoRow label="Geology" value={site.geology} />
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>
                  Capacity utilisation: {progressPct.toFixed(1)}%
                </div>
                <div style={{ height: 8, background: '#2d3748', borderRadius: 4 }}>
                  <div style={{
                    height: '100%', borderRadius: 4,
                    background: progressPct > 80 ? '#10b981' : progressPct > 50 ? '#f59e0b' : '#ef4444',
                    width: `${progressPct}%`
                  }} />
                </div>
              </div>
            </div>
            <div>
              <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Compliance & Exports</div>
              <InfoRow label="EPC Compliant" value={site.epcCompliant ? '✅ Yes' : '❌ No'} valueColor={site.epcCompliant ? '#10b981' : '#ef4444'} />
              <InfoRow label="EITI Reporting" value={site.eitiReporting ? '✅ Yes' : '❌ No'} valueColor={site.eitiReporting ? '#10b981' : '#ef4444'} />
              <InfoRow label="Last Inspection" value={site.lastInspection} />
              <div style={{ marginTop: 8 }}>
                <span style={{ fontSize: 12, color: '#64748b' }}>Export Destinations:</span>
                {site.exportDestinations.length > 0 ? site.exportDestinations.map((d, i) => (
                  <div key={i} style={{ color: '#cbd5e1', fontSize: 13, marginTop: 2 }}>• {d}</div>
                )) : <div style={{ color: '#ef4444', fontSize: 13, marginTop: 2 }}>None — operations suspended</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Registry: React.FC = () => {
  const [tab, setTab] = useState<RegistryTab>('actors');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<ActorType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<SiteStatus | 'all'>('all');
  const [kycFilter, setKycFilter] = useState<KYCStatus | 'all'>('all');
  const [flaggedOnly, setFlaggedOnly] = useState(false);

  const filteredActors = useMemo(() => {
    return actors.filter(a => {
      const matchSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.province.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = typeFilter === 'all' || a.type === typeFilter;
      const matchKyc = kycFilter === 'all' || a.kycStatus === kycFilter;
      const matchFlagged = !flaggedOnly || a.riskScore >= 40;
      return matchSearch && matchType && matchKyc && matchFlagged;
    });
  }, [searchTerm, typeFilter, kycFilter, flaggedOnly]);

  const filteredSites = useMemo(() => {
    return miningSites.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.operator.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [searchTerm, statusFilter]);

  return (
    <div style={{ padding: '24px', overflowY: 'auto', height: '100%' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f1f5f9' }}>
          Licensing Registry
        </h1>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
          Licensed miners, operators, exporters, processors and government bodies — KYC/KYB profiles
        </p>
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#1e2433', padding: 4, borderRadius: 10, width: 'fit-content' }}>
        {(['actors', 'sites'] as RegistryTab[]).map(t => (
          <button key={t} onClick={() => { setTab(t); setSearchTerm(''); setExpandedId(null); }}
            style={{
              padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: tab === t ? '#3b82f6' : 'transparent',
              color: tab === t ? '#fff' : '#64748b',
              fontWeight: 600, fontSize: 14, transition: 'all 0.2s'
            }}>
            {t === 'actors' ? `👤 Actors (${actors.length})` : `📍 Mining Sites (${miningSites.length})`}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder={`Search ${tab === 'actors' ? 'actors' : 'sites'}...`}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            background: '#1e2433', border: '1px solid #2d3748', borderRadius: 8,
            padding: '8px 14px', color: '#f1f5f9', fontSize: 13, flex: '1', minWidth: 200,
            outline: 'none'
          }}
        />

        {tab === 'actors' && (
          <>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as ActorType | 'all')}
              style={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 8, padding: '8px 14px', color: '#f1f5f9', fontSize: 13, cursor: 'pointer' }}>
              <option value="all">All Types</option>
              {(Object.keys(actorTypeLabels) as ActorType[]).map(t => (
                <option key={t} value={t}>{actorTypeLabels[t]}</option>
              ))}
            </select>
            <select value={kycFilter} onChange={e => setKycFilter(e.target.value as KYCStatus | 'all')}
              style={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 8, padding: '8px 14px', color: '#f1f5f9', fontSize: 13, cursor: 'pointer' }}>
              <option value="all">All KYC Status</option>
              <option value="verified">✅ Verified</option>
              <option value="pending">⏳ Pending</option>
              <option value="flagged">🚩 Flagged</option>
              <option value="rejected">❌ Rejected</option>
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#94a3b8', fontSize: 13 }}>
              <input type="checkbox" checked={flaggedOnly} onChange={e => setFlaggedOnly(e.target.checked)}
                style={{ accentColor: '#ef4444' }} />
              High/Medium Risk only
            </label>
          </>
        )}

        {tab === 'sites' && (
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as SiteStatus | 'all')}
            style={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 8, padding: '8px 14px', color: '#f1f5f9', fontSize: 13, cursor: 'pointer' }}>
            <option value="all">All Statuses</option>
            <option value="active">🟢 Active</option>
            <option value="suspended">🟡 Suspended</option>
            <option value="under_review">🔵 Under Review</option>
            <option value="closed">🔴 Closed</option>
          </select>
        )}

        <div style={{ color: '#64748b', fontSize: 13, marginLeft: 'auto' }}>
          {tab === 'actors' ? filteredActors.length : filteredSites.length} results
        </div>
      </div>

      {/* Results */}
      {tab === 'actors' && filteredActors.map(actor => (
        <ActorCard
          key={actor.id}
          actor={actor}
          expanded={expandedId === actor.id}
          onToggle={() => setExpandedId(expandedId === actor.id ? null : actor.id)}
        />
      ))}

      {tab === 'sites' && filteredSites.map(site => (
        <SiteRow
          key={site.id}
          site={site}
          expanded={expandedId === site.id}
          onToggle={() => setExpandedId(expandedId === site.id ? null : site.id)}
        />
      ))}

      {((tab === 'actors' && filteredActors.length === 0) || (tab === 'sites' && filteredSites.length === 0)) && (
        <div style={{ textAlign: 'center', padding: 60, color: '#475569' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <div style={{ fontSize: 18 }}>No results found</div>
          <div style={{ fontSize: 14, marginTop: 8 }}>Try adjusting your search or filters</div>
        </div>
      )}
    </div>
  );
};

export default Registry;
