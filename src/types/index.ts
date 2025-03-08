export interface UserAttributes {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface UserCreationAttributes extends Omit<UserAttributes, 'id'> {}
  
  export interface DatabaseConfig {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql';
    logging: boolean | ((sql: string, timing?: number) => void);
    dialectOptions?: {
        ssl: {
            require: boolean;
            rejectUnauthorized: boolean;
        };
    }
  }