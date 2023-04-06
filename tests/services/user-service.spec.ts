import { PrismaClient } from "@prisma/client";
import { TaskService } from "../../src/services/task-service";
import { UserService } from "../../src/services/user-service";
import { createMockContext } from "../config/client";
import { TaskRepository } from "../../src/infra/repositories/task-repository";
import { UsersRepository } from "../../src/infra/repositories/user-repository";
import { UserDomain } from "../../src/domains/user-domain";
import { MessageBrokerServer } from "../../src/infra/message-broker/message-broker-server";
import { TaskDomain } from "../../src/domains/task-domain";
import { Encryption } from "../../src/infra/encryotion/encryption";
import MockDate from "mockdate";
import { USER_MOCK, USER_WITH_INVALID_PASSWORD_REPEAT } from "../mocks/mocks";

describe("UserService", () => {
  let prismaClient: PrismaClient;
  let taskRepository: TaskRepository;
  let userRepository: UsersRepository;
  let userDomain: UserDomain;
  let taskDomain: TaskDomain;
  let userService: UserService;
  let messageBroker: MessageBrokerServer;
  let encryption: Encryption;
  let userSpy: any;

  beforeEach(() => {
    prismaClient = createMockContext().prisma;
    userService = userSeviceSut();
    MockDate.set(new Date());
  });

  function userSeviceSut() {
    taskRepository = new TaskRepository(prismaClient);
    userRepository = new UsersRepository(prismaClient);
    messageBroker = new MessageBrokerServer(`any_uri`);
    encryption = new Encryption();
    userDomain = new UserDomain();
    taskDomain = new TaskDomain();

    return new UserService(userRepository, userDomain, encryption);
  }

  describe("createUser", () => {
    it("should return an error if user has password different from repeat password", async () => {
      const error = await userService.createUser(
        USER_WITH_INVALID_PASSWORD_REPEAT
      );

      expect(error).toStrictEqual({
        isValid: false,
        error: "PASSWORD_DIFFERENT_OF_REPEAT_PASSWORD"
      });
    });

    it("should return user already found error if some user with this username was found", async () => {
      jest.spyOn(userDomain, "validateUser").mockReturnValueOnce({
        isValid: true,
        user: {
          username: USER_MOCK.username,
          password: USER_WITH_INVALID_PASSWORD_REPEAT.password,
          role: USER_MOCK.role
        }
      });

      jest.spyOn(userRepository, "countByUsername").mockResolvedValueOnce(1);

      const error = await userService.createUser(USER_MOCK);

      expect(error).toStrictEqual({
        isValid: false,
        error: "USER_ALREADY_FOUND"
      });
    });

    it("should call create user with correct params", async () => {
      jest.spyOn(userDomain, "validateUser").mockReturnValueOnce({
        isValid: true,
        user: {
          username: USER_MOCK.username,
          password: USER_WITH_INVALID_PASSWORD_REPEAT.password,
          role: USER_MOCK.role
        }
      });

      jest.spyOn(userRepository, "countByUsername").mockResolvedValueOnce(0);

      userSpy = jest.spyOn(userRepository, "create");

      await userService.createUser(USER_MOCK);

      expect(userSpy).toHaveBeenCalledWith({
        username: USER_MOCK.username.toLocaleLowerCase(),
        password: expect.stringMatching(
          /[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
        ),
        role: USER_MOCK.role
      });
    });
  });

  describe("login", () => {
    it("should return null if user was not found", async () => {
      jest.spyOn(userRepository, "find").mockResolvedValueOnce(null);

      const notFound = await userService.login("ernane", "1234");

      expect(notFound).toBeNull();
    });

    it("should return null if password was not valid", async () => {
      jest
        .spyOn(userRepository, "find")
        .mockResolvedValueOnce(USER_MOCK as any);

      jest.spyOn(encryption, "validatePassword").mockResolvedValueOnce(false);

      const invalidPassword = await userService.login("ernane", "1234");

      expect(invalidPassword).toBeNull();
    });

    it("should return an user logged with his token", async () => {
      jest
        .spyOn(userRepository, "find")
        .mockResolvedValueOnce(USER_MOCK as any);

      jest.spyOn(encryption, "validatePassword").mockResolvedValueOnce(true);

      const userLogged = await userService.login("ernane", "1234");

      expect(userLogged).toStrictEqual({
        username: "ernane",
        password: expect.stringMatching(/^\$2b\$08\$[a-zA-Z0-9./]{53}$/),
        token: expect.stringMatching(
          /[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
        )
      });
    });
  });

  describe("resetPassword", () => {
    it("should return null if user was not found", async () => {
      jest.spyOn(userRepository, "find").mockResolvedValueOnce(null);

      const notFound = await userService.login("ernane", "1234");

      expect(notFound).toBeNull();
    });

    it("should return null if password was not valid", async () => {
      jest
        .spyOn(userRepository, "find")
        .mockResolvedValueOnce(USER_MOCK as any);

      jest.spyOn(encryption, "validatePassword").mockResolvedValueOnce(false);

      const invalidPassword = await userService.login("ernane", "1234");

      expect(invalidPassword).toBeNull();
    });

    it("should return null if password was not valid", async () => {
      jest
        .spyOn(userRepository, "find")
        .mockResolvedValueOnce(USER_MOCK as any);

      jest.spyOn(encryption, "validatePassword").mockResolvedValueOnce(true);

      userSpy = jest
        .spyOn(userRepository, "update")
        .mockResolvedValueOnce(USER_MOCK as any);

      await userService.resetPassword("ernane", "1234", "4321");

      expect(userSpy).toHaveBeenCalledWith(USER_MOCK.id, {
        password: expect.stringMatching(/^\$2b\$08\$[a-zA-Z0-9./]{53}$/)
      });
    });

    it("should return an user with new token", async () => {
      jest
        .spyOn(userRepository, "find")
        .mockResolvedValueOnce(USER_MOCK as any);

      jest.spyOn(encryption, "validatePassword").mockResolvedValueOnce(true);

      userSpy = jest
        .spyOn(userRepository, "update")
        .mockResolvedValueOnce(USER_MOCK as any);

      const userWithNewToken = await userService.resetPassword(
        "ernane",
        "1234",
        "4321"
      );

      expect(userWithNewToken).toStrictEqual({
        id: expect.any(Number),
        username: expect.any(String),
        password: expect.stringMatching(/^\$2b\$08\$[a-zA-Z0-9./]{53}$/),
        role: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: null,
        deletedAt: null,
        token: expect.stringMatching(
          /[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
        )
      });
    });
  });
});
