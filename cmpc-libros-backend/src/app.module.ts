import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { validationSchema } from './config/validation';
import { SequelizeModule } from '@nestjs/sequelize';
import { Book } from './books/book.model';
import { User } from './users/user.model';
import { AuditLog } from './audit/audit-log.model';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        dialect: 'postgres',
        host: cfg.get('db.host'),
        port: cfg.get('db.port'),
        database: cfg.get('db.name'),
        username: cfg.get('db.user'),
        password: cfg.get('db.pass'),
        models: [Book, User, AuditLog],
        autoLoadModels: true,
        synchronize: false,
        logging: cfg.get('env') === 'development' ? console.log : false,
      }),
    }),
    AuthModule,
    UsersModule,
    BooksModule,
    AuditModule,
  ],
})
export class AppModule {}
