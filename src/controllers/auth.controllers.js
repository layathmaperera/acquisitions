import { formatValidationError } from '#utils/format.js';
import { signupSchema, signinSchema } from '#validations/auth.validations.js';
import logger from '#config/logger.js';
import { createUser, authenticateUser } from '#Services/auth.service.js';
import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';

export const signup = async (req, res, next) => {
  try {
    // Validate request body
    const validationResult = signupSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error)
      });
    }

    const { name, email, password, role } = validationResult.data;

    // Create new user
    const user = await createUser({ name, email, password, role });

    // Create JWT token
    const token = jwttoken.sign({ id: user.id, email: user.email, role: user.role });

    logger.info(`User registration successful: ${email}`);

    // Set token in httpOnly cookie
    cookies.set(res, 'token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    // Respond with user info
    res.status(201).json({
      message: 'Account created successfully',
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });

  } catch (err) {
    logger.error('Error creating account', err);

    if (err.message === 'User already exists') {
      return res.status(400).json({ message: err.message });
    }

    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    const validationResult = signinSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error)
      });
    }

    const { email, password } = validationResult.data;

    const user = await authenticateUser({ email, password });

    const token = jwttoken.sign({ id: user.id, email: user.email, role: user.role });

    logger.info(`User login successful: ${email}`);

    cookies.set(res, 'token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });

  } catch (err) {
    logger.error('Error during login', err);

    if (err.message === 'User not found' || err.message === 'Invalid password') {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    next(err);
  }
};

export const signout = async (req, res, next) => {
  try {
    cookies.clear(res, 'token');

    logger.info('User logged out successfully');

    res.status(200).json({ message: 'Logout successful' });

  } catch (err) {
    logger.error('Error during logout', err);
    next(err);
  }
};
