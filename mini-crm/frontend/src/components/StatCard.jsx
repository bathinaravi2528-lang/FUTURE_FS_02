import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const StatCard = ({ title, value, icon: Icon, colorClass, trend, accentColor }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const cardStyle = isDark
    ? {
        background: '#1a1d2e',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: 24,
        boxShadow: '0 4px 24px -4px rgba(0,0,0,0.5)',
      }
    : {
        background: '#fff',
        border: '1px solid #f1f5f9',
        borderRadius: 20,
        padding: 24,
        boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
      };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      style={cardStyle}
      className="group relative overflow-hidden cursor-default transition-all duration-300"
    >
      {/* Icon + Trend */}
      <div className="flex items-start justify-between mb-5">
        <div className={`relative p-3.5 rounded-2xl ${colorClass} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="w-6 h-6 text-white relative z-10" />
        </div>
        {trend && (
          <div
            className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-xl"
            style={{
              color: '#34d399',
              background: isDark ? 'rgba(52,211,153,0.12)' : '#f0fdf4',
              border: isDark ? '1px solid rgba(52,211,153,0.2)' : '1px solid #bbf7d0',
            }}
          >
            <TrendingUp className="w-3 h-3" />
            <span>+{trend}%</span>
          </div>
        )}
      </div>

      {/* Label */}
      <p
        className="text-[11px] font-black uppercase tracking-[0.16em] mb-2"
        style={isDark ? { color: '#5a5f7a' } : { color: '#94a3b8' }}
      >
        {title}
      </p>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        <p
          className="text-4xl font-black tracking-tight font-display"
          style={isDark ? { color: '#f0f2ff' } : { color: '#0f172a' }}
        >
          {value}
        </p>
        <ArrowUpRight
          className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity mb-1"
          style={{ color: '#6c8aff' }}
        />
      </div>

      {/* Decorative corner circle */}
      <div
        className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-[0.06] group-hover:opacity-[0.12] group-hover:scale-125 transition-all duration-700"
        style={{ background: accentColor || '#6c8aff' }}
      />
    </motion.div>
  );
};

export default StatCard;
