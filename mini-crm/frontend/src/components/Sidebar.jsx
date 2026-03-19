import { LayoutDashboard, Users, LogOut, Command, Sun, Moon } from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme === 'dark';

  const handleLogout = () => { logout(); navigate('/login'); };

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { title: 'Leads', icon: Users, path: '/leads' },
  ];

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  /* ── Inline style objects (immune to Tailwind dark: prefix bugs) ── */
  const sidebarStyle = isDark
    ? { background: '#13151f', borderRight: '1px solid rgba(255,255,255,0.06)' }
    : { background: '#fff', borderRight: '1px solid #f1f5f9' };

  const cardStyle = isDark
    ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20 }
    : { background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 20 };

  const signOutStyle = isDark
    ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#8b90a7', borderRadius: 12 }
    : { background: '#fff', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: 12 };

  const toggleStyle = isDark
    ? { background: 'rgba(255,255,255,0.08)', color: '#a0a8c7', borderRadius: 12 }
    : { background: '#f1f5f9', color: '#64748b', borderRadius: 12 };

  return (
    <div
      className="flex h-screen w-72 flex-col relative z-20 flex-shrink-0"
      style={sidebarStyle}
    >
      {/* Logo Row */}
      <div className="flex items-center justify-between px-6 pt-7 pb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-lg opacity-40 rounded-xl" />
            <div className="relative p-2.5 rounded-xl" style={{ background: 'linear-gradient(135deg,#6c8aff,#4f6ef7)' }}>
              <Command className="w-5 h-5 text-white" />
            </div>
          </div>
          <span
            className="text-xl font-black font-display tracking-tight"
            style={isDark ? { color: '#f0f2ff' } : { color: '#0f172a' }}
          >
            MiniCRM
          </span>
        </div>
        <motion.button
          whileTap={{ scale: 0.88, rotate: 12 }}
          whileHover={{ scale: 1.08 }}
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center transition-colors duration-200"
          style={toggleStyle}
        >
          <motion.div
            key={theme}
            initial={{ opacity: 0, rotate: -20 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </motion.div>
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 mt-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink key={item.path} to={item.path}>
              {() => (
                <motion.div
                  whileHover={{ x: 2 }}
                  className="relative flex items-center gap-3.5 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-200"
                  style={
                    isActive
                      ? isDark
                        ? {
                            background: 'rgba(108,138,255,0.12)',
                            border: '1px solid rgba(108,138,255,0.25)',
                          }
                        : {
                            background: '#eff4ff',
                            border: '1px solid rgba(108,138,255,0.2)',
                          }
                      : {
                          background: 'transparent',
                          border: '1px solid transparent',
                        }
                  }
                >
                  {/* Active left bar */}
                  {isActive && (
                    <motion.div
                      layoutId="active-bar"
                      className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full"
                      style={{ background: 'var(--accent-blue,#6c8aff)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <item.icon
                    className="w-5 h-5 flex-shrink-0"
                    style={
                      isActive
                        ? { color: '#6c8aff' }
                        : isDark
                        ? { color: '#5a5f7a' }
                        : { color: '#94a3b8' }
                    }
                  />
                  <span
                    className="text-sm font-semibold"
                    style={
                      isActive
                        ? isDark
                          ? { color: '#c5caff' }
                          : { color: '#4f46e5' }
                        : isDark
                        ? { color: '#8b90a7' }
                        : { color: '#64748b' }
                    }
                  >
                    {item.title}
                  </span>
                </motion.div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile Card */}
      <div className="px-4 pb-6 mt-auto">
        <div className="p-4 transition-all duration-200" style={cardStyle}>
          <div className="flex items-center gap-3 mb-4">
            {/* Gradient Avatar */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow"
              style={{ background: 'linear-gradient(135deg,#6c8aff,#a78bfa)' }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-bold leading-tight truncate"
                style={isDark ? { color: '#f0f2ff' } : { color: '#0f172a' }}
              >
                {user?.name}
              </p>
              <p
                className="text-xs font-medium truncate mt-0.5"
                style={isDark ? { color: '#5a5f7a' } : { color: '#94a3b8' }}
              >
                {user?.email}
              </p>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold transition-all duration-200"
            style={signOutStyle}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#f87171';
              e.currentTarget.style.borderColor = 'rgba(248,113,113,0.3)';
              e.currentTarget.style.background = isDark ? 'rgba(248,113,113,0.08)' : '#fff5f5';
            }}
            onMouseLeave={e => {
              Object.assign(e.currentTarget.style, signOutStyle);
            }}
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
