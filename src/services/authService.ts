import { FindOptions, WhereOptions } from 'sequelize';
import { UserAttributes, UserCreationAttributes } from '../types';
import db from '../modals';

const { User } = db;

class AuthService {

  async findByEmail(email: string): Promise<any | null> {
    return User.findOne({
      where: { email } as WhereOptions,
    });
  }

  async checkPassword(email: string, password: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    if (!user) {
      return false;
    }
    return await user.validPassword(password);
  }

  async create(userData: UserCreationAttributes): Promise<any> {
    return User.create(userData);
  }

  async update( userData: Partial<UserAttributes>): Promise<any | null> {
    const user = await this.findByEmail(userData.email as string);
    
    if (!user) {
      return null;
    }
    
    return user.update(userData);
  }

 
}

export default new AuthService();
