import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import {
  monthlyStats, exportBreakdown, provinceStats,
  auditTrail
} from '../../data/statistics';
import { miningSites } from '../../data/miningSites';

type StatTab = 'production' | 'exports' | 'provinces' | 'audit';

const Statistics: React.FC = () => {
  const [tab, setTab] = useState<StatTab>('production');

  const totalProductionYTD = miningSites.reduce((s, m) => s + m.ytdProductionOz, 0);
  const totalExportValueYTD = exportBreakdown.reduce((s, e) => s + e.valueUSD, 0);
  const totalWorkersAll = miningSites.reduce((s, m) => s + m.workers, 0);

  // Per-site production data
  const siteProductionData = miningSites
    .filter(s => s.ytdProductionOz > 0)
    .sort((a, b) => b.ytdProductionOz - a.ytdProductionOz)
    .map(s => ({
      name: s.name.length > 22 ? s.name.substring(0, 22) + '…' : s.name,
      production: s.ytdProductionOz,
      capacity: s.annualCapacityOz,
      utilisation: Math.round((s.ytdProductionOz / s.annualCapacityOz) * 100)
    }));

  // Monthly revenue/royalties
  const revenueData = monthlyStats.map(m => ({
    month: m.month.split(' ')[0],
    revenue: +(m.revenueUSD / 1000000).toFixed(2),
    royalties: +(m.royaltiesUSD / 1000).toFixed(0),
    taxes: +(m.taxesUSD / 1000).toFixed(0),
    production: m.productionOz,
    exports: m.exportOz,
    miners: m.activeMiners
  }));

  // Radar data for site comparison
  const radarData = miningSites
    .filter(s => s.annualCapacityOz > 0)
    .map(s => ({
      site: s.name.split(' ').slice(0, 2).join(' '),
      grade: Math.min(100, s.goldGradeGpt * 40),
      capacity: Math.min(100, (s.annualCapacityOz / 50000) * 100),
      compliance: s.epcCompliant && s.eitiReporting ? 100 : s.epcCompliant || s.eitiReporting ? 60 : 20,
      workers: Math.min(100, (s.workers / 500) * 100),
      utilisation: Math.min(100, (s.ytdProductionOz / s.annualCapacityOz) * 100)
    }));

  const tabs: { id: StatTab; label: string }[] = [
    { id: 'production', label: '⛏️ Production' },
    { id: 'exports', label: '📦 Exports' },
    { id: 'provinces', label: '🗺️ Provinces' },
    { id: 'audit', label: '📋 Audit Trail' }
  ];

  const auditStatusColor = (s: string) => s === 'cleared' ? '#10b981' : s === 'under_review' ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ padding: '24px', overflowY: 'auto', height: '100%' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
          Statistics & Analytics
        </h1>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
          Mining capacity, production, exportation data and financial audit trail
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total YTD Production', value: `${totalProductionYTD.toLocaleString()} oz`, color: '#f59e0b', icon: '⛏️' },
          { label: 'Export Value YTD', value: `$${(totalExportValueYTD / 1000000).toFixed(1)}M`, color: '#10b981', icon: '📦' },
          { label: 'Royalties Collected', value: `$${(monthlyStats.reduce((s, m) => s + m.royaltiesUSD, 0) / 1000000).toFixed(2)}M`, color: '#3b82f6', icon: '🏛️' },
          { label: 'Total Registered Workers', value: totalWorkersAll.toLocaleString(), color: '#8b5cf6', icon: '👷' },
          { label: 'Total Tax Revenue', value: `$${(monthlyStats.reduce((s, m) => s + m.taxesUSD, 0) / 1000000).toFixed(2)}M`, color: '#ec4899', icon: '💰' },
          { label: 'Avg Gold Grade', value: `${(miningSites.filter(s => s.goldGradeGpt > 0).reduce((s, m) => s + m.goldGradeGpt, 0) / miningSites.filter(s => s.goldGradeGpt > 0).length).toFixed(2)} g/t`, color: '#f97316', icon: '🥇' }
        ].map((card, i) => (
          <div key={i} style={{
            background: '#1e2433', border: `1px solid ${card.color}22`,
            borderRadius: 10, padding: '14px 16px'
          }}>
            <div style={{ fontSize: 18, marginBottom: 6 }}>{card.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: card.color }}>{card.value}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: 4, background: '#1e2433', padding: 4, borderRadius: 10, marginBottom: 20, width: 'fit-content' }}>
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

      {/* Production Tab */}
      {tab === 'production' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            {/* Monthly Production */}
            <div style={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 12, padding: 20, gridColumn: '1 / -1' }}>
              <h3 style={{ color: '#f1f5f9', marginBottom: 4, fontSize: 16 }}>Monthly Gold Production & Exports</h3>
              <p style={{ color: '#64748b', fontSize: 12, marginBottom: 16 }}>All licensed sites combined — ounces per month</p>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 8 }}
                    formatter={(v: number, name: string) => [`${v.toLocaleString()} oz`, name]}
                  />
                  <Line type="monotone" dataKey="production" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 4 }} name="Production" />
                  <Line type="monotone" dataKey="exports" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} name="Exports" />
                  <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Site Production Comparison */}
            <div style={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 12, padding: 20 }}>
              <h3 style={{ color: '#f1f5f9', marginBottom: 4, fontSize: 16 }}>Production by Site (YTD)</h3>
              <p style={{ color: '#64748b', fontSize: 12, marginBottom: 16 }}>Ounces produced vs annual capacity</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={siteProductionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false}
                    tickFormatter={v => `${v.toLocaleString()}`} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} width={120} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 8 }}
                    formatter={(v: number, name: string) => [`${v.toLocaleString()} oz`, name]}
                  />
                  <Bar dataKey="capacity" fill="#2d3748" radius={[0, 4, 4, 0]} name="Annual Capacity" />
                  <Bar dataKey="production" fill="#f59e0b" radius={[0, 4, 4, 0]} name="YTD Production" />
                  <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue Trend */}
            <div style={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 12, padding: 20 }}>
              <h3 style={{ color: '#f1f5f9', marginBottom: 4, fontSize: 16 }}>Revenue & Government Take</h3>
              <p style={{ color: '#64748b', fontSize: 12, marginBottom: 16 }}>Monthly USD millions — export revenue, royalties & taxes</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false}
                    tickFormatter={v => `$${v.toFixed(0)}M`} />
                  <Tooltip
                    contentStyle={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 8 }}
                    formatter={(v: number, name: string) => {
                      if (name === 'Revenue') return [`$${v.toFixed(2)}M`, name];
                      return [`$${v.toLocaleString()}`, name];
                    }}
                  />
                  <Bar dataKey="revenue" fill="#10b981" radius={[3, 3, 0, 0]} name="Revenue" />
                  <Bar dataKey="royalties" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Royalties (K)" />
                  <Bar dataKey="taxes" fill="#8b5cf6" radius={[3, 3, 0, 0]} name="Taxes (K)" />
                  <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Site Radar */}
          <div style={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 12, padding: 20 }}>
            <h3 style={{ color: '#f1f5f9', marginBottom: 4, fontSize: 16 }}>Site Performance Radar</h3>
            <p style={{ color: '#64748b', fontSize: 12, marginBottom: 16 }}>Multi-dimensional comparison: grade, capacity, compliance, workers, utilisation</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 20 }}>
              {radarData.slice(0, 4).map((site, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>{site.site}</div>
                  <ResponsiveContainer width={200} height={180}>
                    <RadarChart data={[
                      { metric: 'Grade', value: site.grade },
                      { metric: 'Capacity', value: site.capacity },
                      { metric: 'Compliance', value: site.compliance },
                      { metric: 'Workers', value: site.workers },
                      { metric: 'Utilisation', value: site.utilisation }
                    ]}>
                      <PolarGrid stroke="#2d3748" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 10 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar dataKey="value" stroke={['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'][i]} fill={['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'][i]} fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Exports Tab */}
      {tab === 'exports' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div style={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 12, padding: 20 }}>
              <h3 style={{ color: '#f1f5f9', marginBottom: 4, fontSize: 16 }}>Export Value by Destination (YTD)</h3>
              <p style={{ color: '#64748b', fontSize: 12, marginBottom: 16 }}>Verified export shipments — USD value</p>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={exportBreakdown} cx="50%" cy="50%" outerRadius={100}
                    dataKey="valueUSD" nameKey="destination" label={({ destination, percentage }) => `${percentage}%`}
                    labelLine={{ stroke: '#4b5563' }}>
                    {exportBreakdown.map((_, i) => (
                      <Cell key={i} fill={['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#64748b'][i]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 8 }}
                    formatter={(v: number, name: string) => [`$${(v / 1000000).toFixed(1)}M`, name]}
                  />
                  <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 12, padding: 20 }}>
              <h3 style={{ color: '#f1f5f9', marginBottom: 4, fontSize: 16 }}>Export Volume by Destination</h3>
              <p style={{ color: '#64748b', fontSize: 12, marginBottom: 16 }}>Gold ounces by country</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={exportBreakdown} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="destination" tick={{ fill: '#94a3b8', fontSize: 11 }} width={160} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 8 }}
                    formatter={(v: number) => [`${v.toLocaleString()} oz`, 'Volume']}
                  />
                  <Bar dataKey="quantityOz" radius={[0, 6, 6, 0]} name="Volume (oz)">
                    {exportBreakdown.map((_, i) => (
                      <Cell key={i} fill={['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#64748b'][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Export Detail Table */}
          <div style={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 12, padding: 20 }}>
            <h3 style={{ color: '#f1f5f9', marginBottom: 16, fontSize: 16 }}>Export Breakdown Detail</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2d3748' }}>
                  {['Destination', 'Volume (oz)', 'Value (USD)', 'Share', 'Trend'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#64748b', fontSize: 12, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {exportBreakdown.map((item, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '10px 12px', color: '#f1f5f9', fontSize: 13 }}>
                      {item.flag} {item.destination}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#cbd5e1', fontSize: 13 }}>
                      {item.quantityOz.toLocaleString()} oz
                    </td>
                    <td style={{ padding: '10px 12px', color: '#10b981', fontSize: 13, fontWeight: 600 }}>
                      ${(item.valueUSD / 1000000).toFixed(2)}M
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ height: 8, background: '#2d3748', borderRadius: 4, width: 80 }}>
                          <div style={{
                            height: '100%', borderRadius: 4, width: `${item.percentage}%`,
                            background: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#64748b'][i]
                          }} />
                        </div>
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>{item.percentage}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#10b981', fontSize: 13 }}>↑ Growing</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Provinces Tab */}
      {tab === 'provinces' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div style={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 12, padding: 20 }}>
              <h3 style={{ color: '#f1f5f9', marginBottom: 4, fontSize: 16 }}>Production by Province</h3>
              <p style={{ color: '#64748b', fontSize: 12, marginBottom: 16 }}>YTD gold ounces per province</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={provinceStats.filter(p => p.productionOz > 0)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                  <XAxis dataKey="province" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 8 }}
                    formatter={(v: number) => [`${v.toLocaleString()} oz`, 'Production']}
                  />
                  <Bar dataKey="productionOz" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Production (oz)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 12, padding: 20 }}>
              <h3 style={{ color: '#f1f5f9', marginBottom: 4, fontSize: 16 }}>Illicit Hotspots by Province</h3>
              <p style={{ color: '#64748b', fontSize: 12, marginBottom: 16 }}>Security threat distribution</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={provinceStats.filter(p => p.illicitHotspots > 0)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                  <XAxis dataKey="province" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 8 }}
                    formatter={(v: number) => [v, 'Hotspots']}
                  />
                  <Bar dataKey="illicitHotspots" fill="#ef4444" radius={[4, 4, 0, 0]} name="Illicit Hotspots" />
                  <Bar dataKey="sites" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Licensed Sites" />
                  <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Province Detail Table */}
          <div style={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 12, padding: 20 }}>
            <h3 style={{ color: '#f1f5f9', marginBottom: 16, fontSize: 16 }}>Province Summary Table</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2d3748' }}>
                  {['Province', 'Licensed Sites', 'Registered Miners', 'YTD Production (oz)', 'Revenue (USD)', 'Illicit Hotspots'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#64748b', fontSize: 12, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {provinceStats.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '10px 12px', color: '#f1f5f9', fontSize: 13, fontWeight: 600 }}>{p.province}</td>
                    <td style={{ padding: '10px 12px', color: '#3b82f6', fontSize: 13 }}>{p.sites}</td>
                    <td style={{ padding: '10px 12px', color: '#f59e0b', fontSize: 13 }}>{p.miners.toLocaleString()}</td>
                    <td style={{ padding: '10px 12px', color: p.productionOz > 0 ? '#10b981' : '#475569', fontSize: 13, fontWeight: p.productionOz > 0 ? 600 : 400 }}>
                      {p.productionOz > 0 ? p.productionOz.toLocaleString() : '—'}
                    </td>
                    <td style={{ padding: '10px 12px', color: p.revenueUSD > 0 ? '#10b981' : '#475569', fontSize: 13 }}>
                      {p.revenueUSD > 0 ? `$${(p.revenueUSD / 1000000).toFixed(1)}M` : '—'}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      {p.illicitHotspots > 0 ? (
                        <span style={{ color: '#ef4444', fontWeight: 700, fontSize: 13 }}>⚠️ {p.illicitHotspots}</span>
                      ) : (
                        <span style={{ color: '#10b981', fontSize: 13 }}>✓ None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Trail Tab */}
      {tab === 'audit' && (
        <div>
          <div style={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <h3 style={{ color: '#f1f5f9', marginBottom: 4, fontSize: 16 }}>Financial Audit Trail</h3>
            <p style={{ color: '#64748b', fontSize: 12, marginBottom: 16 }}>
              Complete audit trail of all gold transactions — mine-to-market traceability per CommStack EITI framework
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #2d3748' }}>
                    {['Ref', 'Date', 'Actor', 'Action', 'Site', 'Volume', 'Value', 'Destination', 'Royalty', 'Tax', 'Status'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: '#64748b', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {auditTrail.map((entry, i) => {
                    const statusColor = auditStatusColor(entry.status);
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                        <td style={{ padding: '10px 10px', color: '#64748b', fontSize: 11, fontFamily: 'monospace' }}>{entry.id}</td>
                        <td style={{ padding: '10px 10px', color: '#94a3b8', fontSize: 11, whiteSpace: 'nowrap' }}>
                          {new Date(entry.date).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td style={{ padding: '10px 10px', color: '#f1f5f9', fontSize: 12 }}>{entry.actor}</td>
                        <td style={{ padding: '10px 10px', color: '#94a3b8', fontSize: 12 }}>{entry.action}</td>
                        <td style={{ padding: '10px 10px', color: '#3b82f6', fontSize: 11, fontFamily: 'monospace' }}>{entry.siteId}</td>
                        <td style={{ padding: '10px 10px', color: '#f59e0b', fontSize: 12, whiteSpace: 'nowrap' }}>{entry.quantityOz.toLocaleString()} oz</td>
                        <td style={{ padding: '10px 10px', color: '#10b981', fontSize: 12, whiteSpace: 'nowrap', fontWeight: 600 }}>
                          ${(entry.valueUSD / 1000).toFixed(0)}K
                        </td>
                        <td style={{ padding: '10px 10px', color: '#94a3b8', fontSize: 12 }}>{entry.destination}</td>
                        <td style={{ padding: '10px 10px', color: entry.royaltyPaid > 0 ? '#3b82f6' : '#ef4444', fontSize: 11 }}>
                          {entry.royaltyPaid > 0 ? `$${(entry.royaltyPaid / 1000).toFixed(0)}K` : 'PENDING'}
                        </td>
                        <td style={{ padding: '10px 10px', color: entry.taxPaid > 0 ? '#8b5cf6' : '#ef4444', fontSize: 11 }}>
                          {entry.taxPaid > 0 ? `$${(entry.taxPaid / 1000).toFixed(0)}K` : 'PENDING'}
                        </td>
                        <td style={{ padding: '10px 10px' }}>
                          <span style={{
                            background: `${statusColor}22`, color: statusColor,
                            border: `1px solid ${statusColor}44`, padding: '2px 8px',
                            borderRadius: 4, fontSize: 11, fontWeight: 600, textTransform: 'uppercase'
                          }}>{entry.status.replace('_', ' ')}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{
            background: '#1e2433', border: '1px solid #3b82f622',
            borderRadius: 12, padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start'
          }}>
            <span style={{ fontSize: 20 }}>ℹ️</span>
            <div>
              <div style={{ color: '#3b82f6', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                EITI Mine-to-Market Audit Framework
              </div>
              <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>
                Every gold transaction is recorded with a full audit trail covering extraction at source, processing,
                export certification, royalty payment, and tax compliance. This implementation aligns with the
                CommStack EITI compliance framework and Mozambique's obligations under the 2019 EITI Standard.
                All financial discrepancies trigger automatic alerts to the Anti-Corruption Commission (ACC).
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
