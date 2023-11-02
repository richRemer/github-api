import {Resource} from "./resource.js";
import {Repository} from "./repository.js";

export class User extends Resource {
  constructor(login, github=undefined) {
    super(`/users/${login}`, github);
    this.login = login;
  }

  /**
   * Iterate over repositories owned by this user.
   * @returns {Repository}
   */
  async *repositories() {
    const {login, github} = this;
    const uri = `${this.uri}/repos`;

    for await (const metadata of github.iterate(uri)) {
      const {name} = metadata;
      const repository = new Repository(login, name, github);

      yield Object.assign(repository, {metadata});
    }
  }
}
