import {Resource} from "./resource.js";

export class Repository extends Resource {
  constructor(login, name, github=undefined) {
    super(`/repos/${login}/${name}`, github);
    this.login = login;
    this.name = name;
  }

  /**
   * Download repository tarball.
   * @returns {Readable}
   */
  async downloadTarball() {
    const uri = `${this.uri}/tarball`;
    return this.github.download(uri);
  }
}
