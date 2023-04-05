import { ICreateTaskDto } from "../infra/repositories/interfaces/repository-interfaces";
import {
  sumaryEmptyError,
  titleEmptyError,
  tooManyCharactersError
} from "./errors/error";
import { ITaskValidated } from "./interfaces/interfaces";

export const TASK_STATUS = {
  BACKLOG: "backlog",
  TODO: "to do",
  DOING: "doing",
  DONE: "done"
};

export const TASK_STATUS_ARRAY = ["backlog", "to do", "doing", "done"];
export class TaskDomain {
  validateTask(task: ICreateTaskDto): ITaskValidated {
    if (!task.title.length!) {
      return titleEmptyError();
    }

    if (!task.sumary.length) {
      return sumaryEmptyError();
    }

    if (task.sumary.length > 2500) {
      return tooManyCharactersError();
    }

    return {
      isValid: true,
      task: {
        title: task.title.trim(),
        sumary: task.sumary.trim(),
        userId: task.userId,
        status: TASK_STATUS.BACKLOG
      }
    };
  }
}
