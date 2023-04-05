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
  USER_NOT_FOUND_ERROR
} from "../domains/errors/error";

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  createTask = async (req: Request, res: Response) => {
    try {
      const { title, sumary, userId } = req.body;

      const taskCreated = (await this.taskService.createTask({
        title,
        sumary,
        userId
      })) as ITaskValidated;

      if (!taskCreated.isValid) {
        return badrequestError(res, taskCreated.error);
      }

      return ok(res, taskCreated);
    } catch (error) {
      return serverError(res, error);
    }
  };

  updateTask = async (req: Request, res: Response) => {
    try {
      const { userId, taskId } = req.params;
      const updatePayload = req.body;

      const taskUpdated = (await this.taskService.updateTask({
        userId: Number(userId),
        taskId: Number(taskId),
        ...updatePayload
      })) as ITaskValidated;

      if (taskUpdated.error === USER_NOT_FOUND_ERROR) {
        return notFoundError(res, USER_NOT_FOUND_ERROR);
      }

      if (taskUpdated.error === TASK_NOT_FOUND_ERROR) {
        return notFoundError(res, TASK_NOT_FOUND_ERROR);
      }

      if (!taskUpdated.isValid) {
        return badrequestError(res, taskUpdated.error);
      }

      return ok(res, taskUpdated);
    } catch (error) {
      return serverError(res, error);
    }
  };

  deleteTask = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;

      const taskDeleted = await this.taskService.deleteTask(Number(taskId));

      if (!taskDeleted) {
        return notFoundError(res, USER_NOT_FOUND_ERROR);
      }

      return ok(res, taskDeleted);
    } catch (error) {
      return serverError(res, error);
    }
  };
}
