// src/utils/logger.ts
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import { LOG_DIR } from '@config';

const logDir = join(__dirname, LOG_DIR);
if (!existsSync(logDir)) mkdirSync(logDir, { recursive: true });

// Build once function
function buildLogger() {
  const logFormat = winston.format.printf(
    ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
  );

  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      logFormat
    ),
    transports: [ 
      new winstonDaily({
        level: 'debug',
        datePattern: 'YYYY-MM-DD',
        dirname: join(logDir, 'debug'),
        filename: `%DATE%.log`,
        maxFiles: 30,
        json: false,
        zippedArchive: true,
      }),
      new winstonDaily({
        level: 'error',
        datePattern: 'YYYY-MM-DD',
        dirname: join(logDir, 'error'),
        filename: `%DATE%.log`,
        maxFiles: 30,
        handleExceptions: true,
        json: false,
        zippedArchive: true,
      }),
    ],
  });

  // Add console transport once
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.splat(),
        winston.format.colorize()
      ),
    })
  );

  return logger;
}

// Use a global singleton to survive duplicate imports/paths
const g = globalThis as any;
export const logger: winston.Logger =
  g.__APP_LOGGER__ || (g.__APP_LOGGER__ = buildLogger());

// Morgan stream
export const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};