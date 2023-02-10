import {
  NextFunction,
  Request,
  Response,
} from "express";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { UserDatabase } from "../database/user.database";
import { ServerError } from "../errors/server.error";
import { RequestError } from "../errors/request.error";

export class CpfValidatorMiddleware {
  public static isCpfValid(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { cpf } = req.body;

      if (!cpf) {
        return RequestError.notProvided(
          res,
          "CPF"
        );
      }

      const cpfText = cpf
        .toString()
        .padStart(11, "0");

      let isValid = cpfValidator.isValid(cpfText);

      if (!isValid) {
        return res.status(400).send({
          ok: false,
          message: "CPF is invalid",
        });
      }

      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public static cpfAlreadyExist(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { cpf } = req.body;

      const database = new UserDatabase();
      const userCpf = database.getUserCpf(cpf);

      if (userCpf) {
        return res.status(400).send({
          ok: false,
          message: "User already exist",
        });
      }

      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
