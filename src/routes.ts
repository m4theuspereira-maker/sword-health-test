import express, { Router } from "express";
import cors from "cors";
import {
  tasksControllerFactory,
  userControllerFactory
} from "./factories/controller-factories";

const userController = userControllerFactory();
const taskController = tasksControllerFactory();

const routes = Router();
routes.use(cors());
routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));

routes.post("/task/create", taskController.createTask);
routes.put("/task/update/:userId/:taskId", taskController.updateTask);
routes.get("/task/find/:userId/:taskId/", taskController.findTask)
routes.get("/task/find/", taskController.findAllTasks)



routes.post("/user/create", userController.createUser);
routes.post("/user/login", userController.login);
routes.put("/user/reset", userController.resetPassword);

export { routes };
