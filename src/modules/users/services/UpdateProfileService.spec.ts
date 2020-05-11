import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

let usersRepository: IUsersRepository;
let hashProvider: IHashProvider;
let subject: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();

    subject = new UpdateProfileService(usersRepository, hashProvider);
  });

  it('should be able to update user profile', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    const updatedUser = await subject.execute({
      user_id: user.id,
      name: 'Foo Bar',
      email: 'foo@bar.com',
    });

    expect(updatedUser.name).toBe('Foo Bar');
    expect(updatedUser.email).toBe('foo@bar.com');
  });

  it('should not be able to change the email to an already registered email', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    const user = await usersRepository.create({
      name: 'Jack Doe',
      email: 'jack@doe.com',
      password: '123456',
    });

    await expect(
      subject.execute({
        user_id: user.id,
        name: user.name,
        email: 'john@doe.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a nonexistent user', async () => {
    await expect(
      subject.execute({
        user_id: 'unknown-user',
        name: 'John Doe',
        email: 'john@doe.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update password', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    const updatedUser = await subject.execute({
      user_id: user.id,
      name: user.name,
      email: user.email,
      oldPassword: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123_hashed');
  });

  it('should not be able to update password without old password', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    await expect(
      subject.execute({
        user_id: user.id,
        name: user.name,
        email: user.email,
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update password with wrong old password', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    await expect(
      subject.execute({
        user_id: user.id,
        name: user.name,
        email: user.email,
        oldPassword: 'wrong-old-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
