import { useEffect, useState } from 'react';
import { Users, UserPlus, CheckCircle2, TrendingUp, Calendar, Zap, RefreshCcw } from 'lucide-react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, Legend, ResponsiveContainer
} from 'recharts';
import { getLeads } from '../api/leadService';
import StatCard from '../components/StatCard';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getLeads();
      setLeads(data);
    } catch {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusData = () => {
    const counts = { new: 0, contacted: 0, converted: 0 };
    leads.forEach(l => counts[l.status] = (counts[l.status] || 0) + 1);
    return [
      { name: 'New',       value: counts.new       || 0 },
      { name: 'Contacted', value: counts.contacted  || 0 },
      { name: 'Converted', value: counts.converted  || 0 },
    ];
  };

  const getLeadsByDate = () => {
    const dates = {};
    leads.forEach(l => {
      const d = new Date(l.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dates[d] = (dates[d] || 0) + 1;
    });
    return Object.keys(dates).map(d => ({ date: d, count: dates[d] })).slice(-7);
  };

  /* ── CHART COLORS (vibrant on both themes) ── */
  const PIE_COLORS  = ['#6c8aff', '#f59e0b', '#34d399'];
  const AXIS_COLOR  = isDark ? '#5a5f7a' : '#94a3b8';
  const GRID_COLOR  = isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9';
  const CARD_BG     = isDark ? '#1a1d2e' : '#fff';
  const CARD_BORDER = isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9';
  const TITLE_CLR   = isDark ? '#f0f2ff' : '#0f172a';
  const BODY_CLR    = isDark ? '#8b90a7' : '#64748b';
  const DATE_BG     = isDark ? 'rgba(108,138,255,0.1)' : '#eff4ff';
  const DATE_BORDER = isDark ? 'rgba(108,138,255,0.2)' : 'rgba(108,138,255,0.15)';

  const statCards = [
    {
      title: 'Overall Growth',
      value: leads.length,
      icon: Users,
      colorClass: 'bg-blue-500',
      accentColor: '#6c8aff',
      trend: 12,
    },
    {
      title: 'New',
      value: leads.filter(l => l.status === 'new').length,
      icon: UserPlus,
      colorClass: 'bg-violet-500',
      accentColor: '#a78bfa',
      trend: 8,
    },
    {
      title: 'Contacted',
      value: leads.filter(l => l.status === 'contacted').length,
      icon: TrendingUp,
      colorClass: 'bg-amber-500',
      accentColor: '#fbbf24',
      trend: 15,
    },
    {
      title: 'Converted',
      value: leads.filter(l => l.status === 'converted').length,
      icon: CheckCircle2,
      colorClass: 'bg-emerald-500',
      accentColor: '#34d399',
      trend: 24,
    },
  ];

  if (loading && leads.length === 0) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div
          className="w-14 h-14 rounded-full animate-spin"
          style={{
            border: '3px solid rgba(108,138,255,0.15)',
            borderTop: '3px solid #6c8aff',
          }}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 pb-20"
    >
      {/* ── Page Header ─────────────────────────────── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow"
              style={{ background: 'linear-gradient(135deg,#6c8aff,#4f6ef7)' }}
            >
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1
              className="text-3xl font-black font-display tracking-tight"
              style={{ color: TITLE_CLR }}
            >
              Power Insights
            </h1>
          </div>
          <p className="text-sm font-medium" style={{ color: BODY_CLR }}>
            Real-time performance overview of your active sales pipeline.
          </p>
        </div>

        {/* Date pill */}
        <div
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-default"
          style={{
            background: DATE_BG,
            border: `1px solid ${DATE_BORDER}`,
            color: isDark ? '#8b90a7' : '#4f46e5',
          }}
        >
          <Calendar className="w-4 h-4" style={{ color: '#6c8aff' }} />
          {new Date().toLocaleDateString('en-US', {
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
          })}
        </div>
      </header>

      {/* ── Stat Cards ──────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* ── Charts ──────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* Donut chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="xl:col-span-2 rounded-2xl p-6"
          style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
        >
          <h2 className="text-base font-black mb-1" style={{ color: TITLE_CLR }}>Funnel Status</h2>
          <p className="text-xs mb-5" style={{ color: BODY_CLR }}>
            Lead distribution across pipeline stages.
          </p>
          <div className="relative" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getStatusData()}
                  cx="50%"
                  cy="45%"
                  innerRadius={72}
                  outerRadius={115}
                  paddingAngle={5}
                  dataKey="value"
                  strokeWidth={0}
                  cornerRadius={10}
                >
                  {getStatusData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: 16, fontSize: 12, fontWeight: 600, color: BODY_CLR }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div
              className="absolute pointer-events-none text-center"
              style={{ top: '40%', left: '50%', transform: 'translate(-50%, -50%)' }}
            >
              <p className="text-3xl font-black" style={{ color: TITLE_CLR }}>{leads.length}</p>
              <p className="text-[10px] font-black uppercase tracking-widest mt-0.5" style={{ color: BODY_CLR }}>Total</p>
            </div>
          </div>
        </motion.div>

        {/* Bar chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.32 }}
          className="xl:col-span-3 rounded-2xl p-6"
          style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
        >
          <h2 className="text-base font-black mb-1" style={{ color: TITLE_CLR }}>Pipeline Velocity</h2>
          <p className="text-xs mb-5" style={{ color: BODY_CLR }}>
            Lead influx trend over the last 7 days.
          </p>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getLeadsByDate()} barCategoryGap="35%">
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#6c8aff" stopOpacity={1} />
                    <stop offset="100%" stopColor="#4f6ef7" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={GRID_COLOR}
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: AXIS_COLOR, fontSize: 11, fontWeight: 600 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: AXIS_COLOR, fontSize: 11, fontWeight: 600 }}
                  allowDecimals={false}
                />
                <ReTooltip
                  cursor={{ fill: isDark ? 'rgba(108,138,255,0.07)' : 'rgba(99,102,241,0.05)', radius: 8 }}
                />
                <Bar
                  dataKey="count"
                  fill="url(#barGrad)"
                  radius={[10, 10, 0, 0]}
                  barSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default DashboardPage;
