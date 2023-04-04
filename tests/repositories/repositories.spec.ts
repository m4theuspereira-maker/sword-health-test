import { client } from "../../src/config/client/client";
import { UsersRepository } from "../../src/repositories/user-repository";

describe("UsersRepository", () => {
  it("should create an user", async () => {
    const repo = new UsersRepository(client);

    const user = await repo.findById(4);

    console.log(user);

    expect(1 + 1).toBe(2);
  });
});
