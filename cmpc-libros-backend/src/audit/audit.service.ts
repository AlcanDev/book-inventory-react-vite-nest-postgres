import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuditLog } from './audit-log.model';

export type LogInput = {
  userId?: string | null; // opcional
  action?: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ' | string;
  entity?: string | null; // opcional
  entityId?: string | null; // opcional (UUID en BD)
  ip?: string | null;
  userAgent?: string | null;
  meta?: any;
};

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectModel(AuditLog)
    private readonly auditModel: typeof AuditLog,
  ) {}

  async log(input: LogInput): Promise<void> {
    try {
      const payload = {
        // UUIDs opcionales -> null cuando no existan
        userId: input.userId ?? null,
        entityId: input.entityId ?? null,

        // Campos de texto con default
        action: input.action || 'READ',
        entity: input.entity || 'Unknown',

        // Campos permisivos
        ip: input.ip || 'unknown',
        userAgent: input.userAgent || 'unknown',
        meta: input.meta ?? null,
      };

      await this.auditModel.create(payload as any);
    } catch (err: any) {
      // nunca romper por auditoría
      this.logger.error(`AuditService.log error: ${err?.message}`, err?.stack);
    }
  }
}
