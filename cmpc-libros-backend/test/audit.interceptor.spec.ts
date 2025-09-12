import { of } from 'rxjs';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuditInterceptor } from '../src/audit/audit.interceptor';

class MockAuditService {
  log = jest.fn(async () => void 0);
}

class MockReflector {
  get = jest.fn(() => null);
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
    getHandler: () => ({}),
    getClass: () => ({}),
  } as unknown as ExecutionContext;
}

function buildNext(): CallHandler {
  return { handle: () => of({ ok: true }) } as unknown as CallHandler;
}

describe('AuditInterceptor', () => {
  it('no audita peticiones GET', (done) => {
    const audit = new MockAuditService();
    const reflector = new MockReflector();
    const interceptor = new AuditInterceptor(audit as any, reflector as any);
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
    const reflector = new MockReflector();
    const interceptor = new AuditInterceptor(audit as any, reflector as any);
    const ctx = buildContext({ method: 'POST', id: '456', user: { id: 'u1' } });

    interceptor.intercept(ctx, buildNext()).subscribe({
      complete: () => {
        expect(audit.log).toHaveBeenCalledWith({
          userId: 'u1',
          action: 'CREATE',
          entity: 'Book',
          entityId: '456',
          ip: '127.0.0.1',
          userAgent: 'jest',
          metadata: { path: '/books/123' },
        });
        done();
      },
    });
  });

  it('audita PUT como UPDATE', (done) => {
    const audit = new MockAuditService();
    const reflector = new MockReflector();
    const interceptor = new AuditInterceptor(audit as any, reflector as any);
    const ctx = buildContext({ method: 'PUT', id: '789', user: { id: 'u2' } });

    interceptor.intercept(ctx, buildNext()).subscribe({
      complete: () => {
        expect(audit.log).toHaveBeenCalledWith({
          userId: 'u2',
          action: 'UPDATE',
          entity: 'Book',
          entityId: '789',
          ip: '127.0.0.1',
          userAgent: 'jest',
          metadata: { path: '/books/123' },
        });
        done();
      },
    });
  });

  it('audita PATCH como UPDATE', (done) => {
    const audit = new MockAuditService();
    const reflector = new MockReflector();
    const interceptor = new AuditInterceptor(audit as any, reflector as any);
    const ctx = buildContext({ method: 'PATCH', id: '789', user: { id: 'u2' } });

    interceptor.intercept(ctx, buildNext()).subscribe({
      complete: () => {
        expect(audit.log).toHaveBeenCalledWith({
          userId: 'u2',
          action: 'UPDATE',
          entity: 'Book',
          entityId: '789',
          ip: '127.0.0.1',
          userAgent: 'jest',
          metadata: { path: '/books/123' },
        });
        done();
      },
    });
  });

  it('audita DELETE como DELETE', (done) => {
    const audit = new MockAuditService();
    const reflector = new MockReflector();
    const interceptor = new AuditInterceptor(audit as any, reflector as any);
    const ctx = buildContext({ method: 'DELETE', id: '999', user: { id: 'u3' } });

    interceptor.intercept(ctx, buildNext()).subscribe({
      complete: () => {
        expect(audit.log).toHaveBeenCalledWith({
          userId: 'u3',
          action: 'DELETE',
          entity: 'Book',
          entityId: '999',
          ip: '127.0.0.1',
          userAgent: 'jest',
          metadata: { path: '/books/123' },
        });
        done();
      },
    });
  });

  it('cubre ramas: id desde body, ip desde socket, User-Agent en mayúsculas y path desde req.url', (done) => {
    const audit = new MockAuditService();
    const reflector = new MockReflector();
    const interceptor = new AuditInterceptor(audit as any, reflector as any);

    // Simula req con socket.remoteAddress y body.id
    const req = {
      method: 'POST',
      params: {},
      body: { id: 'body-id-123' },
      originalUrl: undefined,
      url: '/custom-path',
      headers: { 'User-Agent': 'CustomAgent/1.0' },
      ip: undefined,
      socket: { remoteAddress: '192.168.1.100' },
      user: { id: 'socket-user' },
    };

    const ctx = {
      switchToHttp: () => ({ getRequest: () => req }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as unknown as ExecutionContext;

    interceptor.intercept(ctx, buildNext()).subscribe({
      complete: () => {
        expect(audit.log).toHaveBeenCalledWith({
          userId: 'socket-user',
          action: 'CREATE',
          entity: 'Unknown',
          entityId: 'body-id-123',
          ip: '192.168.1.100',
          userAgent: 'CustomAgent/1.0',
          metadata: { path: '/custom-path' },
        });
        done();
      },
    });
  });

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
  const req = {
    method: opts.method ?? 'PATCH',
    params: {},
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
