import type { Context } from 'koa';

export type RequestContext = Context & {
  request: {
    body: {
      errors?: { type: 'Warning' | 'Error'; message: string }[];
      [x: string]: unknown;
    };
  };
};
