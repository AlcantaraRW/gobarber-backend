import { uuid } from 'uuidv4';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

class UsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findAllProviders({
    exceptUserId,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let { users } = this;

    if (exceptUserId) {
      users = this.users.filter(user => user.id !== exceptUserId);
    }

    return users;
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid(), name, email, password });

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const index = this.users.findIndex(u => u.id === user.id);

    this.users[index] = user;

    return user;
  }
}

export default UsersRepository;
