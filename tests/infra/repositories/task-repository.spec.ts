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

      await taskRepository.create({
        summary: "lorem ipsum",
        userId: 4,
        title: `socorro`,
        status: "backlog"
      });

      expect(taskSpy).toHaveBeenCalledWith({
        data: {
          status: "backlog",
          title: expect.any(String),
          summary: expect.any(String),
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

      await taskRepository.findById(4, 5);

      expect(taskSpy).toHaveBeenCalledWith({
        where: {
          id: expect.any(Number),
          userId: expect.any(Number),
          deletedAt: null
        },
        select: {
          id: true,
          summary: true,
          userId: true,
          createdAt: true,
          user: true,
          updatedAt: true,
          deletedAt: true,
          status: true
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

      await taskRepository.update(4, { summary: "cavalo" });

      expect(taskSpy).toHaveBeenCalledWith({
        where: { id: expect.any(Number) },
        data: {
          summary: "cavalo",
          updatedAt: new Date()
        }
      });
    });
  });
});
