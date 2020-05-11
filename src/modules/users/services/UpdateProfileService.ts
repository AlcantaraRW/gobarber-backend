import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  oldPassword?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    oldPassword,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const userByEmail = await this.usersRepository.findByEmail(email);

    if (userByEmail && userByEmail.id !== user_id) {
      throw new AppError('E-mail not available');
    }

    user.name = name;
    user.email = email;

    if (password) {
      if (!oldPassword) {
        throw new AppError(
          'You need to inform the old password to set a new password.',
        );
      }

      const oldPasswordIsCorrect = await this.hashProvider.compareHash(
        oldPassword,
        user.password,
      );

      if (!oldPasswordIsCorrect) {
        throw new AppError('Old password is not correct');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
