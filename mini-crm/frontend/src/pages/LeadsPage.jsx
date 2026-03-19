import { useState, useEffect } from 'react';
import { Search, Plus, Filter, Edit, Trash2, MessageSquare, Mail, Briefcase, Calendar, ChevronRight, MousePointer2, Users } from 'lucide-react';
import { getLeads, createLead, updateLead, deleteLead } from '../api/leadService';
import StatusBadge from '../components/StatusBadge';
import LeadModal from '../components/LeadModal';
import NoteModal from '../components/NoteModal';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const LeadsPage = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isAdmin = user?.email === 'admin@example.com';

  /* ── Design tokens ── */
  const TITLE = isDark ? '#f0f2ff' : '#0f172a';
  const BODY  = isDark ? '#8b90a7' : '#64748b';
  const CARD_BG     = isDark ? '#1a1d2e' : '#fff';
  const CARD_BORDER = isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9';
  const INPUT_BG    = isDark ? 'rgba(255,255,255,0.05)' : '#fff';
  const INPUT_BORD  = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const INPUT_TEXT  = isDark ? '#f0f2ff' : '#0f172a';
  const TH_CLR      = isDark ? '#5a5f7a' : '#94a3b8';
  const TR_HOVER    = isDark ? 'rgba(255,255,255,0.025)' : '#f8fafc';
  const ROW_DIV     = isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc';
  
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modals state
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    const filtered = leads.filter(lead => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(search.toLowerCase()) || 
        (lead.email && lead.email.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    setFilteredLeads(filtered);
  }, [search, statusFilter, leads]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await getLeads();
      setLeads(data);
      setFilteredLeads(data);
    } catch (error) {
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLead = async (formData) => {
    try {
      if (selectedLead) {
        await updateLead(selectedLead.id, formData);
        toast.success('Lead details updated');
      } else {
        await createLead(formData);
        toast.success('New lead added to pipeline');
      }
      setIsLeadModalOpen(false);
      setSelectedLead(null);
      fetchLeads();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDeleteLead = async (id) => {
    if (window.confirm('Permanent Action: Are you sure you want to delete this lead?')) {
      try {
        await deleteLead(id);
        toast.success('Lead permanently removed');
        fetchLeads();
      } catch (error) {
        toast.error('Failed to delete lead');
      }
    }
  };

  const openEditModal = (lead) => {
    setSelectedLead(lead);
    setIsLeadModalOpen(true);
  };

  const openNoteModal = (lead) => {
    setSelectedLead(lead);
    setIsNoteModalOpen(true);
  };

  if (loading && leads.length === 0) {
    return (
       <div className="flex h-96 w-full items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="rounded-full h-16 w-16 bg-primary-100 border-4 border-primary-500 shadow-xl"
        ></motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-[1400px] mx-auto space-y-12 pb-20"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-black font-display tracking-tight" style={{ color: TITLE }}>Manage Leads</h1>
          <p className="text-sm font-medium" style={{ color: BODY }}>Track and nurture your business prospects.</p>
        </div>
        {isAdmin && (
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setSelectedLead(null); setIsLeadModalOpen(true); }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-white font-bold text-sm shadow-lg"
            style={{ background: 'linear-gradient(135deg,#6c8aff,#4f6ef7)', boxShadow: '0 4px 16px rgba(108,138,255,0.35)' }}
          >
            <Plus className="w-5 h-5" />
            Add New Lead
          </motion.button>
        )}
      </header>

      {/* ── Search & Filter ── */}
      <div
        className="rounded-2xl p-4 flex flex-col xl:flex-row gap-4"
        style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: TH_CLR }} />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-200"
            style={{ background: INPUT_BG, border: `1px solid ${INPUT_BORD}`, color: INPUT_TEXT }}
          />
        </div>
        <div className="relative w-full xl:w-56">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: TH_CLR }} />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm font-semibold appearance-none cursor-pointer outline-none transition-all duration-200"
            style={{ background: INPUT_BG, border: `1px solid ${INPUT_BORD}`, color: INPUT_TEXT }}
          >
            <option value="all">All Stages</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
          </select>
        </div>
      </div>

      {/* ── Table ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr style={{ borderBottom: `1px solid ${ROW_DIV}` }}>
                {['Identity','Channel','Stage','Acquired','Actions'].map((h, i) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.16em]"
                    style={{ color: TH_CLR, textAlign: i === 3 ? 'center' : i === 4 ? 'right' : 'left' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredLeads.map((lead, idx) => (
                  <motion.tr 
                    key={lead.id} 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.04 }}
                    style={{ borderBottom: `1px solid ${ROW_DIV}` }}
                    className="group/row transition-colors duration-150"
                    onMouseEnter={e => e.currentTarget.style.background = TR_HOVER}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Identity */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="relative flex-shrink-0">
                          <div
                            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-md"
                            style={{ background: 'linear-gradient(135deg,#6c8aff,#a78bfa)' }}
                          >
                            {lead.name?.[0]?.toUpperCase()}
                          </div>
                          <div
                            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                            style={{ background: '#34d399', border: `2px solid ${CARD_BG}` }}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold leading-none mb-0.5" style={{ color: isDark ? '#f0f2ff' : '#0f172a' }}>
                            {lead.name}
                          </p>
                          <p className="text-xs flex items-center gap-1" style={{ color: isDark ? '#5a5f7a' : '#94a3b8' }}>
                            <Mail className="w-3 h-3" />{lead.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Channel */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9' }}
                        >
                          <Briefcase className="w-3.5 h-3.5" style={{ color: isDark ? '#5a5f7a' : '#94a3b8' }} />
                        </div>
                        <span className="text-sm font-semibold" style={{ color: isDark ? '#a0a8c7' : '#475569' }}>
                          {lead.source || 'Inbound'}
                        </span>
                      </div>
                    </td>

                    {/* Stage */}
                    <td className="px-6 py-4">
                      <StatusBadge status={lead.status} />
                    </td>

                    {/* Acquired */}
                    <td className="px-6 py-4 text-center">
                      <p className="text-xs font-bold" style={{ color: isDark ? '#c5c9e0' : '#334155' }}>
                        {new Date(lead.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-[10px] flex items-center justify-center gap-0.5 mt-0.5" style={{ color: TH_CLR }}>
                        <Calendar className="w-2.5 h-2.5" /> Added
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover/row:opacity-100 translate-x-2 group-hover/row:translate-x-0 transition-all duration-200">
                        <motion.button
                          whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
                          onClick={() => openNoteModal(lead)}
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: TH_CLR }}
                          title="Notes"
                          onMouseEnter={e => { e.currentTarget.style.color='#6c8aff'; e.currentTarget.style.background=isDark?'rgba(108,138,255,0.1)':'#eff4ff'; }}
                          onMouseLeave={e => { e.currentTarget.style.color=TH_CLR; e.currentTarget.style.background='transparent'; }}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </motion.button>
                        {isAdmin && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
                              onClick={() => openEditModal(lead)}
                              className="p-2 rounded-lg transition-colors"
                              style={{ color: TH_CLR }}
                              title="Edit"
                              onMouseEnter={e => { e.currentTarget.style.color='#fbbf24'; e.currentTarget.style.background=isDark?'rgba(251,191,36,0.1)':'#fffbeb'; }}
                              onMouseLeave={e => { e.currentTarget.style.color=TH_CLR; e.currentTarget.style.background='transparent'; }}
                            >
                              <Edit className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-2 rounded-lg transition-colors"
                              style={{ color: TH_CLR }}
                              title="Delete"
                              onMouseEnter={e => { e.currentTarget.style.color='#f87171'; e.currentTarget.style.background=isDark?'rgba(248,113,113,0.1)':'#fff5f5'; }}
                              onMouseLeave={e => { e.currentTarget.style.color=TH_CLR; e.currentTarget.style.background='transparent'; }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredLeads.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-28 text-center"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc', border: `1px solid ${CARD_BORDER}` }}
              >
                <Users className="w-9 h-9" style={{ color: isDark ? '#3a3f5a' : '#cbd5e1' }} />
              </div>
              <h3 className="text-xl font-black" style={{ color: TITLE }}>No prospects found</h3>
              <p className="text-sm mt-2 max-w-xs mx-auto" style={{ color: BODY }}>Adjust your filters or add a new lead to populate the pipeline.</p>
              <motion.button
                whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                onClick={() => { setSearch(''); setStatusFilter('all'); }}
                className="mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#fff', border: `1px solid ${CARD_BORDER}`, color: BODY }}
              >
                Reset Filters
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between text-xs font-bold uppercase tracking-widest px-4"
        style={{ color: TH_CLR }}
      >
        <p>Total: {filteredLeads.length} leads</p>
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5">
            <MousePointer2 className="w-3 h-3" /> Hover row for actions
          </span>
          <span className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3" /> End of list
          </span>
        </div>
      </div>

      {/* Modals with enhanced behavior */}
      <AnimatePresence>
        {isLeadModalOpen && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <LeadModal 
                isOpen={isLeadModalOpen} 
                onClose={() => { setIsLeadModalOpen(false); setSelectedLead(null); }} 
                onSave={handleSaveLead}
                lead={selectedLead}
              />
           </motion.div>
        )}
        
        {isNoteModalOpen && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <NoteModal 
                isOpen={isNoteModalOpen} 
                onClose={() => { setIsNoteModalOpen(false); setSelectedLead(null); }} 
                lead={selectedLead}
              />
           </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LeadsPage;
