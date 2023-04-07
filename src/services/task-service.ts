import {
  DEFAULT_PAGE_LIMIT,
} from "../config/environment-consts";
import {
  invalidStatusError,
  taskNotFoundError,
  userNotFoundError
} from "../domains/errors/error";
import { TASK_STATUS_ARRAY, TaskDomain } from "../domains/task-domain";
import { InternalServerErrorExpection } from "../infra/errors/errors";
import {
  MESSAGE_BROKER_QUEUES,
  MessageBrokerServer
} from "../infra/message-broker/message-broker-server";
import {
  ICreateTaskDto,
} from "../infra/repositories/interfaces/repository-interfaces";
import { TaskRepository } from "../infra/repositories/task-repository";
import { UsersRepository } from "../infra/repositories/user-repository";
import { IUpdateTaskDto } from "./interfaces/interfaces";

export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly userRepository: UsersRepository,
    private readonly taskDomain: TaskDomain,
    private readonly messageBroker: MessageBrokerServer
  ) {}

  async createTask(task: ICreateTaskDto) {
    try {
      const taskValidated = this.taskDomain.validateTask({
        title: task.title,
        summary: task.summary,
        userId: task.userId
      });

      if (!taskValidated.isValid) {
        return taskValidated;
      }

      const { userId } = taskValidated.task!;

      const userFound = await this.userRepository.findById(userId);

      if (!userFound) {
        return userNotFoundError();
      }

      return this.taskRepository.create({
        ...taskValidated.task!
      });
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async updateTask(updateTaskDto: IUpdateTaskDto) {
    try {
      const userFound = await this.userRepository.findById(
        updateTaskDto.userId
      );

      if (!userFound) {
        return userNotFoundError();
      }

      if (
        updateTaskDto.status &&
        !TASK_STATUS_ARRAY.includes(updateTaskDto.status)
      ) {
        return invalidStatusError();
      }

      const taskFound = await this.taskRepository.findById(
        updateTaskDto.taskId,
        updateTaskDto.userId
      );

      if (!taskFound) {
        return taskNotFoundError();
      }

      const { taskId, summary, title, status } = updateTaskDto;

      const taskUpdated = await this.taskRepository.update(taskId, {
        summary,
        title,
        status
      });

      const messageFormated = this.formatMessage(
        userFound.username,
        updateTaskDto,
        taskFound.status!
      );

      await this.messageBroker.publish(
        MESSAGE_BROKER_QUEUES.NOTIFICATIONS,
        messageFormated
      );

      return taskUpdated;
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async findTask(taskId: number, userId: number) {
    try {
      const userFound = await this.userRepository.findById(userId);

      if (!userFound) {
        return userNotFoundError();
      }

      return this.taskRepository.findById(taskId, userId);
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async findAllTasks(page: number) {
    try {
      const pageoffset = (page - 1) * DEFAULT_PAGE_LIMIT;

      return this.taskRepository.findMany(DEFAULT_PAGE_LIMIT, pageoffset);
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async findTasksByUserId(page: number, userId: number) {
    try {
      const pageoffset = (page - 1) * DEFAULT_PAGE_LIMIT;

      return this.taskRepository.findTasksByUser(
        DEFAULT_PAGE_LIMIT,
        pageoffset,
        userId
      );
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async deleteTask(taskId: number, userId: number) {
    try {
      const taskFound = await this.taskRepository.findById(taskId, userId);

      if (!taskFound) {
        return null;
      }

      return this.taskRepository.update(taskId, { deletedAt: new Date() });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorExpection();
    }
  }

  private formatMessage(
    username: string,
    updatePaylod: IUpdateTaskDto,
    anteirorTaskStatus: string
  ): string {
    const hasRequiredFieldsToPerformMessage =
      Object.keys(updatePaylod).includes("status") &&
      Object.keys(updatePaylod).includes("title");

    const date = new Date();

    if (
      hasRequiredFieldsToPerformMessage &&
      anteirorTaskStatus !== updatePaylod.status
    ) {
      return `Tachnician *${username.toUpperCase()}* performed task titled of *${updatePaylod.title?.toUpperCase()}* from status *${anteirorTaskStatus.toLocaleUpperCase()}* to status *${updatePaylod.status?.toUpperCase()}* at ${
        date.getMonth() + 1
      }/${date.getDay()}/${date.getFullYear()}`;
    }

    return `Tachnician ${username} his task of id *${updatePaylod.taskId}* at ${
      date.getMonth() + 1
    }/${date.getDay()}/${date.getFullYear()}`;
  }
}
