const express = require('express');
const { loginUser, getProtectedData } = require('../controllers/authController.js');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Login Route
router.post('/login', loginUser);

// Protected Route
router.get('/welcome', authMiddleware, getProtectedData);

module.exports = router;
