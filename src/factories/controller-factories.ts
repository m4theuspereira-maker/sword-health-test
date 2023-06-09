import { client } from "../config/client/client";
import { MESSAGE_BROKER_ADDRESS } from "../config/environment-consts";
import { TaskController } from "../controllers/task-controller";
import { UserController } from "../controllers/user-controller";
import { TaskDomain } from "../domains/task-domain";
import { UserDomain } from "../domains/user-domain";
import { Encryption } from "../infra/encryotion/encryption";
import { MessageBrokerServer } from "../infra/message-broker/message-broker-server";
import { TaskRepository } from "../infra/repositories/task-repository";
import { UsersRepository } from "../infra/repositories/user-repository";
import { TaskService } from "../services/task-service";
import { UserService } from "../services/user-service";
import { encryptionFactory } from "./infra-factories";

const encryption = encryptionFactory()

export function userControllerFactory(): UserController {
  const userRepository = new UsersRepository(client);
  const userDomain = new UserDomain();
  const userServices = new UserService(
    userRepository,
    userDomain,
    encryption
  );
  return new UserController(userServices);
}

export function tasksControllerFactory(): TaskController {
  const taskRepository = new TaskRepository(client);
  const userRepository = new UsersRepository(client);
  const taskDomain = new TaskDomain();
  const taskService = new TaskService(
    taskRepository,
    userRepository,
    taskDomain,
    new MessageBrokerServer(String(MESSAGE_BROKER_ADDRESS))
  );

  return new TaskController(taskService, encryption);
}
