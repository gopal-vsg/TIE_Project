const jwt = require('jsonwebtoken');

const hello = (req, res) => {
    // Check if user exists in request (set by authMiddleware)
    if (!req.user) {
        return res.status(403).json({ message: 'No user data found' });
    }

    // Check if the user has either 'user' or 'admin' role
    if (req.user.role !== 'user' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions' });
    }

    res.send('This api responds to channel booking');
};

module.exports = {
    hello
};