import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { APP_SECRET } from "../../config/environment-consts";
import { InternalServerErrorExpection } from "../errors/errors";

interface IDecryptedTokenData {
  role: string;
  id: string;
}

export class Encryption {
  async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 8);
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async validatePassword(
    password: string,
    userSavedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, userSavedPassword);
  }

  encryptToken(
    username: string,
    password: string,
    role: string,
    id: number
  ): string {
    return jwt.sign({ username, password, role, id }, APP_SECRET as string, {
      expiresIn: "1d"
    });
  }

  verifyEncryptedToken(authorization: string): IDecryptedTokenData {
    const [, token] = authorization.split(" ");

    const { role, id } = jwt.verify(
      token,
      APP_SECRET as string
    ) as IDecryptedTokenData;

    return { role, id };
  }
}
