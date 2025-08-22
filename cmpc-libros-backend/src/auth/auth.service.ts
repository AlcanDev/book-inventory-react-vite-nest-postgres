import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly audit: AuditService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');
    return user;
  }

  async login(
    email: string,
    password: string,
    meta?: { ip?: string; ua?: string },
  ) {
    const user = await this.validateUser(email, password);
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    } as const;
    const token = await this.jwt.signAsync(payload);
    await this.audit.log({
      userId: user.id,
      entity: 'Auth',
      action: 'LOGIN',
      meta,
      ip: meta?.ip,
      userAgent: meta?.ua,
    });
    return { access_token: token };
  }
}
