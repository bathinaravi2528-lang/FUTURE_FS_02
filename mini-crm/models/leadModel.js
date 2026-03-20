const db = require('../config/db');

const Lead = {
  // Get all leads
  getAll: async () => {
    try {
      const [rows] = await db.query('SELECT * FROM leads ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get lead by ID
  getById: async (id) => {
    try {
      const [rows] = await db.query('SELECT * FROM leads WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Create new lead
  create: async (leadData) => {
    try {
      const { name, email, source, status } = leadData;
      const [result] = await db.query(
        'INSERT INTO leads (name, email, source, status) VALUES (?, ?, ?, ?)',
        [name, email || null, source || null, status || 'new']
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },

  // Update lead
  update: async (id, leadData) => {
    try {
      const { name, email, source, status } = leadData;
      const [result] = await db.query(
        'UPDATE leads SET name = ?, email = ?, source = ?, status = ? WHERE id = ?',
        [name, email || null, source || null, status || 'new', id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  },

  // Delete lead (cascading notes is handled by the SQL schema)
  delete: async (id) => {
    try {
      const [result] = await db.query('DELETE FROM leads WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Lead;
