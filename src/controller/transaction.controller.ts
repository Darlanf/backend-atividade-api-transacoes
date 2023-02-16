import { Request, Response } from "express";
import { UserDatabase } from "../database/user.database";
import { RequestError } from "../errors/request.error";
import { ServerError } from "../errors/server.error";
import {
  Transaction,
  TransactionType,
} from "../models/transaction.model";
import { SuccessResponse } from "../util/success.response";

export class TransactionController {
  public listAll(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { title, type } = req.query;

      const database = new UserDatabase();
      const user = database.getUserId(userId);

      // if (!user) {
      //   return res.status(404).send({
      //     ok: false,
      //     message: "User was not found",
      //   });
      // }

      let transactionList = user!.transactions;

      const income = transactionList
        .filter(
          (transaction) =>
            transaction.type ===
            TransactionType.income
        )
        .reduce((init, current) => {
          return init + current.value;
        }, 0);
      const outcome = transactionList
        .filter(
          (transaction) =>
            transaction.type ===
            TransactionType.outcome
        )
        .reduce((init, current) => {
          return init + current.value;
        }, 0);

      const result = income - outcome;

      if (title) {
        transactionList = transactionList.filter(
          (transaction) =>
            transaction.title
              .toString()
              .toLowerCase() ===
            title.toString().toLowerCase()
        );
      }

      if (type) {
        transactionList = transactionList.filter(
          (transaction) =>
            transaction.type === type
        );
      }

      return SuccessResponse.ok(
        res,
        "Transactions successfully listed",
        {
          transactionList,
          Balance: { income, outcome, result },
        }
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public showOne(req: Request, res: Response) {
    try {
      const { userId, id } = req.params;
      const database = new UserDatabase();
      const user = database.getUserId(userId);

      // if (!user) {
      //   return res.status(404).send({
      //     ok: false,
      //     message: "User was not found",
      //   });
      // }

      const transaction = user!.transactions.find(
        (user) => user.id === id
      );

      if (!transaction) {
        return RequestError.notFound(
          res,
          "Transaction"
        );
      }

      return SuccessResponse.ok(
        res,
        "Transaction sucessfully obtained",
        transaction.toJson()
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public create(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { title, value, type } = req.body;
      const database = new UserDatabase();
      const user = database.getUserId(userId);

      // if (!user) {
      //   return res.status(404).send({
      //     ok: false,
      //     message: "User not found",
      //   });
      // }
      // if (!title) {
      //   return res.status(400).send({
      //     ok: false,
      //     message: "Title not provided",
      //   });
      // }
      // if (!value) {
      //   return res.status(400).send({
      //     ok: false,
      //     message: "Value not provided",
      //   });
      // }
      // if (!type) {
      //   return res.status(400).send({
      //     ok: false,
      //     message: "Type not provided",
      //   });
      // }
      // if (
      //   type !== TransactionType.income &&
      //   type !== TransactionType.outcome
      // ) {
      //   return res.status(400).send({
      //     ok: false,
      //     message:
      //       "Type is not valid. Must use income or outcome",
      //   });
      // }
      const transaction = new Transaction(
        title,
        value,
        type
      );
      // 1 - user.transactions = user.transactions.concat(transaction);
      // 2 - user.transactions.push(transaction)
      // 3 - user.transactions = [...user.transactions, transaction]
      user!.addTransactions(transaction);

      return SuccessResponse.create(
        res,
        "Transaction successfully created",
        [transaction.toJson(), user?.allToJson()]
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public delete(req: Request, res: Response) {
    try {
      const { userId, id } = req.params;
      const database = new UserDatabase();
      const user = database.getUserId(userId);

      // if (!user) {
      //   return res.status(404).send({
      //     ok: false,
      //     message: "User was not found",
      //   });
      // }

      if (!id) {
        return RequestError.notProvided(
          res,
          "Transaction"
        );
      }

      const transactionList = user!.transactions;

      const transactionIndex =
        transactionList.findIndex(
          (transaction) => transaction.id === id
        );

      if (transactionIndex < 0) {
        return RequestError.notFound(
          res,
          "Transaction"
        );
      }

      const transactionDeleted =
        transactionList.splice(
          transactionIndex,
          1
        );

      return SuccessResponse.ok(
        res,
        "Transaction successfully deleted",
        { transactionList, transactionDeleted }
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public update(req: Request, res: Response) {
    try {
      const { userId, id } = req.params;
      const { title, value, type } = req.body;

      const database = new UserDatabase();
      const user = database.getUserId(userId);

      // if (!user) {
      //   return res.status(404).send({
      //     ok: false,
      //     message: "User was not found",
      //   });
      // }

      const transactionList = user!.transactions;

      const transaction = transactionList.find(
        (transaction) => transaction.id === id
      );

      if (!transaction) {
        return RequestError.notFound(
          res,
          "Transaction"
        );
      }

      if (title) {
        transaction.title = title;
      }
      if (value) {
        transaction.value = value;
      }
      if (type && type in TransactionType) {
        transaction.type = type;
      }

      return SuccessResponse.ok(
        res,
        "Transaction sucessfully updated",
        { transaction, transactionList }
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
