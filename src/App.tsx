import React, { useState } from 'react';
import Sidebar, { Page } from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import MapView from './components/MapView/MapView';
import Registry from './components/Registry/Registry';
import Statistics from './components/Statistics/Statistics';
import Compliance from './components/Compliance/Compliance';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'map': return <MapView />;
      case 'registry': return <Registry />;
      case 'statistics': return <Statistics />;
      case 'compliance': return <Compliance />;
      default: return <Dashboard />;
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      background: '#0f1117',
      color: '#e2e8f0',
      overflow: 'hidden'
    }}>
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main style={{
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0
      }}>
        {/* Top Bar */}
        <div style={{
          height: 52,
          borderBottom: '1px solid #1e293b',
          display: 'flex', alignItems: 'center',
          padding: '0 20px',
          gap: 16,
          background: '#0f1117',
          flexShrink: 0
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            <span style={{ fontSize: 18 }}>🇲🇿</span>
            <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>
              Republic of Mozambique
            </span>
            <span style={{ color: '#334155', fontSize: 13 }}>/</span>
            <span style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 600 }}>
              {activePage === 'dashboard' ? 'Government Dashboard' :
               activePage === 'map' ? 'Mining Operations Map' :
               activePage === 'registry' ? 'Licensing Registry' :
               activePage === 'statistics' ? 'Statistics & Analytics' :
               'Compliance & Regulatory'}
            </span>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* System status indicators */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: 11, color: '#475569' }}>Systems Normal</span>
            </div>
            <div style={{ width: 1, height: 16, background: '#1e293b' }} />
            <div style={{ fontSize: 11, color: '#475569' }}>
              MIREME • INAMI • DNGRM
            </div>
            <div style={{ width: 1, height: 16, background: '#1e293b' }} />
            <div style={{
              background: '#f59e0b22', border: '1px solid #f59e0b44',
              color: '#f59e0b', padding: '3px 10px', borderRadius: 6,
              fontSize: 11, fontWeight: 600
            }}>
              RESTRICTED — GOVERNMENT USE
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {renderPage()}
        </div>
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0f1117; }
        ::-webkit-scrollbar-thumb { background: #2d3748; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #3d4f68; }
        button:hover { opacity: 0.9; }
        select, input { outline: none; }
        input::placeholder { color: #475569; }
      `}</style>
    </div>
  );
};

export default App;
