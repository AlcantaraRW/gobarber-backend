import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import CreateUserService from '@modules/users/services/CreateUserService';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

let usersRepository: IUsersRepository;
let hashProvider: IHashProvider;
let subject: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();

    subject = new AuthenticateUserService(usersRepository, hashProvider);
  });

  it('should be able to authenticate', async () => {
    const createUser = new CreateUserService(usersRepository, hashProvider);

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    const response = await subject.execute({
      email: 'john@doe.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate a nonexistent user', async () => {
    expect(
      subject.execute({
        email: 'john@doe.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const createUser = new CreateUserService(usersRepository, hashProvider);

    await createUser.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    expect(
      subject.execute({
        email: 'john@doe.com',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
