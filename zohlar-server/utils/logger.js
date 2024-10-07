// logger.js
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

// Custom log format
const logFormat = format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Daily Rotate File transport configuration
const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d', // Retain logs for 14 days
});

const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }), // To log errors with stack trace
    format.splat(),
    format.json(),
    logFormat
  ),
  transports: [
    new transports.Console({
      level: 'info', // Log info level and above to console
    }),
    dailyRotateFileTransport, // Save logs to rotating log files
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' }), // Handle uncaught exceptions
  ],
  rejectionHandlers: [
    new transports.File({ filename: 'logs/rejections.log' }), // Handle promise rejections
  ],
});

module.exports = logger;
