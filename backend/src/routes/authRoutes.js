const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');

// Public routes
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

// Protected routes
router.get('/me', protect, authController.getMe);
router.put('/me', protect, authController.updateMe);
router.post('/send-otp', protect, authController.sendVerificationOTP);
router.post('/verify-otp', protect, authController.verifyVerificationOTP);

module.exports = router;
