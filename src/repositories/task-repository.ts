import { PrismaClient } from "@prisma/client";
import {
  ICreateUserDto,
  IRepository
} from "./interfaces/repository-interfaces";

export class TaskRepository implements IRepository {
  constructor(private readonly client: PrismaClient) {}

  async create({ sumary, userId }: ICreateUserDto) {
    return this.client.task.create({
      data: { sumary, userId, deletedAt: null }
    });
  }

  async update(id: number, updatePayload: any) {
    return this.client.task.update({
      where: { id },
      data: {
        ...updatePayload,
        updatedAt: new Date()
      }
    });
  }

  async findById(id: number) {
    return this.client.task.findFirst({
      where: { id },
      select: {
        sumary: true,
        userId: true,
        createdAt: true,
        user: true,
        updatedAt: true,
        deletedAt: true
      }
    });
  }
}
