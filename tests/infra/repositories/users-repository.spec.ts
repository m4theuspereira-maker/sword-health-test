import { PrismaClient } from "@prisma/client";
import { UsersRepository } from "../../../src/infra/repositories/user-repository";
import { createMockContext } from "../../config/client";
import MockDate from "mockdate";

describe("UsersRepository", () => {
  let prismaClient: PrismaClient;
  let userRepository: UsersRepository;
  let userSpy: any;

  beforeEach(() => {
    prismaClient = createMockContext().prisma;
    MockDate.set(new Date());
  });

  describe("create", () => {
    it("should call client with correct params to create", async () => {
      userSpy = jest
        .spyOn(prismaClient.user, "create")
        .mockResolvedValueOnce(null as any);

      userRepository = new UsersRepository(prismaClient);

      await userRepository.create({
        username: "jubileu",
        password: "1234",
        role: "manager"
      });

      expect(userSpy).toHaveBeenCalledWith({
        data: {
          username: expect.any(String),
          password: expect.any(String),
          role: expect.any(String),
          deletedAt: null
        }
      });
    });
  });

  describe("findById", () => {
    it("should call find client with correct params", async () => {
      userSpy = jest
        .spyOn(prismaClient.user, "findFirst")
        .mockResolvedValueOnce(null as any);

      userRepository = new UsersRepository(prismaClient);

      await userRepository.findById(4);

      expect(userSpy).toHaveBeenCalledWith({
        where: { id: 4, deletedAt: null },
        select: {
          username: true,
          password: true,
          role: true,
          tasks: true,
          updatedAt: true,
          createdAt: true,
          deletedAt: true
        }
      });
    });
  });

  describe("update", () => {
    it("should call update client with correct params", async () => {
      userSpy = jest
        .spyOn(prismaClient.user, "update")
        .mockResolvedValueOnce(null as any);

      userRepository = new UsersRepository(prismaClient);

      await userRepository.update(4, { username: "cavalo" });

      expect(userSpy).toHaveBeenCalledWith({
        where: { id: expect.any(Number) },
        data: {
          username: "cavalo",
          updatedAt: new Date()
        }
      });
    });
  });
});
