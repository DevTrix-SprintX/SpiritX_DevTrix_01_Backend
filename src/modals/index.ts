import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import config from '../configs/database';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env as keyof typeof config];

console.log('dbConfig:', dbConfig);

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    dialectOptions: {
      ssl: {
        require: dbConfig.dialectOptions?.ssl.require || true,
        rejectUnauthorized: dbConfig.dialectOptions?.ssl.rejectUnauthorized || true,
      }
    }
  }
  
);

const db: any = {};



import User from './user';
db.User = User(sequelize, DataTypes);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;