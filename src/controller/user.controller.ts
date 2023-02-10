import { Request, Response } from "express";
import { User } from "../models/user.model";
import { UserDatabase } from "../database/user.database";
import { SuccessResponse } from "../util/success.response";
import { ServerError } from "../errors/server.error";
import { RequestError } from "../errors/request.error";

export class UserController {
  public listAll(req: Request, res: Response) {
    try {
      const { name, email, cpf } = req.query;

      const database = new UserDatabase();
      let usersList = database.list();

      if (name) {
        usersList = usersList.filter((user) => {
          return (
            user.name.toString().toLowerCase() ===
            name.toString().toLowerCase()
          );
        });
      }
      if (email) {
        usersList = usersList.filter(
          (user) => user.email === email
        );
      }
      if (cpf) {
        usersList = usersList.filter(
          (user) => user.cpf === Number(cpf)
        );
      }

      const users = usersList.map((user) =>
        user.toJson()
      );

      return SuccessResponse.ok(
        res,
        "Users successfully listed",
        users
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public showOne(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const database = new UserDatabase();
      const user = database.getUserId(id);

      if (!user) {
        return RequestError.notFound(res, "User");
      }

      return SuccessResponse.ok(
        res,
        "User successfully obtained",
        user.toJson()
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public create(req: Request, res: Response) {
    try {
      const { name, cpf, email, age } = req.body;

      if (!name) {
        return RequestError.notProvided(
          res,
          "Name"
        );
      }
      // if (!cpf) {
      //   return res.status(400).send({
      //     ok: false,
      //     message: "cpf was not provided",
      //   });
      // }
      if (!email) {
        return RequestError.notProvided(
          res,
          "Email"
        );
      }
      if (!age) {
        return RequestError.notProvided(
          res,
          "Age"
        );
      }
      const database = new UserDatabase();
      const userCpf = database.getUserCpf(cpf);

      // if (userCpf) {
      //   return res.status(400).send({
      //     ok: false,
      //     message: "User already exists",
      //   });
      // }
      const newUser = new User(
        name,
        cpf,
        email,
        age
      );

      database.create(newUser);

      return SuccessResponse.create(
        res,
        "User successfully created",
        newUser.toJson()
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const database = new UserDatabase();
      const userIndex = database.getUserIndex(id);

      if (userIndex < 0) {
        return res.status(404).send({
          ok: false,
          message: "User not found",
        });
      }
      database.delete(userIndex);

      return SuccessResponse.ok(
        res,
        "User successfully deleted",
        userIndex
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, age } = req.body;

      const database = new UserDatabase();
      const user = database.getUserId(id);

      if (!user) {
        return RequestError.notFound(res, "User");
      }
      if (name) {
        user.name = name;
      }
      if (email) {
        user.email = email;
      }
      if (age) {
        user.age = age;
      }

      return SuccessResponse.ok(
        res,
        "User successfully update",
        user.toJson()
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
