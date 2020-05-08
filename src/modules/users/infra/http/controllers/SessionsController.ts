import { container } from 'tsyringe';
import { Request, Response } from 'express';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const authResponse = await authenticateUser.execute({
      email,
      password,
    });

    delete authResponse.user.password;

    return response.json(authResponse);
  }
}
