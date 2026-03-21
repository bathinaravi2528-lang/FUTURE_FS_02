const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'backend/crm.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        return;
    }
    
    // Get all leads
    db.all("SELECT id FROM leads ORDER BY id ASC", [], (err, rows) => {
        if (err) throw err;
        
        let stmt = db.prepare("UPDATE leads SET created_at = datetime('now', ?) WHERE id = ?");
        
        // Spread the first 11 leads over the last 11 days
        rows.forEach((row, index) => {
            let daysAgo = rows.length - index; // if 11 leads, oldest is 11 days ago
            // Make the last one 0 days ago (today)
            let offset = `-${daysAgo} days`;
            stmt.run(offset, row.id);
        });
        
        stmt.finalize(() => {
            console.log("Updated dummy lead dates!");
        });
    });
});
