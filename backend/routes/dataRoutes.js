const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const bookingController = require('../controllers/dataController');

// Add a new booking (allowed for 'user' and 'admin')
router.post('/add', authMiddleware(['user', 'admin']), bookingController.addBooking);

// Get all bookings (allowed for all authenticated roles)
router.get('/', authMiddleware(), bookingController.getAllBookings);

// Get a single booking by ID (allowed for all authenticated roles)
router.get('/:id', authMiddleware(), bookingController.getBookingById);

// Update a booking (allowed for 'user' and 'admin')
router.put('/:id', authMiddleware(['user', 'admin']), bookingController.updateBooking);

// Delete a booking (allowed for 'user' and 'admin')
router.delete('/:id', authMiddleware(['user', 'admin']), bookingController.deleteBooking);

// Get user by name
router.get('/user/:name', authMiddleware, bookingController.getUserByName);

module.exports = router;
