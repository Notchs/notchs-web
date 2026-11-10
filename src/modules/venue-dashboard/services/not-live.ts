/** A screen or action the real API doesn't offer yet. Screens show "Opens
 * soon" for it instead of an error, and never fall back to example data. */
export class NotLiveError extends Error {
  constructor(what: string) {
    super(`${what} isn't available yet`);
    this.name = "NotLiveError";
  }
}

export const notLive = (what: string) => () =>
  Promise.reject(new NotLiveError(what));
