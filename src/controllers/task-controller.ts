import { TaskService } from "../services/task-service";
import { Response, Request } from "express";
import {
  badrequestError,
  notFoundError,
  ok,
  serverError
} from "./handlers/handles";
import { ITaskValidated } from "../domains/interfaces/interfaces";
import {
  TASK_NOT_FOUND_ERROR,
  USER_OR_TASK_NOT_FOUND
} from "../domains/errors/error";
import { Encryption } from "../infra/encryotion/encryption";

export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly encryption: Encryption
  ) {}

  createTask = async (req: Request, res: Response) => {
    try {
      const { title, sumary } = req.body;

      const { id } = this.encryption.verifyEncryptedToken(
        req.headers.authorization!
      );

      const taskCreated = (await this.taskService.createTask({
        title,
        sumary,
        userId: Number(id)
      })) as ITaskValidated;

      if (taskCreated.isValid) {
        return badrequestError(res, taskCreated.error);
      }

      return ok(res, taskCreated);
    } catch (error) {
      return serverError(res, error);
    }
  };

  updateTask = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;

      const { id } = this.encryption.verifyEncryptedToken(
        req.headers.authorization!
      );

      const updatePayload = req.body;

      const taskUpdated = (await this.taskService.updateTask({
        userId: Number(id),
        taskId: Number(taskId),
        ...updatePayload
      })) as ITaskValidated;

      if (taskUpdated.error === USER_OR_TASK_NOT_FOUND) {
        return notFoundError(res, USER_OR_TASK_NOT_FOUND);
      }

      if (taskUpdated.error === TASK_NOT_FOUND_ERROR) {
        return notFoundError(res, TASK_NOT_FOUND_ERROR);
      }

      if (taskUpdated.isValid) {
        return badrequestError(res, taskUpdated.error);
      }

      return ok(res, taskUpdated);
    } catch (error) {
      return serverError(res, error);
    }
  };

  deleteTask = async (req: Request, res: Response) => {
    try {
      const { taskId, userId } = req.params;

      const taskDeleted = await this.taskService.deleteTask(
        Number(taskId),
        Number(userId)
      );

      if (!taskDeleted) {
        return notFoundError(res, USER_OR_TASK_NOT_FOUND);
      }

      return ok(res, taskDeleted);
    } catch (error) {
      return serverError(res, error);
    }
  };

  findAllTasks = async (req: Request, res: Response) => {
    try {
      const { page } = req.query;

      const pageValidated = Number(page) < 1 ? 1 : page;

      const tasksFound = await this.taskService.findAllTasks(
        Number(pageValidated)
      );

      return ok(res, tasksFound);
    } catch (error) {
      return serverError(res, error);
    }
  };

  findTask = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;

      const { id } = this.encryption.verifyEncryptedToken(
        req.headers.authorization!
      );

      const taskFound = (await this.taskService.findTask(
        Number(taskId),
        Number(id)
      )) as ITaskValidated;

      if (!taskFound || taskFound.isValid!) {
        return notFoundError(res, TASK_NOT_FOUND_ERROR);
      }

      ok(res, taskFound);
    } catch (error) {
      return serverError(res, error);
    }
  };

  findTasksByUserId = async (req: Request, res: Response) => {
    try {
      const { page } = req.query;

      const pageValidated = page ? Number(page) < 1 : 1;

      const { id } = this.encryption.verifyEncryptedToken(
        req.headers.authorization!
      );

      const taskFound = await this.taskService.findTasksByUserId(
        Number(pageValidated),
        Number(id)
      );

      ok(res, taskFound);
    } catch (error) {
      return serverError(res, error);
    }
  };
}
