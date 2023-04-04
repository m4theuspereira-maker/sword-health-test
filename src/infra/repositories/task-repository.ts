import { PrismaClient } from "@prisma/client";
import {
  ICreateTaskDto,
  IRepository
} from "./interfaces/repository-interfaces";
import { InternalServerErrorExpection } from "../errors/errors";

export class TaskRepository implements IRepository {
  constructor(private readonly client: PrismaClient) {}

  async create({ sumary, userId, title, status }: ICreateTaskDto) {
    try {
      return this.client.task.create({
        data: { sumary, userId, deletedAt: null, title, status: status! }
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
      return this.client.task.findFirst({
        where: { id, deletedAt: null },
        select: {
          sumary: true,
          userId: true,
          createdAt: true,
          user: true,
          updatedAt: true,
          deletedAt: true
        }
      });
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async findMany() {
    const tasksFound = await this.client.task.findMany();

    return tasksFound.filter((task) => !task.deletedAt);
  }
}
