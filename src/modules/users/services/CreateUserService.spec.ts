import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

let usersRepository: IUsersRepository;
let hashProvider: IHashProvider;
let subject: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();

    subject = new CreateUserService(usersRepository, hashProvider);
  });

  it('should be able to create a new user', async () => {
    const user = await subject.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create more than one user with same e-mail address', async () => {
    await subject.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    expect(
      subject.execute({
        name: 'John Doe',
        email: 'john@doe.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
