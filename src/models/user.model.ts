import { v4 as createUuid } from "uuid";
import { Transaction } from "./transaction.model";

export class User {
  private _id: string;
  private _transactions: Transaction[];

  constructor(
    private _name: string,
    private _cpf: number,
    private _email: string,
    private _age: number
  ) {
    this._id = createUuid();
    this._transactions = [];
  }
  public get name() {
    return this._name;
  }
  public get cpf() {
    return this._cpf;
  }
  public get id() {
    return this._id;
  }
  public get email() {
    return this._email;
  }
  public get age() {
    return this._age;
  }
  public get transactions() {
    return this._transactions ?? [];
  }
  public set name(name: string) {
    this._name = name;
  }
  public set email(email: string) {
    this._email = email;
  }
  public set age(age: number) {
    this._age = age;
  }
  public set transactions(
    transactions: Transaction[]
  ) {
    this._transactions = transactions;
  }

  public addTransactions(
    transaction: Transaction
  ) {
    this.transactions.push(transaction);
  }
  public toJson() {
    return {
      id: this._id,
      nome: this._name,
      cpf: this._cpf,
      email: this._email,
      idade: this._age,
    };
  }
  public allToJson() {
    return {
      id: this._id,
      nome: this._name,
      cpf: this._cpf,
      email: this._email,
      idade: this._age,
      transacoes: this._transactions,
    };
  }
}
