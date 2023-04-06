import { PrismaClient } from "@prisma/client";
import { TaskService } from "../../src/services/task-service";
import { createMockContext } from "../config/client";
import { TaskRepository } from "../../src/infra/repositories/task-repository";
import { UsersRepository } from "../../src/infra/repositories/user-repository";
import { UserDomain } from "../../src/domains/user-domain";
import { MessageBrokerServer } from "../../src/infra/message-broker/message-broker-server";
import { TaskDomain } from "../../src/domains/task-domain";
import MockDate from "mockdate";
import {
  CREATE_TASK_MOCK,
  CREATE_TASK_WITH_EMPTY_TITLE,
  TASK_MOCK,
  UPDATE_TASK,
  UPDATE_TASK_WITH_INVALID_STATUS,
  USER_MOCK
} from "../mocks/mocks";

describe("TaskService", () => {
  let prismaClient: PrismaClient;
  let taskService: TaskService;
  let taskRepository: TaskRepository;
  let userRepository: UsersRepository;
  let userDomain: UserDomain;
  let taskDomain: TaskDomain;
  let messageBroker: MessageBrokerServer;
  let taskSpy: any;

  beforeEach(() => {
    prismaClient = createMockContext().prisma;
    taskService = makeTaskServiceSut();
    MockDate.set(new Date());
  });
  function makeTaskServiceSut() {
    taskRepository = new TaskRepository(prismaClient);
    userRepository = new UsersRepository(prismaClient);
    messageBroker = new MessageBrokerServer(`any_uri`);
    userDomain = new UserDomain();
    taskDomain = new TaskDomain();

    return new TaskService(
      taskRepository,
      userRepository,
      taskDomain,
      messageBroker
    );
  }

  describe("createTask", () => {
    it("should call return a valid user", async () => {
      const taskSpy = jest.spyOn(taskDomain, "validateTask");

      await taskService.createTask(CREATE_TASK_MOCK);

      expect(taskSpy).toReturnWith({
        isValid: true,
        task: {
          title: expect.any(String),
          summary: expect.any(String),
          userId: expect.any(Number),
          status: "backlog"
        }
      });
    });

    it("should return an error if title was empty", async () => {
      const error = await taskService.createTask(CREATE_TASK_WITH_EMPTY_TITLE);

      expect(error).toStrictEqual({ isValid: false, error: "EMPTY_TITLE" });
    });

    it("should return a not found error if user associated to task was not found", async () => {
      jest.spyOn(userRepository, `findById`).mockResolvedValueOnce(null);

      const error = await taskService.createTask(CREATE_TASK_MOCK);

      expect(error).toStrictEqual({
        isValid: false,
        error: "USER_OR_TASK_NOT_FOUND"
      });
    });

    it("should call task create task with correct params", async () => {
      jest
        .spyOn(userRepository, `findById`)
        .mockResolvedValueOnce(USER_MOCK as any);

      taskSpy = jest.spyOn(taskRepository, "create");

      await taskService.createTask(CREATE_TASK_MOCK);

      expect(taskSpy).toHaveBeenCalledWith({
        ...CREATE_TASK_MOCK,
        status: "backlog"
      });
    });
  });

  describe("updateTask", () => {
    it("should return not found error if user was not found", async () => {
      jest.spyOn(userRepository, `findById`).mockResolvedValueOnce(null);

      const error = await taskService.updateTask(UPDATE_TASK);

      expect(error).toStrictEqual({
        isValid: false,
        error: "USER_OR_TASK_NOT_FOUND"
      });
    });

    it("should return an error if satus was invalid", async () => {
      jest
        .spyOn(userRepository, `findById`)
        .mockResolvedValueOnce(USER_MOCK as any);

      const error = await taskService.updateTask(
        UPDATE_TASK_WITH_INVALID_STATUS
      );

      expect(error).toStrictEqual({
        isValid: false,
        error: "INVALID_STATUS"
      });
    });

    it("should call update task with correct params", async () => {
      jest
        .spyOn(userRepository, `findById`)
        .mockResolvedValueOnce(USER_MOCK as any);

      jest
        .spyOn(taskRepository, `findById`)
        .mockResolvedValueOnce(TASK_MOCK as any);

      jest.spyOn(messageBroker, "publish").mockResolvedValueOnce(null as any);

      taskSpy = jest.spyOn(taskRepository, "update");

      await taskService.updateTask(UPDATE_TASK);

      expect(taskSpy).toHaveBeenCalledWith(1, {
        title: "Task created",
        summary: "socorro mainhaaaa",
        status: "backlog"
      });
    });
  });

  describe("findTask", () => {
    it("should return not found error if user was not found", async () => {
      jest.spyOn(userRepository, "findById").mockResolvedValueOnce(null);

      const error = await taskService.findTask(1, 7);

      expect(error).toStrictEqual({
        isValid: false,
        error: "USER_OR_TASK_NOT_FOUND"
      });
    });

    it("should call findTask with correct params", async () => {
      jest
        .spyOn(userRepository, "findById")
        .mockResolvedValueOnce(USER_MOCK as any);

      taskSpy = jest.spyOn(taskRepository, "findById");

      await taskService.findTask(1, 7);

      expect(taskSpy).toHaveBeenCalledWith(1, 7);
    });
  });

  describe("findAllTasks", () => {
    it("should call find many with correct params", async () => {
      taskSpy = jest
        .spyOn(taskRepository, "findMany")
        .mockResolvedValueOnce([]);

      await taskService.findAllTasks(1);

      expect(taskSpy).toHaveBeenCalledWith(20, 0);
    });
  });

  describe("findTasksByUserId", () => {
    it("should call findTasksByUserId with correct params", async () => {
      taskSpy = jest
        .spyOn(taskRepository, "findTasksByUser")
        .mockResolvedValueOnce([]);

      await taskService.findTasksByUserId(1, 7);

      expect(taskSpy).toHaveBeenCalledWith(20, 0, 7);
    });
  });

  describe("deleteTask", () => {
    it("should return a task deleted", async () => {
      jest
        .spyOn(taskRepository, "findById")
        .mockResolvedValueOnce(USER_MOCK as any);

      taskSpy = jest
        .spyOn(taskRepository, "update")
        .mockResolvedValueOnce(TASK_MOCK as any);

      await taskService.deleteTask(1, 7);

      expect(taskSpy).toHaveBeenCalledWith(1, { deletedAt: new Date() });
    });
    it("should return error if user was not found", async () => {
      jest.spyOn(taskRepository, "findById").mockResolvedValueOnce(null as any);

      const error = await taskService.deleteTask(1, 7);

      expect(error).toBeNull();
    });
  });

  describe("formatMessage", () => {
    it("should return a complete message if it has status and title", async () => {
      const message = taskService["formatMessage"](
        "ernane",
        {
          taskId: 1,
          userId: 2,
          title: "chiclete com banana",
          summary: "descer na pipoca do chiclete",
          status: "to do"
        },
        "backlog"
      );

      expect(message).toBe(
        "Tachnician *ERNANE* performed task titled of *CHICLETE COM BANANA* from status *TO DO* to status *TO DO* at 4/4/2023"
      );
    });

    it("should return a complete message if it dont has", async () => {
      const message = taskService["formatMessage"](
        "ernane",
        {
          taskId: 1,
          userId: 2,
          summary: "descer na pipoca do chiclete"
        },
        "backlog"
      );

      expect(message).toBe("Tachnician ernane his task of id *1* at 4/4/2023");
    });
  });
});
