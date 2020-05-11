import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';

let usersRepository: IUsersRepository;
let subject: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    subject = new ShowProfileService(usersRepository);
  });

  it('should be able to show user profile', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    const profile = await subject.execute({ user_id: user.id });

    expect(profile.name).toBe('John Doe');
    expect(profile.email).toBe('john@doe.com');
  });

  it('should not be able to show profile from a nonexistent user', async () => {
    await expect(
      subject.execute({ user_id: 'unknown-user-id' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
