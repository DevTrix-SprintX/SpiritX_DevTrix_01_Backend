import dotenv from 'dotenv';
import { DatabaseConfig } from '../types';

dotenv.config();

interface Config {
    development: DatabaseConfig;
    test: DatabaseConfig;
    production: DatabaseConfig;
}

const config: Config = {
    development: {
        username: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'postgres',
        database: process.env.PGDATABASE || 'secure-connect',
        host: process.env.PGHOST || '127.0.0.1',
        dialect: 'postgres',
        logging: console.log,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    },
    test: {
        username: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'postgres',
        database: process.env.PGDATABASE || 'secure-connect',
        host: process.env.PGHOST || '127.0.0.1',
        dialect: 'postgres',
        logging: false
    },
    production: {
        username: process.env.PGUSER || '',
        password: process.env.PGPASSWORD || '',
        database: process.env.PGDATABASE || '',
        host: process.env.PGHOST || '',
        dialect: 'postgres',
        logging: false,
    }
};

export default config;
