import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

let repository: IUsersRepository;
let mailProvider: IMailProvider;
let userTokensRepository: IUserTokensRepository;
let subject: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    repository = new FakeUsersRepository();
    mailProvider = new FakeMailProvider();
    userTokensRepository = new FakeUserTokensRepository();

    subject = new SendForgotPasswordEmailService(
      repository,
      mailProvider,
      userTokensRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(mailProvider, 'sendMail');

    await repository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    await subject.execute({
      email: 'john@doe.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a nonexistent user password', async () => {
    expect(
      subject.execute({
        email: 'john@doe.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(userTokensRepository, 'generate');

    const user = await repository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    await subject.execute({
      email: 'john@doe.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
