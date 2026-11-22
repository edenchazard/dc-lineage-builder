import { ValidationError } from 'yup';

export type ErrorArray = { type: 'warning' | 'error'; message: string }[];
export type ApiErrors = ErrorArray | string[];
type Event = InstanceType<typeof H3Event>;

export class ServerError extends Error {
  public readonly statusCode: number;
  public readonly errors: ErrorArray;

  constructor(statusCode: number, errors: ErrorArray) {
    super(`Server Error (${statusCode})`);
    this.name = 'ServerError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export function abort(statusCode: number, errors: ErrorArray): never {
  throw new ServerError(statusCode, errors);
}

/**
 * Converts thrown service errors into the JSON error shape used by the app.
 * Kept in one place so every API route responds consistently.
 */
export function handleApiError(
  event: Event,
  err: unknown,
): { errors: ApiErrors } {
  if (err instanceof ValidationError) {
    setResponseStatus(event, 422);
    return { errors: err.errors };
  }

  if (err instanceof ServerError) {
    setResponseStatus(event, err.statusCode);
    return { errors: err.errors };
  }

  console.error(err);
  setResponseStatus(event, 500);
  return {
    errors: [{ type: 'error', message: 'Sorry, an error has occurred :(' }],
  };
}
