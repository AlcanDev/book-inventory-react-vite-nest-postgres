import { of } from 'rxjs';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { AuditInterceptor } from '../src/audit/audit.interceptor';

class MockAuditService {
  log = jest.fn(async () => void 0);
}

function buildContext(
  opts: Partial<{
    method: string;
    id?: string;
    user?: any;
    url?: string;
    ua?: string;
    ip?: string;
  }>,
): ExecutionContext {
  const req = {
    method: opts.method ?? 'GET',
    params: { id: opts.id },
    originalUrl: opts.url ?? '/books/123',
    headers: { 'user-agent': opts.ua ?? 'jest' },
    ip: opts.ip ?? '127.0.0.1',
    user: opts.user,
  };
  return {
    switchToHttp: () => ({ getRequest: () => req }),
  } as unknown as ExecutionContext;
}

function buildNext(): CallHandler {
  return { handle: () => of({ ok: true }) } as unknown as CallHandler;
}

describe('AuditInterceptor', () => {
  it('no audita peticiones GET', (done) => {
    const audit = new MockAuditService();
    const interceptor = new AuditInterceptor(audit as any);
    const ctx = buildContext({ method: 'GET' });

    interceptor.intercept(ctx, buildNext()).subscribe({
      complete: () => {
        expect(audit.log).not.toHaveBeenCalled();
        done();
      },
    });
  });

  it('audita POST como CREATE', (done) => {
    const audit = new MockAuditService();
    const interceptor = new AuditInterceptor(audit as any);
    const ctx = buildContext({
      method: 'POST',
      id: '42',
      user: { sub: 'u1' },
      url: '/books',
    });

    interceptor.intercept(ctx, buildNext()).subscribe({
      complete: () => {
        expect(audit.log).toHaveBeenCalledTimes(1);
        const entry = (audit.log as jest.Mock).mock.calls[0][0];
        expect(entry.action).toBe('CREATE');
        expect(entry.entityId).toBe('42');
        expect(entry.userId).toBe('u1');
        expect(entry.meta).toEqual({ path: '/books' });
        done();
      },
    });
  });

  ['PUT', 'PATCH'].forEach((method) => {
    it(`audita ${method} como UPDATE`, (done) => {
      const audit = new MockAuditService();
      const interceptor = new AuditInterceptor(audit as any);
      const ctx = buildContext({ method, id: '99', url: '/books/99' });

      interceptor.intercept(ctx, buildNext()).subscribe({
        complete: () => {
          expect(audit.log).toHaveBeenCalledTimes(1);
          const entry = (audit.log as jest.Mock).mock.calls[0][0];
          expect(entry.action).toBe('UPDATE');
          expect(entry.entityId).toBe('99');
          expect(entry.meta).toEqual({ path: '/books/99' });
          done();
        },
      });
    });
  });

  it('audita DELETE como DELETE', (done) => {
    const audit = new MockAuditService();
    const interceptor = new AuditInterceptor(audit as any);
    const ctx = buildContext({ method: 'DELETE', id: '77', url: '/books/77' });

    interceptor.intercept(ctx, buildNext()).subscribe({
      complete: () => {
        expect(audit.log).toHaveBeenCalledTimes(1);
        const entry = (audit.log as jest.Mock).mock.calls[0][0];
        expect(entry.action).toBe('DELETE');
        expect(entry.entityId).toBe('77');
        expect(entry.meta).toEqual({ path: '/books/77' });
        done();
      },
    });
  });
});

function buildContextAdvanced(
  opts: Partial<{
    method: string;
    bodyId?: string;
    socketIp?: string;
    uaCap?: string;
    url?: string;
    user?: any;
  }>,
): ExecutionContext {
  const req: any = {
    method: opts.method ?? 'PATCH',
    params: {}, // sin id en params
    body: { id: opts.bodyId },
    url: opts.url ?? '/alt/books',
    headers: { 'User-Agent': opts.uaCap ?? 'ADV-UA' },
    socket: { remoteAddress: opts.socketIp ?? '::1' },
    user: opts.user,
  };
  return {
    switchToHttp: () => ({ getRequest: () => req }),
  } as unknown as ExecutionContext;
}

it('cubre ramas: id desde body, ip desde socket, User-Agent en mayúsculas y path desde req.url', (done) => {
  const audit = new MockAuditService();
  const interceptor = new AuditInterceptor(audit as any);
  const ctx = buildContextAdvanced({
    method: 'PATCH',
    bodyId: 'b123',
    socketIp: '::1',
    uaCap: 'Jest-UA-CAP',
    url: '/v1/books',
  });

  interceptor.intercept(ctx, buildNext()).subscribe({
    complete: () => {
      expect(audit.log).toHaveBeenCalledTimes(1);
      const entry = (audit.log as jest.Mock).mock.calls[0][0];
      expect(entry.action).toBe('UPDATE'); // PATCH -> UPDATE
      expect(entry.entityId).toBe('b123'); // body.id
      expect(entry.ip).toBe('::1'); // socket.remoteAddress
      expect(entry.userAgent).toBe('Jest-UA-CAP'); // 'User-Agent'
      expect(entry.meta).toEqual({ path: '/v1/books' }); // req.url
      done();
    },
  });
});
