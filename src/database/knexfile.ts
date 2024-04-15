import { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

// Determine the current environment
const environment: string = process.env.NODE_ENV || 'development';

// Define the configurations for each environment
const configurations: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    migrations: {
      directory: './database/migrations',
    },
    seeds: {
      directory: './database/seeds',
    },
  },
  staging: {
    // Staging configuration
  },
  production: {
    // Production configuration
  },
};
const config: Knex.Config = configurations[environment];

export default config;
