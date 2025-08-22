import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
// OJO: usamos 'tap' pero con funciones async envueltas en try/catch internos
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';
import { Reflector } from '@nestjs/core';
import { AUDIT_ENTITY } from './audit.decorator';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(
    private readonly auditService: AuditService,
    private readonly reflector: Reflector,
  ) {}

  private inferEntityFromPath(path?: string): string | null {
    if (!path) return null;
    // Normalizamos (por si viene con querystring)
    const clean = path.split('?')[0] || '';
    if (clean.startsWith('/books')) return 'Book';
    if (clean.startsWith('/users')) return 'User';
    // agrega más recursos aquí si los tienes
    return null;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest<any>();

    // 1) entity: decorator -> inferencia -> 'Unknown'
    const reflectedEntity =
      this.reflector.get<string>(AUDIT_ENTITY, context.getHandler()) ||
      this.reflector.get<string>(AUDIT_ENTITY, context.getClass());

    const pathCandidate =
      req?.route?.path || req?.originalUrl || req?.url || req?.path;

    const entity =
      reflectedEntity || this.inferEntityFromPath(pathCandidate) || 'Unknown';

    // 2) action según método
    const method = (req?.method || 'GET').toUpperCase();
    const action =
      method === 'POST'
        ? 'CREATE'
        : method === 'PATCH' || method === 'PUT'
          ? 'UPDATE'
          : method === 'DELETE'
            ? 'DELETE'
            : 'READ';

    // 3) entityId desde params/body cuando aplique
    const entityId = req?.params?.id || req?.body?.id || null;

    // 4) user/id/ip/ua/meta
    const user = req?.user;
    const userId = user?.sub || user?.id || null;
    const ip = req?.ip || req?.headers?.['x-forwarded-for'] || 'unknown';
    const userAgent = req?.headers?.['user-agent'] || 'unknown';
    const meta = { path: pathCandidate || 'unknown' };

    return next.handle().pipe(
      tap({
        next: async () => {
          try {
            await this.auditService.log({
              userId,
              action,
              entity,
              entityId,
              ip,
              userAgent,
              meta,
            });
          } catch (err: any) {
            // Nunca tumbar la request por fallas de auditoría
            this.logger.error(`Audit log failed: ${err?.message}`, err?.stack);
          }
        },
        error: async () => {
          try {
            await this.auditService.log({
              userId,
              action,
              entity,
              entityId: entityId ?? null,
              ip,
              userAgent,
              meta: { ...meta, error: true },
            });
          } catch (err: any) {
            this.logger.error(
              `Audit log (error path) failed: ${err?.message}`,
              err?.stack,
            );
          }
        },
      }),
    );
  }
}
