import { User } from "../models/user.model";
import { users } from "./users";

export class UserDatabase {
  public list() {
    return [...users];
  }
  public getUserId(id: string) {
    return users.find((user) => user.id === id);
  }
  public getUserCpf(cpf: number) {
    return users.find((user) => user.cpf === cpf);
  }
  public getUserIndex(id: string) {
    return users.findIndex(
      (user) => user.id === id
    );
  }
  public create(user: User) {
    users.push(user);
  }
  public delete(index: number) {
    users.splice(index, 1);
  }
}
