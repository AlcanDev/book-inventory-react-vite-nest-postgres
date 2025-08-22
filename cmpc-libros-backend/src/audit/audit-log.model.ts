import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from '../users/user.model';

@Table({ tableName: 'audit_logs', timestamps: true, updatedAt: false })
export class AuditLog extends Model<AuditLog> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  id!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  userId?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  entity!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  action!: string;

  @Column({ type: DataType.UUID, allowNull: true })
  entityId?: string;

  @Column({ type: DataType.JSONB, allowNull: true })
  meta?: Record<string, unknown>;

  @Column({ type: DataType.STRING, allowNull: true })
  ip?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  userAgent?: string;

  @CreatedAt
  createdAt!: Date;
}
