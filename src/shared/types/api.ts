/** Success envelope returned by the backend. `data` is omitted when empty. */
export type ApiSuccess<T = undefined> = {
  success: true;
  message: string;
  data?: T;
};

export type ApiErrorBody = {
  code: string;
  message: string;
  details?: unknown;
};

/** Error envelope returned by the backend for every failed request. */
export type ApiFailure = {
  success: false;
  error: ApiErrorBody;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
};
