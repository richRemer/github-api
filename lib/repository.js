import {Resource} from "./resource.js";

export class Repository extends Resource {
  constructor(login, name, github=undefined) {
    super(`/repos/${login}/${name}`, github);
    this.login = login;
    this.name = name;
  }
}
