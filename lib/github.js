import fetch from "node-fetch";
import Link from "http-link-header";
import {ResponseError} from "./error.js";

export class GitHub {
  constructor({
    endpoint="https://api.github.com",
    version="2022-11-28",
    headers={
      "X-GitHub-Api-Version": version
    }
  }={}) {
    this.endpoint = endpoint;
    this.headers = {...headers};
  }

  /**
   * Authenticate with GitHub using bearer token.  Call without argument to
   * logout.
   * @param {string} [token]
   */
  authenticate(token) {
    if (token) {
      this.headers.Authorization = `Bearer ${token}`;
    } else {
      Object.keys(this.headers)
        .filter(key => /authorization/i.test(key))
        .forEach(key => delete this.headers[key]);
    }
  }

  /**
   * Download resource from GitHub API.
   * @param {string} uri
   * @returns {Readable}
   */
  async download(uri) {
    const res = await this.request("GET", uri);
    return res.body;
  }

  /**
   * Make GET request to GitHub API.
   * @param {string} uri
   * @returns {string|object}
   */
  async get(uri) {
    const res = await this.request("GET", uri);
    const type = res.headers.get("Content-Type");

    if (type.startsWith("application/json")) {
      return res.json();
    } else if (type.startsWith("text/")) {
      return res.text();
    } else {
      return res.blob();
    }
  }

  /**
   * Return standard headers for request.
   * @returns {object}
   */
  getHeaders() {
    return {...this.headers, Accept: "application/json"};
  }

  /**
   * Make request to GitHub API and iterate over results with support for
   * pagination.
   * @return {object}
   */
  async *iterate(uri) {
    let next = uri;

    while (next) {
      const res = await this.request("GET", next);
      const links = Link.parse(res.headers.get("Link") || "");

      next = links.rel("next")[0]?.uri;
      yield* await res.json();
    }
  }

  /**
   * Make HTTP request to GitHub API.
   * @param {string} method
   * @param {string} uri
   * @param {string} [body]
   * @returns {Response}
   */
  async request(method, uri, body=undefined) {
    const url = new URL(uri, this.endpoint);
    const headers = this.getHeaders();
    const res = await fetch(url, {method, headers, body});

    if (!res.ok) {
      throw new ResponseError(res, {method, url});
    }

    return res;
  }
}
