import winston from 'winston';
const { combine, timestamp, json, printf } = winston.format;

// Custom format for readable logs in development
const devFormat = printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
});

// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production';

// Create the logger with appropriate configuration
const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  format: combine(
    timestamp(),
    isProduction ? json() : devFormat
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});

export default logger;