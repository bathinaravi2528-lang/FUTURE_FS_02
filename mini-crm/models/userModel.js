const db = require('../config/db');

const User = {
  // Find user by email (for login)
  findByEmail: async (email) => {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Create new user (optional, but good to have)
  create: async (userData) => {
    try {
      const { name, email, password } = userData;
      const [result] = await db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },

  // Find user by ID (for auth middleware)
  findById: async (id) => {
    try {
      const [rows] = await db.query('SELECT id, name, email, created_at FROM users WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },
};

module.exports = User;
