import 'reflect-metadata';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let appointmentsRepository: IAppointmentsRepository;
let cacheProvider: ICacheProvider;
let subject: ListProviderAppointmentsService;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository();
    cacheProvider = new FakeCacheProvider();
    subject = new ListProviderAppointmentsService(
      appointmentsRepository,
      cacheProvider,
    );
  });

  it('should be able to list the provider appointments on a specific day', async () => {
    const appointment1 = await appointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    const appointment2 = await appointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    const appointments = await subject.execute({
      provider_id: 'provider',
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
