import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

export const jwttoken = {
  sign: (payload) => {
    try {
      return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
        algorithm: 'HS256',
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },

  verify: (token) => {
    if (!token) {
      throw new Error('Token is required');
    }

    try {
      return jwt.verify(token, JWT_SECRET, {
        algorithms: ['HS256'],
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
