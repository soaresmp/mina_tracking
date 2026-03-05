import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { kpiData, monthlyStats, exportBreakdown, recentAlerts } from '../../data/statistics';
import { miningSites } from '../../data/miningSites';
import { actors } from '../../data/actors';

const KPICard: React.FC<{
  title: string;
  value: string;
  change?: string;
  changePositive?: boolean;
  subtitle?: string;
  icon: string;
  color: string;
}> = ({ title, value, change, changePositive, subtitle, icon, color }) => (
  <div style={{
    background: 'linear-gradient(135deg, #1e2433 0%, #252d3d 100%)',
    border: `1px solid ${color}33`,
    borderRadius: 12,
    padding: '20px 24px',
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div style={{
      position: 'absolute', top: -20, right: -20,
      fontSize: 80, opacity: 0.06, userSelect: 'none'
    }}>{icon}</div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{value}</div>
        {subtitle && <div style={{ fontSize: 12, color: '#94a3b8' }}>{subtitle}</div>}
      </div>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: `${color}22`, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: 22
      }}>{icon}</div>
    </div>
    {change && (
      <div style={{
        marginTop: 12,
        fontSize: 12,
        color: changePositive ? '#10b981' : '#ef4444',
        fontWeight: 600
      }}>
        {changePositive ? '↑' : '↓'} {change} vs last period
      </div>
    )}
  </div>
);

