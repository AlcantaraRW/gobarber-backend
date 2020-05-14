import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let usersRepository: IUsersRepository;
let cacheProvider: ICacheProvider;
let subject: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    cacheProvider = new FakeCacheProvider();
    subject = new ListProvidersService(usersRepository, cacheProvider);
  });

  it('should be able to list the providers', async () => {
    const user1 = await usersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    const user2 = await usersRepository.create({
      name: 'Jack Doe',
      email: 'jack@doe.com',
      password: '123456',
    });

    const loggedUser = await usersRepository.create({
      name: 'Jill Doe',
      email: 'jill@doe.com',
      password: '123456',
    });

    const providers = await subject.execute({ user_id: loggedUser.id });

    expect(providers).toEqual([user1, user2]);
  });
});
