const Note = require('../models/noteModel');

// @desc    Get notes for a lead
// @route   GET /api/notes/:leadId
// @access  Private
const getLeadNotes = async (req, res) => {
  try {
    const notes = await Note.getByLeadId(req.params.leadId);
    res.json(notes);
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
};

// @desc    Add a note for a lead
// @route   POST /api/notes/:leadId
// @access  Private
const addNote = async (req, res) => {
  const { note } = req.body;

  if (!note) {
    res.status(400);
    return res.json({ message: 'Note content is required' });
  }

  try {
    const noteId = await Note.create(req.params.leadId, note);
    res.status(201).json({ id: noteId, lead_id: req.params.leadId, note });
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
};

module.exports = {
  getLeadNotes,
  addNote,
};
