// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly usersRepo: typeof User) {}

  async findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  async create(dto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    return this.usersRepo.create({
      email: dto.email,
      passwordHash,
      role: dto.role,
    });
  }
}
