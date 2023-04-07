import Mockdate from "mockdate";
import { app, server } from "../../src/index";
import supertest from "supertest";
import { client } from "../../src/config/client/client";
import { USER_MOCK } from "../mocks/mocks";

describe("UserController", () => {
  beforeEach(() => {
    Mockdate.set(new Date());
    jest.resetAllMocks();
  });

  afterAll(async () => {
    server.close();
    await client.$disconnect();
  });

  describe("createUser", () => {
    test(`
    sould return a created user
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
});
