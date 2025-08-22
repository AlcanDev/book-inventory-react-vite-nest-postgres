import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuditService } from '../src/audit/audit.service';

describe('AuthService', () => {
  let service: AuthService;
  const users = { findByEmail: jest.fn() } as unknown as UsersService;
  const jwt = {
    signAsync: jest.fn().mockResolvedValue('token'),
  } as unknown as JwtService;
  const audit = { log: jest.fn() } as unknown as AuditService;

  beforeEach(() => {
    service = new AuthService(users, jwt, audit);
  });

  it('login ok', async () => {
    const hash = await bcrypt.hash('pass', 1);
    (users.findByEmail as any).mockResolvedValue({
      id: '1',
      email: 'a@a.com',
      passwordHash: hash,
      role: 'admin',
    });
    const res = await service.login('a@a.com', 'pass');
    expect(res.access_token).toBe('token');
  });

  it('login inválido', async () => {
    (users.findByEmail as any).mockResolvedValue(null);
    await expect(service.login('a@a.com', 'x')).rejects.toBeTruthy();
  });
});
