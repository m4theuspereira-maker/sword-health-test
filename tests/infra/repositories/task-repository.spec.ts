import { PrismaClient } from "@prisma/client";
import { TaskRepository } from "../../../src/infra/repositories/task-repository";
import { createMockContext } from "../../config/client";
import MockDate from "mockdate";

describe("TaskRepository", () => {
  let prismaClient: PrismaClient;
  let taskRepository: TaskRepository;
  let taskSpy: any;

  beforeEach(() => {
    prismaClient = createMockContext().prisma;
    MockDate.set(new Date());
  });

  describe("create", () => {
    it("should call client with correct params to create", async () => {
      taskSpy = jest
        .spyOn(prismaClient.task, "create")
        .mockResolvedValueOnce(null as any);

      taskRepository = new TaskRepository(prismaClient);

      await taskRepository.create({ sumary: "lorem ipsum", userId: 4 });

      expect(taskSpy).toHaveBeenCalledWith({
        data: {
          sumary: expect.any(String),
          userId: expect.any(Number),
          deletedAt: null
        }
      });
    });
  });

  describe("findById", () => {
    it("should call findFirst with correct params", async () => {
      taskSpy = jest
        .spyOn(prismaClient.task, "findFirst")
        .mockResolvedValueOnce(null as any);

      taskRepository = new TaskRepository(prismaClient);

      await taskRepository.findById(4);

      expect(taskSpy).toHaveBeenCalledWith({
        where: { id: expect.any(Number), deletedAt: null },
        select: {
          sumary: true,
          userId: true,
          createdAt: true,
          user: true,
          updatedAt: true,
          deletedAt: true
        }
      });
    });
  });

  describe("update", () => {
    it("should call client update correct params", async () => {
      taskSpy = jest
        .spyOn(prismaClient.task, "update")
        .mockResolvedValueOnce(null as any);

      taskRepository = new TaskRepository(prismaClient);

      await taskRepository.update(4, { sumary: "cavalo" });

      expect(taskSpy).toHaveBeenCalledWith({
        where: { id: expect.any(Number) },
        data: {
          sumary: "cavalo",
          updatedAt: new Date()
        }
      });
    });
  });
});
