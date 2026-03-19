import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';

const Layout = () => {
  const { isAuthenticated, loading } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const pageStyle = isDark
    ? { background: '#0f1117', color: '#f0f2ff' }
    : { background: '#f8fafc', color: '#0f172a' };

  if (loading) {
    return (
      <div
        className="flex h-screen w-full items-center justify-center"
        style={pageStyle}
      >
        <div
          className="w-12 h-12 rounded-full animate-spin"
          style={{
            border: '3px solid rgba(108,138,255,0.15)',
            borderTop: '3px solid #6c8aff',
          }}
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden" style={pageStyle}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto" style={isDark ? { background: '#0f1117' } : { background: '#f8fafc' }}>
        <div className="p-6 md:p-8 max-w-screen-xl mx-auto">
          <Outlet />
        </div>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: isDark ? '#1a1d2e' : '#fff',
            color: isDark ? '#f0f2ff' : '#0f172a',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 500,
          },
        }}
      />
    </div>
  );
};

export default Layout;
