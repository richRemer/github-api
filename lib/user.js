import {Resource} from "./resource.js";

export class User extends Resource {
  constructor(login, github=undefined) {
    super(`/users/${login}`, github);
    this.login = login;
  }
}
