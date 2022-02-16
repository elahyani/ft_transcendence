import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, Users } from '@prisma/client';

import { PrismaService } from 'src/prisma.service';

class NotFoundException extends HttpException {
  constructor() {
    super('resource is not found.', HttpStatus.NOT_FOUND);
  }
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UsersCreateInput) : Promise<Users>{
    try {
      return await this.prisma.users.create({
        data
      });
    } catch (e) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: `Forbidden: cannot create user.`,
      }, HttpStatus.FORBIDDEN);
    }
  }

  findAll() : Promise<Users[]>{
    return this.prisma.users.findMany();
  }

  async findOne(where: Prisma.UsersWhereUniqueInput): Promise<Users> {
    try{
      const user = await this.prisma.users.findUnique({
        where
      });
      if (!user) {
        throw new NotFoundException();
      }
      return user;
    }
    catch(e) {
      throw e;
    }
  }

  async update(where: Prisma.UsersWhereUniqueInput, data: Prisma.UsersUpdateInput) : Promise<Users> {
    try{
      return await this.prisma.users.update({
        where,
        data
      });
    } catch(e) {
      throw new NotFoundException();
    }
  }

  async remove(where: Prisma.UsersWhereUniqueInput): Promise<Users>{
    try{
      return await this.prisma.users.delete({
        where
      });
    }
    catch(e) {
      throw new NotFoundException();
    }
  }
}
