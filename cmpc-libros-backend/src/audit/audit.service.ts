import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuditLog } from './audit-log.model';

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(AuditLog) private readonly auditRepo: typeof AuditLog,
  ) {}

  async log(entry: Partial<AuditLog>) {
    await this.auditRepo.create(entry as any);
  }
}
