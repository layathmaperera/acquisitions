import express from 'express';
// import logger from './config/logger.js';
import logger from '#config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from '#routes/auth.routes.js';
import secrityMiddleware from '#middlewares/security.middleware.js';
import usersRoutes from '#routes/users.routes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));

app.use(secrityMiddleware);

app.get('/', (req, res) => {
  logger.info('Hello from Acquisitions!');
  res.status(200).send('Hello from Acquisitions!');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime() });

});
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Acquisitions API is running' });
});




app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

// 404 handler - catch unmatched routes
app.all('{*path}', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot find ${req.originalUrl} on this server`
  });
});

// Global error handler - returns JSON instead of HTML
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  logger.error(`${err.message}`, { stack: err.stack });

  if (process.env.NODE_ENV === 'development') {
    return res.status(statusCode).json({
      status,
      message: err.message,
      stack: err.stack
    });
  }

  // Production - don't leak internals
  res.status(statusCode).json({
    status,
    message: statusCode === 500 ? 'Internal server error' : err.message
  });
});

export default app;
