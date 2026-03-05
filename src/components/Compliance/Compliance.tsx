import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { actors, kycStatusColors } from '../../data/actors';
import { miningSites } from '../../data/miningSites';
import { complianceData } from '../../data/statistics';

type ComplianceTab = 'kyc' | 'eiti' | 'licenses' | 'risk';

const ProgressBar: React.FC<{ value: number; total: number; color: string; label: string }> = ({
  value, total, color, label
}) => {
  const pct = (value / total) * 100;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: '#cbd5e1' }}>{label}</span>
        <span style={{ fontSize: 13, color, fontWeight: 700 }}>{value}/{total} ({pct.toFixed(0)}%)</span>
      </div>
      <div style={{ height: 10, background: '#2d3748', borderRadius: 5 }}>
        <div style={{ height: '100%', borderRadius: 5, background: color, width: `${pct}%`, transition: 'width 0.8s' }} />
      </div>
    </div>
  );
};

const Compliance: React.FC = () => {
  const [tab, setTab] = useState<ComplianceTab>('kyc');

  const kycVerified = actors.filter(a => a.kycStatus === 'verified').length;
  const kybVerified = actors.filter(a => a.kybStatus === 'verified').length;
  const kycFlagged = actors.filter(a => a.kycStatus === 'flagged').length;
  const eitiRegistered = actors.filter(a => a.eitiRegistered).length;
  const fullCompliance = actors.filter(a => a.complianceLevel === 'full').length;
  const partialCompliance = actors.filter(a => a.complianceLevel === 'partial').length;
  const nonCompliant = actors.filter(a => a.complianceLevel === 'non_compliant').length;

  const expiringLicenses = miningSites.filter(s => {
    if (!s.licenseExpiry) return false;
    const expiry = new Date(s.licenseExpiry);
    const now = new Date('2025-03-05');
    const daysUntil = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return daysUntil < 365;
  });

  const highRiskActors = actors.filter(a => a.riskScore >= 60);
  const mediumRiskActors = actors.filter(a => a.riskScore >= 30 && a.riskScore < 60);

  const kycChartData = [
    { status: 'Verified', count: kycVerified, color: '#10b981' },
    { status: 'Pending', count: actors.filter(a => a.kycStatus === 'pending').length, color: '#f59e0b' },
    { status: 'Flagged', count: kycFlagged, color: '#ef4444' },
    { status: 'Rejected', count: actors.filter(a => a.kycStatus === 'rejected').length, color: '#7f1d1d' }
  ];

  const tabs: { id: ComplianceTab; label: string }[] = [
    { id: 'kyc', label: '🔍 KYC/KYB' },
    { id: 'eiti', label: '📊 EITI Compliance' },
    { id: 'licenses', label: '📜 License Status' },
    { id: 'risk', label: '🚩 Risk Register' }
  ];

  return (
    <div style={{ padding: '24px', overflowY: 'auto', height: '100%' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
          Compliance & Regulatory Overview
        </h1>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
          EITI compliance, KYC/KYB assessments, license monitoring, and risk register
        </p>
      </div>

      {/* Overall Compliance Score */}
      <div style={{
        background: 'linear-gradient(135deg, #1e2433 0%, #252d3d 100%)',
        border: '1px solid #3b82f622',
        borderRadius: 14, padding: 24, marginBottom: 24
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
              Overall Sector Compliance Score
            </div>
            <div style={{ fontSize: 48, fontWeight: 800, color: '#3b82f6', lineHeight: 1.2, marginTop: 4 }}>68.2%</div>
            <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>
              EITI Mozambique — Moderate compliance (82.5/100 EITI Board score)
            </div>
            <div style={{ fontSize: 13, color: '#f59e0b', marginTop: 8 }}>
              ⚠️ Next EITI validation: 1 July 2025 — Corrective actions required
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, minWidth: 360 }}>
            {[
              { label: 'Fully Compliant', value: fullCompliance, total: actors.length, color: '#10b981' },
              { label: 'Partial', value: partialCompliance, total: actors.length, color: '#f59e0b' },
              { label: 'Non-Compliant', value: nonCompliant, total: actors.length, color: '#ef4444' }
            ].map((item, i) => (
              <div key={i} style={{
                background: '#0f1117', borderRadius: 10, padding: '12px 16px',
                border: `1px solid ${item.color}33`, textAlign: 'center'
              }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: item.color }}>{item.value}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{item.label}</div>
                <div style={{ fontSize: 12, color: '#475569' }}>of {item.total} actors</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: 4, background: '#1e2433', padding: 4, borderRadius: 10, marginBottom: 20, width: 'fit-content', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: tab === t.id ? '#3b82f6' : 'transparent',
              color: tab === t.id ? '#fff' : '#64748b',
              fontWeight: 600, fontSize: 13, transition: 'all 0.2s'
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* KYC/KYB Tab */}
      {tab === 'kyc' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            {/* KYC Status */}
            <div style={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 12, padding: 20 }}>
              <h3 style={{ color: '#f1f5f9', marginBottom: 4, fontSize: 16 }}>KYC/KYB Status Distribution</h3>
              <p style={{ color: '#64748b', fontSize: 12, marginBottom: 16 }}>Know Your Customer/Business — all registered actors</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={kycChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                  <XAxis dataKey="status" tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 8 }}
                    formatter={(v: number) => [v, 'Actors']}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Count">
                    {kycChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div style={{ marginTop: 16 }}>
                <ProgressBar value={kycVerified} total={actors.length} color="#10b981" label="KYC Verified" />
                <ProgressBar value={kybVerified} total={actors.length} color="#3b82f6" label="KYB Verified" />
              </div>
            </div>

            {/* KYC Detail */}
            <div style={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 12, padding: 20 }}>
              <h3 style={{ color: '#f1f5f9', marginBottom: 16, fontSize: 16 }}>KYC/KYB Assessment Overview</h3>
              {complianceData.map((item, i) => (
                <ProgressBar key={i} value={item.value} total={item.total} color={item.color} label={item.name} />
              ))}

              <div style={{ marginTop: 20, padding: 16, background: '#0f1117', borderRadius: 10, border: '1px solid #2d3748' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#f59e0b', marginBottom: 8 }}>
                  ⚠️ Outstanding KYC/KYB Actions
                </div>
                {actors.filter(a => a.kycStatus !== 'verified' || a.kybStatus !== 'verified').map((a, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', padding: '6px 0',
                    borderBottom: '1px solid #1e293b', alignItems: 'center'
                  }}>
                    <span style={{ fontSize: 12, color: '#cbd5e1' }}>{a.name}</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span style={{
                        fontSize: 11, padding: '2px 6px', borderRadius: 4,
                        background: `${kycStatusColors[a.kycStatus]}22`,
                        color: kycStatusColors[a.kycStatus], fontWeight: 600
                      }}>KYC: {a.kycStatus}</span>
                      <span style={{
                        fontSize: 11, padding: '2px 6px', borderRadius: 4,
                        background: `${kycStatusColors[a.kybStatus]}22`,
                        color: kycStatusColors[a.kybStatus], fontWeight: 600
                      }}>KYB: {a.kybStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EITI Tab */}
      {tab === 'eiti' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div style={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 12, padding: 20 }}>
              <h3 style={{ color: '#f1f5f9', marginBottom: 16, fontSize: 16 }}>EITI Registration Status</h3>
              <div style={{ fontSize: 40, fontWeight: 800, color: '#10b981', marginBottom: 4 }}>
                {eitiRegistered}/{actors.length}
              </div>
              <div style={{ color: '#64748b', fontSize: 13, marginBottom: 16 }}>Actors registered with EITI Mozambique</div>
              <ProgressBar value={eitiRegistered} total={actors.length} color="#10b981" label="EITI Registered" />

              <div style={{ marginTop: 16, padding: 16, background: '#0f1117', borderRadius: 10, border: '1px solid #ef444433' }}>
                <div style={{ color: '#ef4444', fontWeight: 600, fontSize: 13, marginBottom: 10 }}>
                  ❌ Non-EITI Registered Actors
                </div>
                {actors.filter(a => !a.eitiRegistered).map((a, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #1e293b' }}>
                    <span style={{ fontSize: 12, color: '#fca5a5' }}>{a.name}</span>
                    <span style={{ fontSize: 11, color: '#64748b' }}>{a.type}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 12, padding: 20 }}>
              <h3 style={{ color: '#f1f5f9', marginBottom: 16, fontSize: 16 }}>EITI Corrective Actions</h3>
              {[
                { area: 'Industry Engagement', status: 'in_progress', deadline: '2025-07-01' },
                { area: 'Contract & License Allocations', status: 'pending', deadline: '2025-07-01' },
                { area: 'Beneficial Ownership Disclosure', status: 'in_progress', deadline: '2025-07-01' },
                { area: 'State Participation Reporting', status: 'pending', deadline: '2025-07-01' },
                { area: 'In-Kind Revenue Reporting', status: 'pending', deadline: '2025-07-01' },
                { area: 'Data Quality & Open Format', status: 'in_progress', deadline: '2025-07-01' },
                { area: 'Subnational Transfers', status: 'pending', deadline: '2025-07-01' },
                { area: 'Social & Environmental Expenditure', status: 'pending', deadline: '2025-07-01' }
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', padding: '8px 0',
                  borderBottom: '1px solid #1e293b', alignItems: 'center'
                }}>
                  <span style={{ fontSize: 13, color: '#cbd5e1' }}>{item.area}</span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 4,
                      background: item.status === 'in_progress' ? '#f59e0b22' : '#ef444422',
                      color: item.status === 'in_progress' ? '#f59e0b' : '#ef4444',
                      fontWeight: 600, border: `1px solid ${item.status === 'in_progress' ? '#f59e0b44' : '#ef444444'}`
                    }}>
                      {item.status === 'in_progress' ? '⏳ In Progress' : '🔴 Pending'}
                    </span>
                    <span style={{ fontSize: 11, color: '#475569' }}>{item.deadline}</span>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 16, padding: 12, background: '#f59e0b11', border: '1px solid #f59e0b33', borderRadius: 8 }}>
                <span style={{ color: '#fbbf24', fontSize: 13 }}>
                  📅 Next EITI Validation: 1 July 2025 — Progress assessment by EITI Board
                </span>
              </div>
            </div>
          </div>

          <div style={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 12, padding: 20 }}>
            <h3 style={{ color: '#f1f5f9', marginBottom: 16, fontSize: 16 }}>EITI Mozambique — Key Facts</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {[
                { icon: '📊', title: 'Current Score', desc: '82.5/100 — Moderate (EITI Board Decision 2023-29)', color: '#f59e0b' },
                { icon: '🏛️', title: 'Sector Contribution', desc: '~6% of GDP, ~8% of government revenues (2021)', color: '#3b82f6' },
                { icon: '💰', title: 'Export Share', desc: 'Nearly 1/3 of total national exports', color: '#10b981' },
                { icon: '⚠️', title: '2020 Audit Finding', desc: 'Forged payment records — USD 350,000 embezzled; ACC investigation', color: '#ef4444' },
                { icon: '🌍', title: 'International Framework', desc: 'EITI 2019 Standard, AfCFTA, EU-SADC EPA compliance', color: '#8b5cf6' },
                { icon: '📋', title: 'Governing Law', desc: 'Mining Law (Lei de Minas) • MIREME oversight • INAMI licensing', color: '#64748b' }
              ].map((item, i) => (
                <div key={i} style={{
                  background: '#0f1117', borderRadius: 10, padding: '14px 16px',
                  border: `1px solid ${item.color}22`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <span style={{ color: item.color, fontWeight: 600, fontSize: 14 }}>{item.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Licenses Tab */}
      {tab === 'licenses' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
            {[
              { label: 'Active Licenses', value: miningSites.filter(s => s.status === 'active').length, color: '#10b981' },
              { label: 'Suspended', value: miningSites.filter(s => s.status === 'suspended').length, color: '#f59e0b' },
              { label: 'Under Review', value: miningSites.filter(s => s.status === 'under_review').length, color: '#3b82f6' },
              { label: 'Expiring within 12m', value: expiringLicenses.length, color: '#ef4444' }
            ].map((item, i) => (
              <div key={i} style={{
                background: '#1e2433', border: `1px solid ${item.color}33`,
                borderRadius: 10, padding: '16px 20px', textAlign: 'center'
              }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: item.color }}>{item.value}</div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{item.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <h3 style={{ color: '#f1f5f9', marginBottom: 16, fontSize: 16 }}>License Registry — All Sites</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2d3748' }}>
                  {['Site ID', 'Site Name', 'Type', 'License No.', 'Expiry', 'Status', 'EPC', 'EITI'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#64748b', fontSize: 12, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {miningSites.map((site, i) => {
                  const expiry = new Date(site.licenseExpiry);
                  const now = new Date('2025-03-05');
                  const daysLeft = Math.round((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  const isExpiringSoon = daysLeft < 365;
                  const statusColor = site.status === 'active' ? '#10b981' : site.status === 'suspended' ? '#f59e0b' : '#3b82f6';

                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '10px 12px', color: '#3b82f6', fontSize: 11, fontFamily: 'monospace' }}>{site.id}</td>
                      <td style={{ padding: '10px 12px', color: '#f1f5f9', fontSize: 13 }}>{site.name}</td>
                      <td style={{ padding: '10px 12px', color: '#94a3b8', fontSize: 12 }}>{site.type.replace('_', ' ')}</td>
                      <td style={{ padding: '10px 12px', color: '#64748b', fontSize: 11, fontFamily: 'monospace' }}>{site.licenseNumber}</td>
                      <td style={{ padding: '10px 12px', color: isExpiringSoon ? '#ef4444' : '#10b981', fontSize: 12, fontWeight: isExpiringSoon ? 700 : 400 }}>
                        {site.licenseExpiry} {isExpiringSoon && `(${daysLeft}d)`}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          background: `${statusColor}22`, color: statusColor, border: `1px solid ${statusColor}44`,
                          padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600
                        }}>{site.status.replace('_', ' ').toUpperCase()}</span>
                      </td>
                      <td style={{ padding: '10px 12px', fontSize: 16 }}>{site.epcCompliant ? '✅' : '❌'}</td>
                      <td style={{ padding: '10px 12px', fontSize: 16 }}>{site.eitiReporting ? '✅' : '❌'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Risk Register Tab */}
      {tab === 'risk' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div style={{ background: '#1e2433', border: '1px solid #ef444433', borderRadius: 12, padding: 20 }}>
              <h3 style={{ color: '#ef4444', marginBottom: 4, fontSize: 16 }}>🚩 High Risk Actors</h3>
              <p style={{ color: '#64748b', fontSize: 12, marginBottom: 16 }}>Risk score ≥60 — Immediate intervention required</p>
              {highRiskActors.length === 0 ? (
                <div style={{ color: '#10b981', fontSize: 14, textAlign: 'center', padding: 20 }}>✅ No high risk actors</div>
              ) : highRiskActors.map((a, i) => (
                <div key={i} style={{
                  background: '#0f1117', borderRadius: 10, padding: '12px 14px',
                  border: '1px solid #ef444433', marginBottom: 10
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 13 }}>{a.name}</span>
                    <span style={{
                      background: '#ef444422', color: '#ef4444', fontWeight: 700, fontSize: 12,
                      padding: '2px 8px', borderRadius: 4
                    }}>Risk: {a.riskScore}/100</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>{a.id} • {a.type}</div>
                  {a.flaggedReasons.map((r, j) => (
                    <div key={j} style={{ fontSize: 12, color: '#fca5a5', marginBottom: 3 }}>• {r}</div>
                  ))}
                </div>
              ))}
            </div>

            <div style={{ background: '#1e2433', border: '1px solid #f59e0b33', borderRadius: 12, padding: 20 }}>
              <h3 style={{ color: '#f59e0b', marginBottom: 4, fontSize: 16 }}>⚠️ Medium Risk Actors</h3>
              <p style={{ color: '#64748b', fontSize: 12, marginBottom: 16 }}>Risk score 30-59 — Enhanced monitoring</p>
              {mediumRiskActors.map((a, i) => (
                <div key={i} style={{
                  background: '#0f1117', borderRadius: 10, padding: '12px 14px',
                  border: '1px solid #f59e0b33', marginBottom: 10
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 13 }}>{a.name}</span>
                    <span style={{
                      background: '#f59e0b22', color: '#f59e0b', fontWeight: 700, fontSize: 12,
                      padding: '2px 8px', borderRadius: 4
                    }}>Risk: {a.riskScore}/100</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>{a.id} • {a.type}</div>
                  {a.flaggedReasons.slice(0, 2).map((r, j) => (
                    <div key={j} style={{ fontSize: 12, color: '#fde68a', marginBottom: 3 }}>• {r}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 12, padding: 20 }}>
            <h3 style={{ color: '#f1f5f9', marginBottom: 16, fontSize: 16 }}>Risk Matrix — All Actors</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #2d3748' }}>
                    {['Actor', 'Type', 'KYC', 'KYB', 'EITI', 'Compliance', 'Risk Score'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#64748b', fontSize: 12, fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...actors].sort((a, b) => b.riskScore - a.riskScore).map((a, i) => {
                    const riskColor = a.riskScore >= 70 ? '#ef4444' : a.riskScore >= 40 ? '#f59e0b' : '#10b981';
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                        <td style={{ padding: '9px 12px', color: '#f1f5f9', fontSize: 13 }}>{a.name}</td>
                        <td style={{ padding: '9px 12px', color: '#94a3b8', fontSize: 12 }}>{a.type}</td>
                        <td style={{ padding: '9px 12px' }}>
                          <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 3,
                            background: `${kycStatusColors[a.kycStatus]}22`, color: kycStatusColors[a.kycStatus] }}>
                            {a.kycStatus}
                          </span>
                        </td>
                        <td style={{ padding: '9px 12px' }}>
                          <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 3,
                            background: `${kycStatusColors[a.kybStatus]}22`, color: kycStatusColors[a.kybStatus] }}>
                            {a.kybStatus}
                          </span>
                        </td>
                        <td style={{ padding: '9px 12px', fontSize: 14 }}>{a.eitiRegistered ? '✅' : '❌'}</td>
                        <td style={{ padding: '9px 12px', fontSize: 13, color: a.complianceLevel === 'full' ? '#10b981' : a.complianceLevel === 'partial' ? '#f59e0b' : '#ef4444' }}>
                          {a.complianceLevel.replace('_', ' ')}
                        </td>
                        <td style={{ padding: '9px 12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ height: 6, background: '#2d3748', borderRadius: 3, width: 60 }}>
                              <div style={{ height: '100%', borderRadius: 3, width: `${a.riskScore}%`, background: riskColor }} />
                            </div>
                            <span style={{ color: riskColor, fontWeight: 700, fontSize: 12 }}>{a.riskScore}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compliance;
