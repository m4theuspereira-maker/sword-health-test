import {
  invalidRoleError,
  passwordDifferentOfRepeatPasswordError
} from "./errors/error";
import { ICreateUserDto, IUserValidated } from "./interfaces/interfaces";

export const USER_ROLES = {
  TECH: "technician",
  MANAGER: "manager"
};
export const USER_ROLES_ARRAY = ["technician", "manager"];

export class UserDomain {
  validateUser(user: ICreateUserDto): IUserValidated {
    if (!USER_ROLES_ARRAY.includes(user.role)) {
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
