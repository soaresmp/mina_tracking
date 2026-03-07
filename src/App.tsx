import React, { useState } from 'react';
import Sidebar, { Page } from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import MapView from './components/MapView/MapView';
import Registry from './components/Registry/Registry';
import Statistics from './components/Statistics/Statistics';
import Compliance from './components/Compliance/Compliance';
import DataSources from './components/DataSources/DataSources';
import { useWindowSize } from './hooks/useWindowSize';

const pageTitle = (page: Page) => {
  switch (page) {
    case 'dashboard': return 'Dashboard';
    case 'map': return 'Mining Map';
    case 'registry': return 'Registry';
    case 'statistics': return 'Analytics';
    case 'compliance': return 'Compliance';
    case 'sources': return 'Data Sources';
  }
};

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isMobile } = useWindowSize();

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'map': return <MapView />;
      case 'registry': return <Registry />;
      case 'statistics': return <Statistics />;
      case 'compliance': return <Compliance />;
      case 'sources': return <DataSources />;
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
      {!isMobile && (
        <Sidebar
          activePage={activePage}
          onNavigate={setActivePage}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      )}
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
          padding: isMobile ? '0 12px' : '0 20px',
          gap: 12,
          background: '#0f1117',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <span style={{ fontSize: 18 }}>🇲🇿</span>
            {!isMobile && (
              <>
                <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>
                  Republic of Mozambique
                </span>
                <span style={{ color: '#334155', fontSize: 13 }}>/</span>
              </>
            )}
            <span style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 600 }}>
              {pageTitle(activePage)}
            </span>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: 11, color: '#475569' }}>
                {isMobile ? 'Live' : 'Systems Normal'}
              </span>
            </div>
            {!isMobile && (
              <>
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
              </>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, overflow: 'hidden', paddingBottom: isMobile ? 60 : 0 }}>
          {renderPage()}
        </div>
      </main>

      {isMobile && (
        <Sidebar
          activePage={activePage}
          onNavigate={setActivePage}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      )}

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
