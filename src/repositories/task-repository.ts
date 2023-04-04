import { PrismaClient } from "@prisma/client";
import {
  ICreateTaskDto,
  IRepository
} from "./interfaces/repository-interfaces";
import { InternalServerErrorExpection } from "../errors/errors";

export class TaskRepository implements IRepository {
  constructor(private readonly client: PrismaClient) {}

  async create({ sumary, userId }: ICreateTaskDto) {
    try {
      return this.client.task.create({
        data: { sumary, userId, deletedAt: null }
      });
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async update(id: number, updatePayload: any) {
    try {
      return this.client.task.update({
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
      const taskFound = await this.client.task.findFirst({
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

      if (taskFound?.deletedAt) {
        return null;
      }

      return taskFound;
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }
}
