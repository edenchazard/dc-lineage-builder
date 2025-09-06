export type ErrorArray = { type: 'warning' | 'error'; message: string }[];

export class ServerError extends Error {
  public errors: ErrorArray = [];

  constructor(errors: ErrorArray) {
    super('Server Error');
    this.name = 'ServerError';
    this.errors = errors;
  }
}
