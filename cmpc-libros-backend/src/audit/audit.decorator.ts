import { SetMetadata } from '@nestjs/common';
export const AUDIT_ENTITY = 'AUDIT_ENTITY';
export const AuditEntity = (name: string) => SetMetadata(AUDIT_ENTITY, name);
