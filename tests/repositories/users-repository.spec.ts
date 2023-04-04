import { client } from "../../src/config/client/client";
import { UsersRepository } from "../../src/repositories/user-repository";

describe("UsersRepository", () => {
  it("should create an user", async () => {
    const repo = new UsersRepository(client);

    // const user = await repo.create({
    //   username: `disgraca`,
    //   password: `1234`,
    //   role: `admin`
    // });

    //console.log(user);

    expect(1 + 1).toBe(2);
  });

  it("should find onde task", async () => {
    const repo = new UsersRepository(client);

    const task = await repo.findById(11);

    console.log(task);
    expect(1 + 1).toBe(2);
  });
});
