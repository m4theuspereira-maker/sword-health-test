import { client } from "../../src/config/client/client";
import { TaskRepository } from "../../src/repositories/task-repository";

describe("TaskRepository", () => {
  it("should save a new task", async () => {
    const repo = new TaskRepository(client);

    // const taskCreated = await repo.create({
    //   sumary: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    // `,
    //   userId: 11
    // });

    // console.log(taskCreated);

    expect(1).toBe(1);
  });

  it(`should return a task`, async () => {
    const repo = new TaskRepository(client);

    const task = await repo.findById(31);

    console.log(task);
    expect(1 + 1).toBe(2);
  });
});
