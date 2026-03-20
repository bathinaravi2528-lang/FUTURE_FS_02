-- Seed SQL for Mini CRM system
USE mini_crm;

-- Clear existing data
DELETE FROM notes;
DELETE FROM leads;
DELETE FROM users;

-- Reset auto-increment
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE leads AUTO_INCREMENT = 1;
ALTER TABLE notes AUTO_INCREMENT = 1;

-- Insert a default user (password: admin123)
-- Hash generated via bcrypt
INSERT INTO users (name, email, password) 
VALUES ('System Admin', 'admin@example.com', '$2b$10$7vNfQ8/N8YV6q6B.Yqf2k.h.q2.u6.2.2.2.2');

-- Insert Sample Leads
INSERT INTO leads (name, email, source, status, created_at) VALUES 
('Alice Johnson', 'alice@example.com', 'Website', 'new', NOW() - INTERVAL 5 DAY),
('Bob Miller', 'bob@example.com', 'Referral', 'contacted', NOW() - INTERVAL 4 DAY),
('Charlie Davis', 'charlie@example.com', 'LinkedIn', 'converted', NOW() - INTERVAL 3 DAY),
('Diana Prince', 'diana@example.com', 'Google Ads', 'new', NOW() - INTERVAL 2 DAY),
('Ethan Hunt', 'ethan@example.com', 'Direct', 'contacted', NOW() - INTERVAL 1 DAY),
('Fiona Gallagher', 'fiona@example.com', 'Conference', 'new', NOW());

-- Insert Sample Notes for Alice
INSERT INTO notes (lead_id, note, created_at) VALUES 
(1, 'Initial inquiry from the website. Interested in enterprise plans.', NOW() - INTERVAL 4 DAY),
(1, 'Need to send our platform overview PDF.', NOW() - INTERVAL 3 DAY);

-- Insert Sample Notes for Bob
INSERT INTO notes (lead_id, note, created_at) VALUES 
(2, 'Reached out via phone. Scheduled follow-up for next Tuesday.', NOW() - INTERVAL 3 DAY),
(2, 'Sent initial proposal and deck.', NOW() - INTERVAL 2 DAY);

-- Insert Sample Notes for Charlie
INSERT INTO notes (lead_id, note, created_at) VALUES 
(3, 'Demo completed successfully. User is impressed with the dashboard visuals.', NOW() - INTERVAL 2 DAY),
(3, 'CONTRACT SIGNED! Onboarding starts next week.', NOW() - INTERVAL 1 DAY);
