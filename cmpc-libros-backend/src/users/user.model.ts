import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  Default,
  Unique,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

@Table({ tableName: 'users', timestamps: true, paranoid: true })
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: CreationOptional<string>;

  @Unique
  @Column({ type: DataType.STRING, allowNull: false })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare passwordHash: string;

  @Column({
    type: DataType.ENUM('admin', 'user'),
    allowNull: false,
    defaultValue: 'user',
  })
  declare role: 'admin' | 'user';

  @CreatedAt
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare updatedAt: CreationOptional<Date>;

  @DeletedAt
  declare deletedAt: CreationOptional<Date | null>;
}
