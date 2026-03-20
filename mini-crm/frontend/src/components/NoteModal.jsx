import { useState, useEffect } from 'react';
import { X, Send, Clock, User, PlusCircle, MessageSquare } from 'lucide-react';
import { getLeadNotes, addNote } from '../api/noteService';
import toast from 'react-hot-toast';

const NoteModal = ({ isOpen, onClose, lead }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lead && isOpen) {
      fetchNotes();
    }
  }, [lead, isOpen]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const data = await getLeadNotes(lead.id);
      setNotes(data);
    } catch (error) {
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      await addNote(lead.id, newNote);
      setNewNote('');
      fetchNotes();
      toast.success('Note added');
    } catch (error) {
       toast.error('Failed to add note');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-2xl h-[600px] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 border-t rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-600 rounded-2xl shadow-lg shadow-primary-200">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Notes for {lead?.name}</h2>
              <p className="text-sm text-slate-500 mt-1">Timeline of interactions</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {loading ? (
             <div className="flex justify-center p-12">
               <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
             </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <PlusCircle className="w-12 h-12 mx-auto mb-4 text-slate-200" />
              <p className="text-lg font-medium">No notes yet</p>
              <p className="text-sm">Be the first to add a note to this lead.</p>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm first:border-primary-100">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold shadow-inner">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 text-sm leading-relaxed">{note.note}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(note.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-8 border-t border-slate-100 bg-white rounded-b-3xl">
          <form onSubmit={handleAddNote} className="flex gap-3">
            <input
              type="text"
              className="input flex-1 h-12 text-sm shadow-sm"
              placeholder="Write a note about this lead..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <button type="submit" className="btn btn-primary px-6 h-12 shadow-lg shadow-primary-200 flex items-center gap-2 transition-transform active:scale-95">
              <Send className="w-4 h-4" />
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
