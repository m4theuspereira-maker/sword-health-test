import { PrismaClient } from "@prisma/client";
import {
  ICreateUserDto,
  IRepository
} from "./interfaces/repository-interfaces";
import { InternalServerErrorExpection } from "../errors/errors";

export class UsersRepository implements IRepository {
  constructor(private readonly client: PrismaClient) {}

  async create({ username, password, role }: ICreateUserDto) {
    try {
      return this.client.user.create({
        data: { username, password, role, deletedAt: null }
      });
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async update(id: number, updatePayload: any) {
    try {
      return this.client.user.update({
        where: { id },
        data: {
          ...updatePayload,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async findById(id: number) {
    try {
      return this.client.user.findFirst({
        where: { id, deletedAt: null },
        select: {
          username: true,
          password: true,
          role: true,
          tasks: true,
          deletedAt: true,
          updatedAt: true,
          createdAt: true
        }
      });
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async find(input: any) {
    try {
      return this.client.user.findFirst({
        where: { ...input, deletedAt: null }
      });
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async countByUsername(username: string) {
    try {
      return this.client.user.count({ where: { username } });
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }
}
