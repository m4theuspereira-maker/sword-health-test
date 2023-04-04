import {
  invalidRoleError,
  passwordDifferentOfRepeatPasswordError
} from "./errors/error";
import { ICreateUserDto, IUserValidated } from "./interfaces/interfaces";

export const USER_ROLES = {
  TECH: "technician",
  MANAGER: "manager"
};

export class UserDomain {
  validateUser(user: ICreateUserDto): IUserValidated {
    if (Object.keys(USER_ROLES).includes(user.role)) {
      return invalidRoleError();
    }

    if (user.password !== user.repeatPassword) {
      return passwordDifferentOfRepeatPasswordError();
    }

    return {
      isValid: true,
      user: {
        username: user.username.toLocaleLowerCase(),
        password: user.password,
        role: user.role
      }
    };
  }
}
