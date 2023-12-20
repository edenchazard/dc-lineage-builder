import type { Context } from 'koa';

export interface RequestResponse {
  errors: { type: 'Warning' | 'Error'; message: string }[];
  data: Record<string, unknown>;
}

export interface RequestContext extends Context {
  body: Record<string, unknown>;
}
