import React from 'react';
import { useWindowSize } from '../../hooks/useWindowSize';

export type Page = 'dashboard' | 'map' | 'registry' | 'statistics' | 'compliance' | 'sources';

interface NavItem {
  id: Page;
  label: string;
  icon: string;
  description: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', description: 'Government overview' },
  { id: 'map', label: 'Mining Map', icon: '🗺️', description: 'Sites & hotspots' },
  { id: 'registry', label: 'Registry', icon: '📋', description: 'Licensed actors & sites' },
  { id: 'statistics', label: 'Analytics', icon: '📈', description: 'Production & exports' },
  { id: 'compliance', label: 'Compliance', icon: '✅', description: 'EITI, KYC, KYB' },
  { id: 'sources', label: 'Sources', icon: '🔗', description: '21 referenced datasets' }
];

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, collapsed, onToggle }) => {
  const { isMobile } = useWindowSize();

  if (isMobile) {
    return (
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: '#0f1117', borderTop: '1px solid #1e293b',
        display: 'flex', height: 60
      }}>
        {navItems.map(item => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 2,
                border: 'none', cursor: 'pointer', background: 'transparent',
                borderTop: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                paddingTop: 2
              }}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ fontSize: 9, color: isActive ? '#3b82f6' : '#475569', fontWeight: isActive ? 700 : 500 }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <div style={{
      width: collapsed ? 64 : 220,
      background: '#0f1117',
      borderRight: '1px solid #1e293b',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.25s ease',
      overflow: 'hidden',
      flexShrink: 0,
      zIndex: 100
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 16px' : '20px 18px',
        borderBottom: '1px solid #1e293b',
        display: 'flex', alignItems: 'center', gap: 10,
        minHeight: 72
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 800, color: '#0f1117'
        }}>M</div>
        {!collapsed && (
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#f1f5f9', letterSpacing: 0.5 }}>
              MINATRACK
            </div>
            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 500 }}>
              MOZAMBIQUE GOLD
            </div>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
        {navItems.map(item => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: 10, padding: collapsed ? '10px 12px' : '10px 12px',
                borderRadius: 10, border: 'none', cursor: 'pointer',
                marginBottom: 2, textAlign: 'left',
                background: isActive
                  ? 'linear-gradient(90deg, #3b82f622 0%, #3b82f611 100%)'
                  : 'transparent',
                borderLeft: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                transition: 'all 0.15s'
              } as React.CSSProperties}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && (
                <div>
                  <div style={{
                    fontSize: 13, fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#f1f5f9' : '#94a3b8'
                  }}>{item.label}</div>
                  <div style={{ fontSize: 10, color: '#475569' }}>{item.description}</div>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid #1e293b' }}>
        {!collapsed && (
          <div style={{ padding: '8px 12px', marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>EITI Mine-to-Market Framework</div>
            <div style={{ fontSize: 10, color: '#334155', marginTop: 2 }}>Republic of Mozambique</div>
          </div>
        )}
        <button
          onClick={onToggle}
          style={{
            width: '100%', padding: '8px 12px', borderRadius: 8,
            background: '#1e2433', border: '1px solid #2d3748',
            color: '#64748b', cursor: 'pointer', fontSize: 13,
            display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center'
          }}
        >
          <span>{collapsed ? '→' : '←'}</span>
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
