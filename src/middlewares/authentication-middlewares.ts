import { Request, Response, NextFunction } from "express";
import { unauthorizedError } from "../controllers/handlers/handles";
import { Encryption } from "../infra/encryotion/encryption";
import { USER_ROLES } from "../domains/user-domain";

export class AuthenticationMiddlewares {
  constructor(private readonly encryptionService: Encryption) {}

  requireAuthentication = (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers as any;

      this.encryptionService.verifyEncryptedToken(authorization);
      next();
    } catch (error) {
      return unauthorizedError(res, "invalid token has been provided");
    }
  };

  requireManagerAuthentication = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { authorization } = req.headers as any;

      if (!authorization) {
        return unauthorizedError(res, "no token provided");
      }
      const { role } =
        this.encryptionService.verifyEncryptedToken(authorization);

      if (role !== USER_ROLES.MANAGER) {
        return unauthorizedError(res, "UNAUTHORIZED");
      }

      next();
    } catch (error) {
      return unauthorizedError(res, "invalid token has been provided");
    }
  };
}
