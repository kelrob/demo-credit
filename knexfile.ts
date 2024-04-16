import type { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const environments: string[] = ['development', 'staging', 'production'];

const connection = {
  host: process.env.DB_HOST as string,
  database: process.env.DB_NAME as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  port: process.env.DB_PORT,
};

const commonConfig: Knex.Config = {
  client: 'mysql2',
  connection,
  migrations: {
    directory: './src/database/migrations',
  },
  seeds: {
    directory: './src/database/seeds',
  },
};

export default Object.fromEntries(environments.map((env: string) => [env, commonConfig]));
