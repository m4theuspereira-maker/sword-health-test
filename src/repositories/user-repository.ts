import { PrismaClient } from "@prisma/client";
import { IRepository } from "./interfaces/repository-interfaces";

export class UsersRepository implements IRepository {
  constructor(private readonly client: PrismaClient) {}

  async create({
    username,
    password,
    role
  }: {
    username: string;
    password: string;
    role: string;
  }) {
    return this.client.user.create({
      data: { username, password, role, deletedAt: null }
    });
  }

  async update(id: number, updatePayload: any) {
    return this.client.user.update({
      where: { id },
      data: {
        ...updatePayload,
        updatedAt: new Date()
      }
    });
  }

  findById(id: number): Promise<any> {
    return this.client.user.findFirst({ where: { id } });
  }
}
