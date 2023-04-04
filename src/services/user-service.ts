import { ICreateUserDto } from "../domains/interfaces/interfaces";
import { UserDomain } from "../domains/user-domain";
import { InternalServerErrorExpection } from "../infra/errors/errors";
import { UsersRepository } from "../infra/repositories/user-repository";
import { Encryption } from "../infra/encryotion/encryption";

export class UserServices {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly userDomain: UserDomain,
    private readonly encryptionService: Encryption
  ) {}

  async createUser(user: ICreateUserDto) {
    try {
      const userValidated = this.userDomain.validateUser(user);

      if (!userValidated.isValid) {
        return userValidated;
      }

      const { username, password, role } = userValidated.user!;

      const passwordHashed = await this.encryptionService.hashPassword(
        password
      );

      return this.userRepository.create({
        username,
        password: passwordHashed,
        role
      });
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async login(username: string, password: string) {
    try {
      const userFound = await this.userRepository.find({ username });

      if (!userFound) {
        return null;
      }

      const validPaswordHashed = await this.encryptionService.validatePassword(
        password,
        userFound.password
      );

      if (!validPaswordHashed) {
        return null;
      }

      const token = this.encryptionService.encryptToken(
        username,
        password,
        userFound.role
      );

      return { username, password: validPaswordHashed, token };
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async resetPassword(
    username: string,
    oldPassword: string,
    newPassword: string
  ) {
    try {
      const userFound = await this.userRepository.find({ username });

      if (!userFound) {
        return null;
      }

      const validPasword = await this.encryptionService.validatePassword(
        oldPassword,
        userFound.password!
      );

      if (!validPasword) {
        return null;
      }

      const newPasswordHashed = await this.encryptionService.hashPassword(
        newPassword
      );

      const userUpdated = await this.userRepository.update(userFound.id!, {
        password: newPasswordHashed
      });

      if (!userUpdated) {
        return null;
      }

      const token = this.encryptionService.encryptToken(
        username,
        newPassword,
        userFound.role
      );

      return { ...userUpdated, token };
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }
}
