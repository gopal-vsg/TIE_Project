const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const bookingController = require('../controllers/dataController');

router.post('/add', authMiddleware, bookingController.addBooking);

router.get('/', authMiddleware, bookingController.getAllBookings);

router.get('/:id', authMiddleware, bookingController.getBookingById);

router.put('/:id', authMiddleware, bookingController.updateBooking);

router.delete('/:id', authMiddleware, bookingController.deleteBooking);

module.exports = router;
