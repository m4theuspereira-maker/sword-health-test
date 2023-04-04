import { PrismaClient } from "@prisma/client";
import { ICreateUserDto, IRepository } from "./interfaces/repository-interfaces";
import { InternalServerErrorExpection } from "../errors/errors";

export class UsersRepository implements IRepository {
  constructor(private readonly client: PrismaClient) {}

  async create({
    username,
    password,
    role
  }: ICreateUserDto) {
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
      const userFound = await this.client.user.findFirst({
        where: { id },
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

      if (userFound?.deletedAt) {
        return null;
      }

      return userFound;
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }
}
