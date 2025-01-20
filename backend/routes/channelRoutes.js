const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const channelController = require('../controllers/channelController');

router.get('/hello', authMiddleware, channelController.hello);

module.exports = router;