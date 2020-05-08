import 'reflect-metadata';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import IUsersRepository from '../repositories/IUsersRepository';

let repository: IUsersRepository;
let storageProvider: IStorageProvider;
let subject: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    repository = new FakeUsersRepository();
    storageProvider = new FakeStorageProvider();

    subject = new UpdateUserAvatarService(repository, storageProvider);
  });

  it('should be able to update user avatar', async () => {
    const user = await repository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    expect(user.avatar).toBeFalsy();

    await subject.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar of nonexistent user', async () => {
    expect(
      subject.execute({
        user_id: '123',
        avatarFileName: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating', async () => {
    const deleteFile = jest.spyOn(storageProvider, 'deleteFile');

    const user = await repository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    await subject.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    });

    await subject.execute({
      user_id: user.id,
      avatarFileName: 'avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});
