import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import AppError from '@shared/errors/AppError';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let usersRepository: IUsersRepository;
let hashProvider: IHashProvider;
let userTokensRepository: IUserTokensRepository;
let subject: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();
    userTokensRepository = new FakeUserTokensRepository();

    subject = new ResetPasswordService(
      usersRepository,
      hashProvider,
      userTokensRepository,
    );
  });

  it('should be able to reset password', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    const { token } = await userTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(hashProvider, 'generateHash');

    await subject.execute({
      password: 'NEWPASSWORD',
      token,
    });

    const updatedUser = await usersRepository.findById(user.id);

    expect(generateHash).toBeCalledWith('NEWPASSWORD');
    expect(updatedUser?.password).toBe('NEWPASSWORD_hashed');
  });

  it('should not be able to reset password of nonexistent token', async () => {
    expect(
      subject.execute({
        token: 'unknown-token',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password of nonexistent user', async () => {
    const { token } = await userTokensRepository.generate('unknown-user');

    expect(
      subject.execute({
        token,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password when more than 2 hours is passed', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    const { token } = await userTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });

    expect(
      subject.execute({
        token,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
