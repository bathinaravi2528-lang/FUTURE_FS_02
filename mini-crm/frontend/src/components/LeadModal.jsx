import { useState, useEffect } from 'react';
import { X, Save, User, Mail, MessageSquare, Briefcase } from 'lucide-react';

const LeadModal = ({ isOpen, onClose, onSave, lead = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    source: '',
    status: 'new',
  });

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        email: lead.email || '',
        source: lead.source || '',
        status: lead.status,
      });
    } else {
      setFormData({ name: '', email: '', source: '', status: 'new' });
    }
  }, [lead, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-4xl w-full max-w-lg p-10 shadow-3xl animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-white/5">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-display">
              {lead ? 'Modify Record' : 'New Prospect'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Pipeline intelligence management.</p>
          </div>
          <button onClick={onClose} className="p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Identity Name</label>
            <div className="relative">
              <User className="absolute left-4 top-4 h-5 w-5 text-slate-300" />
              <input
                type="text"
                required
                className="input pl-12 h-14"
                placeholder="Full operational name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Electronic Mail</label>
             <div className="relative">
              <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-300" />
              <input
                type="email"
                required
                className="input pl-12 h-14"
                placeholder="contact@enterprise.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Lead Source</label>
               <div className="relative">
                <Briefcase className="absolute left-4 top-4 h-5 w-5 text-slate-300" />
                <input
                  type="text"
                  className="input pl-12 h-14"
                  placeholder="Channel"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Stage Status</label>
              <div className="relative">
                 <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-slate-300 pointer-events-none" />
                <select
                  className="input pl-12 h-14 appearance-none bg-white dark:bg-slate-950/50 cursor-pointer"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button type="button" onClick={onClose} className="btn btn-outline flex-1 h-14">
              Abort
            </button>
            <button type="submit" className="btn btn-primary flex-1 h-14 shadow-2xl flex items-center justify-center gap-3">
              <Save className="w-5 h-5" />
              {lead ? 'Commit Changes' : 'Initialize Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
