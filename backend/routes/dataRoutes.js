const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const bookingController = require('../controllers/dataController');

// Add a new booking
router.post('/add', authMiddleware, bookingController.addBooking);

// Get all bookings
router.get('/', authMiddleware, bookingController.getAllBookings);

// Get a single booking by ID
router.get('/:id', authMiddleware, bookingController.getBookingById);

// Update a booking
router.put('/:id', authMiddleware, bookingController.updateBooking);

// Delete a booking
router.delete('/:id', authMiddleware, bookingController.deleteBooking);

module.exports = router;