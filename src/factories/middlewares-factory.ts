import { Encryption } from "../infra/encryotion/encryption";
import { AuthenticationMiddlewares } from "../middlewares/authentication-middlewares";

export function middlewaresFactory(): AuthenticationMiddlewares {
  return new AuthenticationMiddlewares(new Encryption());
}
