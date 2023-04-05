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

  async findById(id: number, userId: number) {
    try {
      return this.client.task.findFirst({
        where: { id, userId, deletedAt: null },
        select: {
          id: true,
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

  async findMany(limit: number, offset: number) {
    const tasksFound = await this.client.task.findMany({
      take: limit,
      skip: offset
    });

    return tasksFound.filter((task) => !task.deletedAt);
  }

  async findTasksByUser(limit: number, offset: number, userId: number) {
    const tasksFound = await this.client.task.findMany({
      take: limit,
      skip: offset,
      where: {
        userId
      }
    });

    return tasksFound.filter((task) => !task.deletedAt);
  }
}
