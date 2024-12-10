const express = require('express');
const { loginUser, signupUser, getProtectedData } = require('../controllers/authController'); // Adjusted import
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Login Route
router.post('/login', loginUser);

// Signup Route
router.post('/signup', signupUser);

// Protected Route
router.get('/welcome', authMiddleware, getProtectedData);

module.exports = router;
