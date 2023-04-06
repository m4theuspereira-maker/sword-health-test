import { Encryption } from "../../../src/infra/encryotion/encryption";
import MockDate from "mockdate";
import { generateRandomNumber } from "../../mocks/mocks";
import * as bcrypt from "bcrypt";

describe("Encryption", () => {
  let encryption: Encryption;
  let encryptionSpy: any;

  beforeEach(() => {
    encryption = new Encryption();
    MockDate.set(new Date());
  });

  describe("hashPassword", () => {
    it("should match with regex", async () => {
      const passwordHashed = await encryption.hashPassword(
        String(generateRandomNumber())
      );

      expect({ hash: passwordHashed }).toStrictEqual({
        hash: expect.stringMatching(/^\$2b\$08\$[a-zA-Z0-9./]{53}$/)
      });
    });
  });

  describe("encryptToken", () => {
    it("should generate a token that matches with regex", async () => {
      const jwt = await encryption.encryptToken("maria", "1234", "manager", 4);

      expect({ hash: jwt }).toStrictEqual({
        hash: expect.stringMatching(
          /[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
        )
      });
    });
  });
});
