import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';
import logger from '#config/logger.js';

export const authenticate = (req, res, next) => {
  try {
    let token;

    // Check Authorization header first (Bearer token)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Fallback: check httpOnly cookie
    if (!token) {
      token = cookies.get(req, 'token');
    }

    if (!token) {
      logger.warn('Authentication failed - no token provided');
      return res
        .status(401)
        .json({ status: 'error', message: 'Unauthorized: No token provided' });
    }

    const decoded = jwttoken.verify(token);
    req.user = decoded;
    next();
  } catch (err) {
    logger.warn('Authentication failed - invalid token', err.message);
    return res
      .status(401)
      .json({ status: 'error', message: 'Unauthorized: Invalid token' });
  }
};

export const requireRole = roles => {
  return (req, res, next) => {
    if (!req.user) {
      logger.warn('Role check failed - no user in request');
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(
        `Access denied for user ${req.user.id} with role ${req.user.role}`
      );
      return res.status(403).json({
        status: 'error',
        message: 'Forbidden: Insufficient permissions',
      });
    }

    next();
  };
};
