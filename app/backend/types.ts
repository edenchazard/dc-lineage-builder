import type { Context } from 'koa';

export type DragonData = {
  id: string;
  name: string;
  owner: string;
  start: string;
  hatch: string;
  grow: string;
  death: string;
  views: number;
  unique: number;
  clicks: number;
  gender: 'Male' | 'Female';
  acceptaid: boolean;
  hoursleft: number;
  parent_f: string;
  parent_m: string;
};

export type GetDragonsBulkResponse = DragCaveApiResponse<{
  hasNextPage: boolean;
  endCursor: null | number;
}> & {
  dragons: Record<string, DragonData>;
};

export interface DragCaveApiResponse<Data extends Record<string, unknown>> {
  errors: Array<[number, string]>;
  data: Data;
}

export type RequestContext = Context & {
  request: {
    body: {
      errors?: { type: 'Warning' | 'Error'; message: string }[];
      [x: string]: unknown;
    };
  };
};
