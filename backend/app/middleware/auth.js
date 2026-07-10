const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'sir-syed-secret-key-12345!';

/**
 * Middleware to authenticate requests using JWT
 */
function authenticateToken(req, res, next) {
  let token = null;

  // Check Authorization Header
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // Fallback to Cookies if parsed (for simpler browser integration)
  if (!token && req.headers.cookie) {
    const cookies = Object.fromEntries(
      req.headers.cookie.split(';').map(c => c.trim().split('='))
    );
    token = cookies['token'];
  }

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // { id, name, email, role }
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or Expired Token' });
  }
}

/**
 * Middleware to restrict access to specific roles (RBAC)
 */
function requireRole(roles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient Permissions' });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole,
  JWT_SECRET
};
