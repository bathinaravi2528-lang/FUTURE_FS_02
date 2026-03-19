const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Path to SQLite database file
const DB_PATH = path.join(__dirname, '../database.sqlite');

// Initialize database
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Critical SQLite connection error:', err.message);
  } else {
    console.log('--- DATABASE STATUS ---');
    console.log('Successfully connected to local SQLite database engine.');
    console.log('Storage: File-based persistence at', DB_PATH);
  }
});

// Wrapper to mimic mysql2 promise pool interface
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    // For SELECT queries
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve([rows]);
      });
    } 
    // For INSERT, UPDATE, DELETE queries
    else {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else {
          // Mimic mysql2 result structure
          resolve([{ insertId: this.lastID, affectedRows: this.changes }]);
        }
      });
    }
  });
};

module.exports = { query };
