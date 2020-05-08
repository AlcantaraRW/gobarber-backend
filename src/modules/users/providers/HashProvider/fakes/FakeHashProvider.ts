import IHashProvider from '../models/IHashProvider';

class FakeHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return `${payload}_hashed`;
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    const notHashed = hashed.replace('_hashed', '');
    return payload === notHashed;
  }
}

export default FakeHashProvider;
