const express = require('express');
const { loginUser, signupUser, getProtectedData,getAllUsers, promoteUser, deleteUser } = require('../controllers/authController'); // Adjusted import
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Login Route
router.post('/login', loginUser);

// Signup Route
router.post('/signup', signupUser);

// Protected Route
router.get('/welcome', authMiddleware, getProtectedData);

// Get all users (admin only)
router.get('/users', authMiddleware, getAllUsers);

// Promote user to new role (admin only)
router.put('/promote', authMiddleware, promoteUser);

// Delete user (admin only)
router.delete('/delete', authMiddleware, deleteUser);

module.exports = router;
