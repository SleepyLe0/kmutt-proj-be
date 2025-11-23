import { config } from 'dotenv';
config({
  path: `.env.${process.env.NODE_ENV || 'development'}.local`,
  quiet: true,
});

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const ORIGIN = process.env.CREDENTIALS === 'true';

export const {
  SITE,
  NODE_ENV,
  PORT,
  ROUTE_PREFIX,
  LOG_DIR,
  LOG_FORMAT,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_DATABASE,
  MONGO_USER,
  MONGO_PASSWORD,
} = process.env;
