const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');

// Public route for available slots
router.get('/', slotController.getAvailableSlots);

module.exports = router;
