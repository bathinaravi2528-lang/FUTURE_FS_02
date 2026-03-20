-- SQL Schema for Mini CRM system (SQLite Compatible)

-- Users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    source VARCHAR(255),
    status VARCHAR(20) DEFAULT 'new', -- SQLite doesn't have ENUM, using VARCHAR
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER NOT NULL,
    note TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

-- Insert a default user for login (admin@example.com / password123)
-- Using a hashed password for bcrypt: '$2b$10$7vNfQ8/N8YV6q6B.Yqf2k.h.q2.u6.2.2.2.2' is placeholder
-- But our seeder will generate the correct one.
INSERT OR IGNORE INTO users (name, email, password) VALUES 
('System Admin', 'admin@example.com', '$2b$10$7vNfQ8/N8YV6q6B.Yqf2k.h.q2.u6.2.2.2.2');
