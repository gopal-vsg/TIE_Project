const express = require('express');
const multer = require('multer');
const authMiddleware = require('../middlewares/authMiddleware');
const { uploadChannelBookings } = require('../controllers/channelController');

const router = express.Router();

// Configure Multer to store uploaded files temporarily in the 'uploads/' folder
const upload = multer({ dest: 'uploads/' });

// Route to handle the file upload for channel bookings
router.post('/upload', authMiddleware, upload.single('file'), uploadChannelBookings);

module.exports = router;
