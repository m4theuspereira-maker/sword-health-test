import {
  invalidStatusError,
  taskNotFoundError,
  userNotFoundError
} from "../domains/errors/error";
import { TASK_STATUS, TaskDomain } from "../domains/task-domain";
import { InternalServerErrorExpection } from "../infra/errors/errors";
import { ICreateTaskDto } from "../infra/repositories/interfaces/repository-interfaces";
import { TaskRepository } from "../infra/repositories/task-repository";
import { UsersRepository } from "../infra/repositories/user-repository";
import { IUpdateTaskDto } from "./interfaces/interfaces";

export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly userRepository: UsersRepository,
    private readonly taskDomain: TaskDomain
  ) {}

  async createTask(task: ICreateTaskDto) {
    try {
      const taskValidated = this.taskDomain.validateTask({
        title: task.title,
        sumary: task.sumary,
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
        Object.keys(TASK_STATUS).includes(updateTaskDto.status!)
      ) {
        return invalidStatusError();
      }

      const taskFound = await this.taskRepository.findById(
        updateTaskDto.taskId
      );

      if (!taskFound) {
        return taskNotFoundError();
      }

      const { taskId, sumary, title, status } = updateTaskDto;

      return this.taskRepository.update(taskId, {
        sumary,
        title,
        status
      });
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

      return this.taskRepository.findById(taskId);
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async findAllTasks() {
    try {
      return this.taskRepository.findMany();
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async deleteTask(taskId: number) {
    try {
      return this.taskRepository.update(taskId, { deletedAt: new Date() });
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }
}
