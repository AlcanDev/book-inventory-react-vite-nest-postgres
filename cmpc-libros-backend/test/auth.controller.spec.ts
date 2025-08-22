import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';

describe('AuthController', () => {
  it('login delega en AuthService y retorna el token', async () => {
    const mockAuthService = {
      login: jest.fn().mockResolvedValue({ access_token: 'xyz' }),
    } as unknown as AuthService;

    const ctrl = new AuthController(mockAuthService);

    const body = { email: 'admin@cmpc.local', password: 'admin1234' } as any;
    const req = {
      ip: '127.0.0.1',
      headers: { 'user-agent': 'jest-test' },
      user: { id: 1 },
    };

    const out = await ctrl.login(body, req as any);

    expect(mockAuthService.login).toHaveBeenCalledWith(
      'admin@cmpc.local',
      'admin1234',
      { ip: '127.0.0.1', ua: 'jest-test' },
    );
    expect(out).toEqual({ access_token: 'xyz' });
  });
});
