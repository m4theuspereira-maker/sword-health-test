import { UserService } from "../services/user-service";
import { Response, Request } from "express";
import {
  badrequestError,
  conflictError,
  ok,
  serverError,
  unauthorizedError
} from "./handlers/handles";
import { ITaskValidated } from "../domains/interfaces/interfaces";
import {
  USER_ALREADY_FOUND_ERROR
} from "../domains/errors/error";

export class UserController {
  constructor(private readonly userService: UserService) {}

  createUser = async (req: Request, res: Response) => {
    try {
      const { username, password, role } = req.body;

      const userCreated = (await this.userService.createUser({
        username,
        password,
        role
      })) as ITaskValidated;

      if (userCreated.error === USER_ALREADY_FOUND_ERROR) {
        return conflictError(res, USER_ALREADY_FOUND_ERROR);
      }

      if (!userCreated.isValid) {
        return badrequestError(res, userCreated.error);
      }

      return ok(res, userCreated);
    } catch (error) {
      return serverError(res, error);
    }
  };


  login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      const userLogged = await this.userService.login(
        username,
        password
      );

      if (!userLogged) {
        return unauthorizedError(res, "username or password invalid");
      }

      return ok(res, userLogged);
    } catch (error) {
      return serverError(res, error);
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { username, old_password, new_password } = req.body;

      const userLogged = await this.userService.resetPassword(
        username,
        old_password,
        new_password
      );

      if (!userLogged) {
        return unauthorizedError(res, "username or password invalid");
      }

      return ok(res, userLogged);
    } catch (error) {
      return serverError(res, error);
    }
  };
}
