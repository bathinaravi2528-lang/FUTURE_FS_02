const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./database');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const secret = process.env.JWT_SECRET || 'secret';

const path = require('path');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'frontend'))); // Serve frontend files

// Root route to serve index.html explicitly if needed, though express.static usually handles it
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Middleware for auth
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        console.warn('Authentication failed: No token provided');
        return res.status(401).send('Access Denied');
    }
    jwt.verify(token, secret, (err, user) => {
        if (err) {
            console.warn('Authentication failed: Invalid token');
            return res.status(403).send('Invalid Token');
        }
        req.user = user;
        next();
    });
};

// --- AUTH ROUTES ---
app.post('/api/auth/register', (req, res) => {
    const { username, email, password, phone, source } = req.body;
    if (!username || !email || !password || !phone) return res.status(400).send('Missing fields');
    const hash = bcrypt.hashSync(password, 10);
    
    // 1. Create User (email is unique)
    db.run(`INSERT INTO users (username, email, password, phone, source) VALUES (?, ?, ?, ?, ?)`, 
        [username, email, hash, phone, source || 'Direct'], 
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed: users.email')) {
                    return res.status(409).send('Email already registered');
                }
                return res.status(500).send(err.message);
            }
            
            // 2. Also create a Lead for this user
            db.run(`INSERT INTO leads (name, email, phone, source, status, notes) VALUES (?, ?, ?, ?, ?, ?)`,
                [username, email, phone, source || 'Registration', 'new', 'Added automatically upon registration'],
                (leadErr) => {
                    if (leadErr) console.error('Error creating automatic lead:', leadErr.message);
                }
            );
            
            res.status(201).json({ id: this.lastID, message: 'User registered successfully' });
        }
    );
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err || !user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).send('Invalid Credentials');
        }
        const token = jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '1h' });
        res.json({ token, username: user.username });
    });
});

// --- LEAD ROUTES ---
// 1. Submit a lead (public)
app.post('/api/leads', (req, res) => {
    const { name, email, phone, source, notes } = req.body;
    db.run(`INSERT INTO leads (name, email, phone, source, notes) VALUES (?, ?, ?, ?, ?)`, 
        [name, email, phone, source, notes], 
        function (err) {
            if (err) return res.status(500).send(err.message);
            res.status(201).json({ id: this.lastID });
        }
    );
});

// --- LEAD ROUTES (Protected) ---
app.get('/api/leads', authenticate, (req, res) => {
    db.all('SELECT * FROM leads ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

app.put('/api/leads/:id', authenticate, (req, res) => {
    const { status, notes } = req.body;
    const { id } = req.params;
    db.run(`UPDATE leads SET status = ?, notes = ? WHERE id = ?`, [status, notes, id], function(err) {
        if (err) {
            console.error(`Update error for ID ${id}:`, err.message);
            return res.status(500).send(err.message);
        }
        res.send('Updated successfully');
    });
});

app.delete('/api/leads/:id', authenticate, (req, res) => {
    const { id } = req.params;
    console.log(`Backend: Received request to delete lead with ID: ${id}`);
    
    db.run(`DELETE FROM leads WHERE id = ?`, [id], function(err) {
        if (err) {
            console.error(`Delete error for ID ${id}:`, err.message);
            return res.status(500).send(err.message);
        }
        if (this.changes === 0) {
            console.warn(`Delete failed: No lead found with ID ${id}`);
            return res.status(404).send('Lead not found');
        }
        console.log(`Lead ${id} deleted successfully.`);
        res.send('Deleted successfully');
    });
});

// --- ANALYTICS ROUTE ---
app.get('/api/analytics', authenticate, (req, res) => {
    const statusQuery = `
        SELECT status, COUNT(*) as count 
        FROM leads 
        GROUP BY status
    `;
    const dailyQuery = `
        SELECT date(created_at) as date, COUNT(*) as count 
        FROM leads 
        GROUP BY date(created_at)
        ORDER BY date ASC
    `;
    
    db.all(statusQuery, [], (err, statusRows) => {
        if (err) return res.status(500).send(err.message);
        db.all(dailyQuery, [], (err, dailyRows) => {
            if (err) return res.status(500).send(err.message);
            res.json({ statusStats: statusRows, dailyStats: dailyRows });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
