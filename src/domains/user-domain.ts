import {
  invalidRoleError,
  passwordDifferentOfRepeatPasswordError
} from "./errors/error";
import { ICreateUserDto } from "./interfaces/interfaces";

export const USER_ROLES = {
  TECH: "technician",
  MANAGER: "manager"
};

export class UserDomain {
  validateUser(user: ICreateUserDto) {
    if (Object.keys(USER_ROLES).includes(user.role)) {
      return invalidRoleError();
    }

    if (user.password !== user.repeatPassword) {
      return passwordDifferentOfRepeatPasswordError();
    }

    return {
      username: user.username.toLocaleLowerCase(),
      password: user.password,
      role: user.role
    };
  }
}
