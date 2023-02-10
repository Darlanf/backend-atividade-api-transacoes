import { Router } from "express";
import { TransactionController } from "../controller/transaction.controller";
import { UserController } from "../controller/user.controller";
import { CpfValidatorMiddleware } from "../middlewares/cpf-validator.middleware";
import { TransactionsValidatorMiddleware } from "../middlewares/transactions-validator.middleware";

// http://localhost:3333/users
export const usersRoutes = () => {
  const app = Router();

  // GET ALL USERS http://localhost:3333/users
  app.get("/", new UserController().listAll);

  // GET ONE USER http://localhost:3333/users/:id
  app.get("/:id", new UserController().showOne);

  // POST http://localhost:3333/users
  app.post(
    "/",
    [
      CpfValidatorMiddleware.isCpfValid,
      CpfValidatorMiddleware.cpfAlreadyExist,
    ],
    new UserController().create
  );

  // DELETE http://localhost:3333/users/:id
  app.delete("/:id", new UserController().delete);

  // PUT http://localhost:3333/users/:id
  app.put("/:id", new UserController().update);

  // POST http://localhost:3333/users/:userId/transactions
  app.post(
    "/:userId/transactions",
    [
      TransactionsValidatorMiddleware.userExist,
      TransactionsValidatorMiddleware.validateMandatoryFields,
    ],
    new TransactionController().create
  );

  // GET http://localhost:3333/users/:userId/transactions/:id
  app.get(
    "/:userId/transactions/:id",
    TransactionsValidatorMiddleware.userExist,
    new TransactionController().showOne
  );

  // GET http://localhost:3333/users/:userId/transactions
  app.get(
    "/:userId/transactions",
    TransactionsValidatorMiddleware.userExist,
    new TransactionController().listAll
  );

  // DELETE http://localhost:3333/users/:userId/transactions/:id
  app.delete(
    "/:userId/transactions/:id",
    TransactionsValidatorMiddleware.userExist,
    new TransactionController().delete
  );

  // PUT http://localhost:3333/users/:userId/transactions/:id
  app.put(
    "/:userId/transactions/:id",
    TransactionsValidatorMiddleware.userExist,
    new TransactionController().update
  );

  app.all("/*", (req, res) => {
    return res.status(500).send({
      ok: false,
      message: "rota não encontrada",
    });
  });

  return app;
};
