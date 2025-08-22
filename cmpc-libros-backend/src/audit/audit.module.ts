import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuditLog } from './audit-log.model';
import { AuditService } from './audit.service';

@Module({
  imports: [SequelizeModule.forFeature([AuditLog])],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
