const db = require('./config/db');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const seedData = async () => {
  try {
    console.log('--- Starting Database Initialization ---');

    // Run schema setup first
    console.log('Building tables from schema...');
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    
    // SQLite can execute multiple statements but our wrapper is simple
    // So we split by semicolon for safety if needed, or just run the whole thing
    // Actually, we'll just run them as separate queries for reliability
    const statements = schema.split(';').filter(s => s.trim() !== '');
    for (const statement of statements) {
       await db.query(statement + ';');
    }

    // Clean existing data
    console.log('Cleaning existing data...');
    await db.query('DELETE FROM notes');
    await db.query('DELETE FROM leads');
    await db.query('DELETE FROM users');
    
    // Reset sequences
    try {
      await db.query("DELETE FROM sqlite_sequence WHERE name IN ('users', 'leads', 'notes')");
    } catch (e) {
      // Sequence table might not exist if no rows were ever inserted
    }

    // Create Admin User
    console.log('Creating Admin account...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      ['System Admin', 'admin@example.com', hashedPassword]
    );

    // Create Initial Leads
    console.log('Creating sample leads...');
    const leads = [
      ['Alice Johnson', 'alice@example.com', 'Website', 'new'],
      ['Bob Miller', 'bob@example.com', 'Referral', 'contacted'],
      ['Charlie Davis', 'charlie@example.com', 'LinkedIn', 'converted'],
      ['Diana Prince', 'diana@example.com', 'Google Ads', 'new'],
      ['Ethan Hunt', 'ethan@example.com', 'Direct', 'contacted'],
      ['Fiona Gallagher', 'fiona@example.com', 'Conference', 'new'],
    ];

    for (const lead of leads) {
      const [result] = await db.query(
        'INSERT INTO leads (name, email, source, status) VALUES (?, ?, ?, ?)',
        lead
      );
      
      const leadId = result.insertId;
      console.log(`Lead Created: ${lead[0]} (ID: ${leadId})`);

      // Add dummy notes for first 3 leads
      if (leadId <= 3) {
         await db.query(
           'INSERT INTO notes (lead_id, note) VALUES (?, ?)',
           [leadId, `Sample note for ${lead[0]}`]
         );
      }
    }

    console.log('--- Initialization Success! Database is ready to use. ---');
    process.exit(0);
  } catch (error) {
    console.error('CRITICAL: Initialization failed:', error);
    process.exit(1);
  }
};

seedData();
