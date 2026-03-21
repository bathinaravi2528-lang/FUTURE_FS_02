const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'crm.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        createTables();
    }
});

function createTables() {
    db.serialize(() => {
        // Leads table
        db.run(`CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            source TEXT,
            status TEXT DEFAULT 'new',
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Admin users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            phone TEXT,
            source TEXT
        )`, (err) => {
            if (!err) {
                // Create a default admin if none exists
                const defaultAdmin = 'admin';
                const defaultEmail = 'admin@example.com';
                const defaultPass = 'admin123';
                const defaultSource = 'System';
                const hash = bcrypt.hashSync(defaultPass, 10);
                db.run(`INSERT OR IGNORE INTO users (username, email, password, source) VALUES (?, ?, ?, ?)`, 
                    [defaultAdmin, defaultEmail, hash, defaultSource]);
            }
        });


    });
}

module.exports = db;
