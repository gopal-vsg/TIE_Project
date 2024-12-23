const jwt = require('jsonwebtoken');

module.exports = (roles = []) => (req, res, next) => {
  console.log('Auth middleware triggered');

  // Ensure roles is an array
  if (!Array.isArray(roles)) {
    roles = [roles];
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Check if the user's role is allowed
    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ message: 'Forbidden: Access is denied.' });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
