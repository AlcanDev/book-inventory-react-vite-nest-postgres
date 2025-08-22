import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuditService } from './audit.service';

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly audit: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest();

    // Datos útiles del request (con defaults para evitar runtime errors en tests)
    const method: string = (req?.method as string) || 'GET';
    const id: string | undefined = req?.params?.id ?? req?.body?.id;
    const user =
      (req?.user as { sub?: string; email?: string } | undefined) ?? undefined;
    const ip = req?.ip ?? req?.socket?.remoteAddress ?? undefined;
    const userAgent =
      req?.headers?.['user-agent'] ?? req?.headers?.['User-Agent'] ?? undefined;
    const path = req?.originalUrl ?? req?.url ?? '';

    // Sólo auditar mutaciones (POST/PUT/PATCH/DELETE). GET no se audita.
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

    return next.handle().pipe(
      tap(async () => {
        if (!isMutation) return;

        const action: AuditAction =
          method === 'POST'
            ? 'CREATE'
            : method === 'DELETE'
              ? 'DELETE'
              : 'UPDATE';

        await this.audit.log({
          userId: user?.sub,
          action,
          entityId: id,
          ip,
          userAgent,
          meta: { path },
        } as any);
      }),
    );
  }
}
