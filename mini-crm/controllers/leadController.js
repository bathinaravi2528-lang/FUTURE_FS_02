const Lead = require('../models/leadModel');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res) => {
  try {
    const leads = await Lead.getAll();
    res.json(leads);
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
};

// @desc    Create a lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res) => {
  const { name, email, source, status } = req.body;

  if (!name) {
    res.status(400);
    return res.json({ message: 'Lead name is required' });
  }

  try {
    const leadId = await Lead.create({ name, email, source, status });
    const newLead = await Lead.getById(leadId);
    res.status(201).json(newLead);
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
};

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res) => {
  const { name, email, source, status } = req.body;

  try {
    const updated = await Lead.update(req.params.id, {
      name,
      email,
      source,
      status,
    });

    if (updated) {
      const updatedLead = await Lead.getById(req.params.id);
      res.json(updatedLead);
    } else {
      res.status(404);
      res.json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res) => {
  try {
    const deleted = await Lead.delete(req.params.id);

    if (deleted) {
      res.json({ message: 'Lead removed' });
    } else {
      res.status(404);
      res.json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
};

module.exports = {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
};
