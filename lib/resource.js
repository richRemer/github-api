import {GitHub} from "./github.js";

export class Resource {
  constructor(uri, github=new GitHub()) {
    this.uri = uri;
    this.github = github;
  }

  /**
   * Return metadata for resource.  If metadata has already been fetched,
   * return cached data.  Otherwise, fetch metadata from API endpoint.
   * @returns {object}
   */
  async readMetadata() {
    if (!this.metadata) {
      await this.refreshMetadata();
    }

    return this.metadata;
  }

  /**
   * Refresh metadata cache for resource by fetching from API endpoint.
   */
  async refreshMetadata() {
    this.metadata = await this.github.get(this.uri);
  }
}
