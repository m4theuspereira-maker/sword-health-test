import express, { Router } from "express";
import cors from "cors";
import {
  tasksControllerFactory,
  userControllerFactory
} from "./factories/controller-factories";
import { middlewaresFactory } from "./factories/middlewares-factory";

const userController = userControllerFactory();
const taskController = tasksControllerFactory();
const middlewares = middlewaresFactory();

const routes = Router();
routes.use(cors());
routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));
routes.post(
  "/task/create",
  middlewares.requireAuthentication,
  taskController.createTask
);
routes.delete(
  "/task/delete/:userId/:taskId",
  middlewares.requireManagerAuthentication,
  taskController.deleteTask
);
routes.put(
  "/task/update/:taskId",
  middlewares.requireAuthentication,
  taskController.updateTask
);
routes.get(
  "/task/find/user",
  middlewares.requireAuthentication,
  taskController.findTasksByUserId
);
routes.get(
  "/task/find/:taskId/",
  middlewares.requireAuthentication,
  taskController.findTask
);
routes.get(
  "/task/find/",
  middlewares.requireManagerAuthentication,
  taskController.findAllTasks
);

routes.post("/user/create", userController.createUser);
routes.post("/user/login", userController.login);
routes.put("/user/reset", userController.resetPassword);

export { routes };
