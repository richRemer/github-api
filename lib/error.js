const configurable = true;
const enumerable = true;

/**
 * Error thrown when GitHub API returns error status.
 */
export class ResponseError extends Error {
  constructor(res, req={}) {
    const {status, statusText} = res;
    const {method, url} = req;

    super(`unexpected HTTP ${status} response`);

    Object.defineProperties(this, {
      status: {configurable, enumerable, value: status},
      statusText: {configurable, enumerable, value: statusText},
      method: {configurable, enumerable, value: method},
      url: {configurable, enumerable, value: url}
    });
  }
}
