import Mockdate from "mockdate";
import { server } from "../../src/index";
import supertest from "supertest";
import { client } from "../../src/config/client/client";
import { USER_MOCK } from "../mocks/mocks";
import { Encryption } from "../../src/infra/encryotion/encryption";
import { MessageBrokerServer } from "../../src/infra/message-broker/message-broker-server";

describe("UserController", () => {
  let encryption: Encryption;
  let messageBroker: MessageBrokerServer;

  beforeEach(() => {
    encryption = new Encryption();
    messageBroker = new MessageBrokerServer(`any_uri`);
    Mockdate.set(new Date());
    jest.resetAllMocks();
  });

  afterAll(async () => {
    server.close();
    await client.$disconnect();
  });

  describe("createUser", () => {
    test(`
    should return a created user
    status:200
    POST route:/user/create
    `, async () => {
      jest.spyOn(client.user, "count").mockResolvedValueOnce(0);
      jest.spyOn(client.user, "create").mockResolvedValueOnce(USER_MOCK as any);
      jest.spyOn(client.user, "count").mockResolvedValueOnce(0);

      const { status, body } = await supertest(server)
        .post("/user/create")
        .send({
          username: "dilma",
          password: "1234",
          repeat_password: "1234",
          role: "manager"
        });

      expect(status).toBe(200);
    });

    test(`
    should return an error of password was defferent of repeat
    status:400
    POST route:/user/create
    `, async () => {
      const { status, body } = await supertest(server)
        .post("/user/create")
        .send({
          username: "dilma",
          password: "1234",
          repeat_password: "4321",
          role: "manager"
        });

      expect({ status, body }).toStrictEqual({
        status: 400,
        body: { error: "Invalid param PASSWORD_DIFFERENT_OF_REPEAT_PASSWORD" }
      });
    });

    test(`
    should return an error if an user was already found by new username
    status:400
    POST route:/user/create
    `, async () => {
      jest.spyOn(client.user, "count").mockResolvedValueOnce(1);

      const { status, body } = await supertest(server)
        .post("/user/create")
        .send({
          username: "dilma",
          password: "1234",
          repeat_password: "1234",
          role: "manager"
        });

      expect({ status, body }).toStrictEqual({
        status: 409,
        body: { error: "USER_ALREADY_FOUND" }
      });
    });
  });

  describe("login", () => {
    test(`
    should return invalid user if it was invalid
    status:403
    POST route:/user/login`, async () => {
      jest.spyOn(client.user, "findFirst").mockResolvedValueOnce(null);

      const { status, body } = await supertest(server)
        .post("/user/login")
        .send({
          username: "dilma",
          password: "1234"
        });

      expect({ status, body }).toStrictEqual({
        status: 403,
        body: { error: "username or password invalid" }
      });
    });

    test(`
    should return a logged used with token
    status:200
    POST route:/user/login`, async () => {
      jest
        .spyOn(client.user, "findFirst")
        .mockResolvedValueOnce(USER_MOCK as any);
      jest.spyOn(encryption, "validatePassword").mockResolvedValueOnce(true);
      jest
        .spyOn(encryption, "encryptToken")
        .mockResolvedValueOnce("encryptedToken" as never);

      const { status, body } = await supertest(server)
        .post("/user/login")
        .send({
          username: "dilma",
          password: "1234"
        });

      expect({ status, body }).toStrictEqual({
        status: 200,
        body: {
          body: {
            password: expect.stringMatching(/^\$2b\$08\$[a-zA-Z0-9./]{53}$/),
            token: expect.stringMatching(
              /[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
            ),
            username: "dilma"
          }
        }
      });
    });
  });

  describe("resetPassword", () => {
    test(`
    should return invalid user if it was invalid
    status:403
    POST route:/user/reset`, async () => {
      jest.spyOn(client.user, "findFirst").mockResolvedValueOnce(null);

      const { status, body } = await supertest(server).put("/user/reset").send({
        username: "dilma",
        old_password: "1234",
        new_password: "4321"
      });

      expect({ status, body }).toStrictEqual({
        status: 403,
        body: { error: "username or password invalid" }
      });
    });

    test(`
    should return an user updated
    status:200
    POST route:/user/reset`, async () => {
      jest.spyOn(encryption, "validatePassword").mockResolvedValueOnce(false);
      jest
        .spyOn(client.user, "findFirst")
        .mockResolvedValueOnce(USER_MOCK as any);
      jest.spyOn(client.user, "update").mockResolvedValueOnce(USER_MOCK as any);

      const { status, body } = await supertest(server).put("/user/reset").send({
        username: "dilma",
        old_password: "1234",
        new_password: "4321"
      });

      expect({ status, body }).toStrictEqual({
        status: 200,
        body: {
          body: {
            createdAt: expect.any(String),
            deletedAt: null,
            id: 8,
            password: expect.stringMatching(/^\$2b\$08\$[a-zA-Z0-9./]{53}$/),
            token: expect.stringMatching(
              /[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
            ),
            role: "manager",
            updatedAt: null,
            username: "dilma"
          }
        }
      });
    });
  });
});
