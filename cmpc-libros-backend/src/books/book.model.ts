import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  Default,
  Index,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

@Table({ tableName: 'books', timestamps: true, paranoid: true })
export class Book extends Model<
  InferAttributes<Book>,
  InferCreationAttributes<Book>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: CreationOptional<string>;

  @Index
  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Index
  @Column({ type: DataType.STRING, allowNull: false })
  declare author: string;

  @Index
  @Column({ field: 'publisher', type: DataType.STRING, allowNull: false })
  declare publisher: string;

  @Index
  @Column({ type: DataType.STRING, allowNull: false })
  declare genre: string;

  @Index
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare available: boolean;

  @Index
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare price: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare imageUrl: CreationOptional<string | null>;

  @CreatedAt
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare updatedAt: CreationOptional<Date>;

  @DeletedAt
  declare deletedAt: CreationOptional<Date | null>;
}
