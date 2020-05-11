import 'reflect-metadata';

import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let appointmentsRepository: IAppointmentsRepository;
let subject: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository();
    subject = new ListProviderMonthAvailabilityService(appointmentsRepository);
  });

  it('should be able to list the provider month availability', async () => {
    await appointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 4, 20, 8, 0, 0),
    });

    await appointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 4, 20, 9, 0, 0),
    });

    await appointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 4, 20, 10, 0, 0),
    });

    await appointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 4, 20, 11, 0, 0),
    });

    await appointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 4, 20, 12, 0, 0),
    });

    await appointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 4, 20, 13, 0, 0),
    });

    await appointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    await appointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    await appointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 4, 20, 16, 0, 0),
    });

    await appointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 4, 20, 17, 0, 0),
    });

    await appointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 4, 21, 10, 0, 0),
    });

    const availability = await subject.execute({
      provider_id: 'user',
      year: 2020,
      month: 5,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    );
  });
});
