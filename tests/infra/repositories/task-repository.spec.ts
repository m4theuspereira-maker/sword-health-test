import { PrismaClient } from "@prisma/client";
import { TaskRepository } from "../../../src/infra/repositories/task-repository";
import { createMockContext } from "../../config/client";
import MockDate from "mockdate";
import { FIND_MANY_TASKS_MOCK } from "../../mocks/mocks";

describe("TaskRepository", () => {
  let prismaClient: PrismaClient;
  let taskRepository: TaskRepository;
  let taskSpy: any;

  beforeEach(() => {
    prismaClient = createMockContext().prisma;
    taskRepository = new TaskRepository(prismaClient);
    MockDate.set(new Date());
  });

  describe("create", () => {
    it("should call client with correct params to create", async () => {
      taskSpy = jest
        .spyOn(prismaClient.task, "create")
        .mockResolvedValueOnce(null as any);

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

  describe("findMany", () => {
    it("should return all database tasks", async () => {
      taskSpy = jest
        .spyOn(prismaClient.task, "findMany")
        .mockResolvedValueOnce(FIND_MANY_TASKS_MOCK as any);

      await taskRepository.findMany(20, 0);

      expect(taskSpy).toHaveBeenCalledWith({
        take: expect.any(Number),
        skip: expect.any(Number),
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

    it("should return empty array of it comes from database", async () => {
      taskSpy = jest
        .spyOn(prismaClient.task, "findMany")
        .mockResolvedValueOnce([]);

      const tasksNotFound = await taskRepository.findMany(20, 0);

      expect(tasksNotFound).toHaveLength(0);
    });

    it("should not consider tasks with deletedAt", async () => {
      taskSpy = jest
        .spyOn(prismaClient.task, "findMany")
        .mockResolvedValueOnce([FIND_MANY_TASKS_MOCK.at(1)] as any);

      const tasksNotFound = await taskRepository.findMany(20, 0);

      expect(tasksNotFound).toHaveLength(0);
    });
  });

  describe("findTasksByUser", () => {
    it("should return the tasks woned by logged user", async () => {
      const TASKS_OF_USER_ERNANE = FIND_MANY_TASKS_MOCK.filter(
        (task) => task.userId === 2
      );

      taskSpy = jest
        .spyOn(prismaClient.task, "findMany")
        .mockResolvedValueOnce([]);

      await taskRepository.findTasksByUser(20, 0, 2);

      expect(taskSpy).toHaveBeenCalledWith({
        take: expect.any(Number),
        skip: expect.any(Number),
        where: {
          userId: 2
        }
      });
    });

    it("should disconsider tasks with deletedAt", async () => {
      const TASKS_TO_BE_RETURNED = [
        ...FIND_MANY_TASKS_MOCK.filter((task) => task.userId === 2),
        { ...FIND_MANY_TASKS_MOCK.at(2), deletedAt: new Date() }
      ];

      taskSpy = jest
        .spyOn(prismaClient.task, "findMany")
        .mockResolvedValueOnce(TASKS_TO_BE_RETURNED as any);

      const tasksReturned = await taskRepository.findTasksByUser(20, 0, 2);

      expect(tasksReturned).toHaveLength(TASKS_TO_BE_RETURNED.length - 1);
    });
  });
});
