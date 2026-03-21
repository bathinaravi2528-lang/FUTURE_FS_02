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

        // Seed some initial leads if table is empty
        db.get(`SELECT COUNT(*) as count FROM leads`, (err, row) => {
            if (row && row.count === 0) {
                const dummyLeads = [
                    ['John Doe', 'john@example.com', '1234567890', 'Website', 'new', 'Initially signed up'],
                    ['Jane Smith', 'jane@linkedin.com', '9876543210', 'LinkedIn', 'contacted', 'Interested in the product'],
                    ['Robert Brown', 'robert@direct.com', '5551234567', 'Direct', 'converted', 'Already signed contract'],
                    ['Lisa White', 'lisa@ref.com', '4449876543', 'Referral', 'new', 'Referred by Alex'],
                    ['Michael Green', 'michael@ads.com', '2223334444', 'Ads', 'contacted', 'Clicked on Facebook ad'],
                    ['Sarah Black', 'sarah@link.com', '1112223333', 'LinkedIn', 'new', 'Found us on LinkedIn search'],
                    ['Kevin Blue', 'kevin@web.com', '9998887777', 'Website', 'converted', 'High value lead'],
                    ['Amy Yellow', 'amy@ref.com', '7776665555', 'Referral', 'contacted', 'Second follow-up'],
                    ['Tom Grey', 'tom@direct.com', '3334445555', 'Direct', 'new', 'Walk-in lead'],
                    ['Emily Red', 'emily@link.com', '6665554444', 'LinkedIn', 'converted', 'Success story']
                ];
                dummyLeads.forEach(l => {
                    db.run(`INSERT INTO leads (name, email, phone, source, status, notes) VALUES (?, ?, ?, ?, ?, ?)`, l);
                });
                console.log('Seeded 10 dummy leads.');
            }
        });
    });
}

module.exports = db;
