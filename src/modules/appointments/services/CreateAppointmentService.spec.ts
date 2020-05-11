import 'reflect-metadata';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

let appointmentsRepository: IAppointmentsRepository;
let subject: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository();
    subject = new CreateAppointmentService(appointmentsRepository);
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await subject.execute({
      date: new Date(),
      provider_id: '123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2020, 4, 10, 11);

    await subject.execute({
      date: appointmentDate,
      provider_id: '123',
    });

    expect(
      subject.execute({
        date: appointmentDate,
        provider_id: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
