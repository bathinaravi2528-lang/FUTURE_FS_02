import { motion } from 'framer-motion';

const STATUS_CONFIG = {
  new: {
    label: 'New',
    dot:   '#6c8aff',
    color: '#8ba4ff',
    bg:    'rgba(108,138,255,0.1)',
    border:'rgba(108,138,255,0.3)',
  },
  contacted: {
    label: 'Contacted',
    dot:   '#fbbf24',
    color: '#fcd34d',
    bg:    'rgba(251,191,36,0.1)',
    border:'rgba(251,191,36,0.3)',
  },
  converted: {
    label: 'Converted',
    dot:   '#34d399',
    color: '#6ee7b7',
    bg:    'rgba(52,211,153,0.1)',
    border:'rgba(52,211,153,0.3)',
  },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.new;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold cursor-default select-none"
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.color,
      }}
    >
      {/* Pulsing dot */}
      <span className="relative flex items-center justify-center w-2 h-2">
        <span
          className="absolute inline-flex w-full h-full rounded-full animate-ping opacity-50"
          style={{ background: cfg.dot }}
        />
        <span
          className="relative w-2 h-2 rounded-full"
          style={{ background: cfg.dot }}
        />
      </span>
      {cfg.label}
    </motion.div>
  );
};

export default StatusBadge;
