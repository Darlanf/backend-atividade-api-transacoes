import {
  NextFunction,
  Request,
  Response,
} from "express";
import { UserDatabase } from "../database/user.database";
import { RequestError } from "../errors/request.error";
import { ServerError } from "../errors/server.error";
import { TransactionType } from "../models/transaction.model";

export class TransactionsValidatorMiddleware {
  public static userExist(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return RequestError.notProvided(
          res,
          "User"
        );
      }

      const database = new UserDatabase();
      const user = database.getUserId(userId);

      if (!user) {
        return RequestError.notFound(res, "user");
      }

      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
  public static validateMandatoryFields(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { title, value, type } = req.body;

      if (!title) {
        return RequestError.notProvided(
          res,
          "Title"
        );
      }

      if (!value) {
        return RequestError.notProvided(
          res,
          "Value"
        );
      }

      if (!type) {
        return RequestError.notProvided(
          res,
          "Type"
        );
      }

      if (
        type !== TransactionType.income &&
        type !== TransactionType.outcome
      ) {
        return res.status(400).send({
          ok: false,
          message:
            "Type is not valid. Must use income or outcome",
        });
      }

      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
