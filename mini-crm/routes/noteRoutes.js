const express = require('express');
const router = express.Router();
const { getLeadNotes, addNote } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

const { validateNote } = require('../middleware/validationMiddleware');

// Protect all routes
router.use(protect);

// @route   GET /api/notes/:leadId
// @access  Private
// @route   POST /api/notes/:leadId
// @access  Private
router.route('/:leadId').get(getLeadNotes).post(validateNote, addNote);

module.exports = router;
