"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Determine the current environment
const environment = process.env.NODE_ENV || 'development';
const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
// Define the configurations for each environment
const configurations = {
    development: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port,
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
const config = configurations[environment];
exports.default = config;