const AlertItem: React.FC<{ alert: typeof recentAlerts[0] }> = ({ alert }) => {
  const colors: Record<string, string> = {
    critical: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };
  const icons: Record<string, string> = {
    critical: '🚨',
    warning: '⚠️',
    info: 'ℹ️'
  };
  const time = new Date(alert.timestamp);
  const timeStr = time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const dateStr = time.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

  return (
    <div style={{
      display: 'flex', gap: 12, padding: '10px 0',
      borderBottom: '1px solid #1e293b',
      alignItems: 'flex-start'
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: `${colors[alert.type]}22`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, flexShrink: 0
      }}>{icons[alert.type]}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.4 }}>{alert.message}</div>
        <div style={{ fontSize: 11, color: '#475569', marginTop: 3 }}>{dateStr} • {timeStr}</div>
      </div>
      <div style={{
        fontSize: 11, color: colors[alert.type],
        background: `${colors[alert.type]}22`,
        padding: '2px 8px', borderRadius: 4, flexShrink: 0,
        fontWeight: 600, textTransform: 'uppercase'
      }}>{alert.type}</div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const activeSites = miningSites.filter(s => s.status === 'active').length;
  const suspendedSites = miningSites.filter(s => s.status === 'suspended').length;
  const totalWorkers = miningSites.reduce((sum, s) => sum + s.workers, 0);

  const siteStatusData = [
    { name: 'Active', value: activeSites, color: '#10b981' },
    { name: 'Suspended', value: suspendedSites, color: '#f59e0b' },
    { name: 'Under Review', value: miningSites.filter(s => s.status === 'under_review').length, color: '#3b82f6' },
    { name: 'Closed', value: miningSites.filter(s => s.status === 'closed').length, color: '#ef4444' }
  ];

  const goldPriceFormatted = kpiData.goldPriceUSDoz.toLocaleString('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 2
  });

  return (
    <div style={{ padding: '24px', overflowY: 'auto', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
            Government Operations Dashboard
          </h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
            Near Real-Time Overview — Republic of Mozambique Gold Sector
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#10b98122', border: '1px solid #10b98144',
            padding: '6px 14px', borderRadius: 8
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>LIVE</span>
          </div>
          <div style={{ fontSize: 13, color: '#475569', marginTop: 6 }}>
            {currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            {' '}CAT • {currentTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Gold Price Banner */}
      <div style={{
        background: 'linear-gradient(90deg, #92400e22 0%, #d9770622 50%, #92400e22 100%)',
        border: '1px solid #d9770633',
        borderRadius: 10, padding: '12px 20px',
        display: 'flex', alignItems: 'center', gap: 16,
        marginBottom: 24, flexWrap: 'wrap'
      }}>
        <span style={{ fontSize: 20 }}>🥇</span>
        <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: 16 }}>GOLD SPOT PRICE</span>
        <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 18 }}>{goldPriceFormatted}/oz</span>
        <span style={{ color: '#10b981', fontSize: 14 }}>▲ {kpiData.goldPriceChange24h}% (24h)</span>
        <span style={{ color: '#475569', fontSize: 12, marginLeft: 'auto' }}>
          XAU/USD • LBMA Reference Rate • Updated {currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* KPI Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16, marginBottom: 28
      }}>
        <KPICard
          title="YTD Production"
          value={`${kpiData.totalProductionYTDOz.toLocaleString()} oz`}
          change={`+${kpiData.totalProductionYTDChangePercent}%`}
          changePositive={true}
          subtitle="Gold extracted, all licensed sites"
          icon="⛏️"
          color="#f59e0b"
        />
        <KPICard
          title="Export Revenue YTD"
          value={`$${(kpiData.totalExportValueUSD / 1000000).toFixed(1)}M`}
          change={`+${kpiData.totalExportValueChangePercent}%`}
          changePositive={true}
          subtitle="Verified export transactions"
          icon="📦"
          color="#10b981"
        />
        <KPICard
          title="Royalties Collected"
          value={`$${(kpiData.totalRoyaltiesUSD / 1000000).toFixed(2)}M`}
          subtitle="FY2025 year-to-date"
          icon="🏛️"
          color="#3b82f6"
        />
        <KPICard
          title="Active Mining Sites"
          value={`${kpiData.activeSites} / ${miningSites.length}`}
          subtitle={`${suspendedSites} suspended`}
          icon="📍"
          color="#8b5cf6"
        />
        <KPICard
          title="Licensed Miners"
          value={kpiData.totalLicensedMiners.toLocaleString()}
          subtitle={`${totalWorkers} registered workers`}
          icon="👷"
          color="#f97316"
        />
        <KPICard
          title="Illicit Hotspots"
          value={`${kpiData.illicitHotspotsActive} Active`}
          subtitle="Requiring intervention"
          icon="🚨"
          color="#ef4444"
        />
        <KPICard
          title="Compliance Rate"
          value={`${kpiData.complianceRate}%`}
          subtitle="KYC/KYB/EITI combined"
          icon="✅"
          color="#10b981"
        />
        <KPICard
          title="Licensed Operators"
          value={`${actors.filter(a => a.type === 'operator').length}`}
          subtitle={`${actors.filter(a => a.kycStatus === 'flagged').length} flagged actors`}
          icon="🏢"
          color="#ec4899"
        />
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Production & Export Trend */}
        <div style={{
          background: '#1e2433', border: '1px solid #2d3748',
          borderRadius: 12, padding: 20
        }}>
          <h3 style={{ color: '#f1f5f9', marginBottom: 4, fontSize: 16 }}>Production & Export Trend</h3>
          <p style={{ color: '#64748b', fontSize: 12, marginBottom: 16 }}>Monthly gold production vs exports (oz) — Last 12 months</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyStats}>
              <defs>
                <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 8 }}
                labelStyle={{ color: '#94a3b8' }}
                formatter={(val: number) => [`${val.toLocaleString()} oz`, '']}
              />
              <Area type="monotone" dataKey="productionOz" stroke="#f59e0b" fill="url(#prodGrad)" strokeWidth={2} name="Production" />
              <Area type="monotone" dataKey="exportOz" stroke="#10b981" fill="url(#expGrad)" strokeWidth={2} name="Exports" />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Site Status Pie */}
        <div style={{
          background: '#1e2433', border: '1px solid #2d3748',
          borderRadius: 12, padding: 20
        }}>
          <h3 style={{ color: '#f1f5f9', marginBottom: 4, fontSize: 16 }}>Site Status</h3>
          <p style={{ color: '#64748b', fontSize: 12, marginBottom: 8 }}>All licensed concessions</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={siteStatusData} cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                dataKey="value" nameKey="name" paddingAngle={3}>
                {siteStatusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 8 }}
                formatter={(val: number, name: string) => [val, name]}
              />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Revenue & Royalties */}
        <div style={{
          background: '#1e2433', border: '1px solid #2d3748',
          borderRadius: 12, padding: 20
        }}>
          <h3 style={{ color: '#f1f5f9', marginBottom: 4, fontSize: 16 }}>Revenue & Government Take</h3>
          <p style={{ color: '#64748b', fontSize: 12, marginBottom: 16 }}>Monthly revenue, royalties & taxes (USD millions)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyStats.slice(-8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false}
                tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
              <Tooltip
                contentStyle={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 8 }}
                formatter={(val: number, name: string) => [`$${(val / 1000).toFixed(0)}K`, name]}
              />
              <Bar dataKey="royaltiesUSD" name="Royalties" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="taxesUSD" name="Taxes" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Export Destinations */}
        <div style={{
          background: '#1e2433', border: '1px solid #2d3748',
          borderRadius: 12, padding: 20
        }}>
          <h3 style={{ color: '#f1f5f9', marginBottom: 4, fontSize: 16 }}>Export Destinations (YTD)</h3>
          <p style={{ color: '#64748b', fontSize: 12, marginBottom: 12 }}>Gold export value by country — verified shipments</p>
          {exportBreakdown.map((item, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: '#cbd5e1' }}>
                  {item.flag} {item.destination}
                </span>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>
                  {item.quantityOz.toLocaleString()} oz • ${(item.valueUSD / 1000000).toFixed(1)}M
                </span>
              </div>
              <div style={{ height: 6, background: '#2d3748', borderRadius: 3 }}>
                <div style={{
                  height: '100%', borderRadius: 3,
                  background: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#64748b'][i],
                  width: `${item.percentage}%`
                }} />
              </div>
              <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{item.percentage}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts Panel */}
      <div style={{
        background: '#1e2433', border: '1px solid #2d3748',
        borderRadius: 12, padding: 20
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ color: '#f1f5f9', margin: 0, fontSize: 16 }}>Recent Alerts & Notifications</h3>
            <p style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>System alerts, compliance flags, and operational updates</p>
          </div>
          <div style={{
            background: '#ef444422', border: '1px solid #ef444444',
            color: '#ef4444', padding: '4px 12px', borderRadius: 6,
            fontSize: 12, fontWeight: 600
          }}>
            {recentAlerts.filter(a => a.type === 'critical').length} CRITICAL
          </div>
        </div>
        {recentAlerts.map(alert => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
