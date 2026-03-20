const db = require('../config/db');

const Note = {
  // Get notes for a lead
  getByLeadId: async (leadId) => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM notes WHERE lead_id = ? ORDER BY created_at DESC',
        [leadId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Create lead note
  create: async (leadId, noteText) => {
    try {
      const [result] = await db.query(
        'INSERT INTO notes (lead_id, note) VALUES (?, ?)',
        [leadId, noteText]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },

};

module.exports = Note;
