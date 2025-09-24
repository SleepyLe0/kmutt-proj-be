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
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USER,
  DB_PASSWORD,
} = process.env;
