import { client } from "../config/client/client";
import { TaskController } from "../controllers/task-controller";
import { UserController } from "../controllers/user-controller";
import { TaskDomain } from "../domains/task-domain";
import { UserDomain } from "../domains/user-domain";
import { Encryption } from "../infra/encryotion/encryption";
import { TaskRepository } from "../infra/repositories/task-repository";
import { UsersRepository } from "../infra/repositories/user-repository";
import { TaskService } from "../services/task-service";
import { UserService } from "../services/user-service";

export function userControllerFactory(): UserController {
  const userRepository = new UsersRepository(client);
  const encryptionService = new Encryption();
  const userDomain = new UserDomain();
  const userServices = new UserService(
    userRepository,
    userDomain,
    encryptionService
  );
  return new UserController(userServices);
}

export function tasksControllerFactory(): TaskController {
  const taskRepository = new TaskRepository(client);
  const userRepository = new UsersRepository(client);
  const taskDomain = new TaskDomain();
  const encryption = new Encryption();
  const taskService = new TaskService(
    taskRepository,
    userRepository,
    taskDomain
  );

  return new TaskController(taskService, encryption);
}
