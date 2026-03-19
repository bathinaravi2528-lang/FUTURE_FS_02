const express = require('express');
const router = express.Router();
const {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
} = require('../controllers/leadController');
const { protect, admin } = require('../middleware/authMiddleware');

const { validateLead } = require('../middleware/validationMiddleware');

// @route   GET /api/leads
// @access  Private (Any authenticated user)
router.route('/').get(protect, getLeads);

// @route   POST /api/leads
// @access  Private/Admin
router.route('/').post(protect, admin, validateLead, createLead);

// @route   PUT /api/leads/:id
// @access  Private/Admin
// @route   DELETE /api/leads/:id
// @access  Private/Admin
router.route('/:id').put(protect, admin, validateLead, updateLead).delete(protect, admin, deleteLead);

module.exports = router;
