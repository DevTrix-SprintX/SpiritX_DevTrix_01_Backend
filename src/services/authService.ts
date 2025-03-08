import { FindOptions, WhereOptions } from 'sequelize';
import { UserAttributes, UserCreationAttributes } from '../types';
import db from '../modals';

const { User } = db;

class AuthService {

  async findByUsername(username: string): Promise<any | null> {
    return User.findOne({
      where: { username } as WhereOptions,
    });
  }

  async checkPassword(username: string, password: string): Promise<boolean> {
    const user = await this.findByUsername(username);
    const passwordHash = user.get().password;
    console.log('user:', user.get());
    if (!user) {
      return false;
    }
    const isValid = await user.validPassword(password, passwordHash);
    return isValid;
  }

  async create(userData: UserCreationAttributes): Promise<any> {
    return User.create(userData);
  }

  async update( userData: Partial<UserAttributes>): Promise<any | null> {
    const user = await this.findByUsername(userData.username as string);
    
    if (!user) {
      return null;
    }
    
    return user.update(userData);
  }

 
}

export default new AuthService();
