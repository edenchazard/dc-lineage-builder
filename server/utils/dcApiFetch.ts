import { ofetch } from 'ofetch';

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

export function createDcApiFetch() {
  const config = useRuntimeConfig();
  
  return ofetch.create({
    baseURL: 'https://dragcave.net/api/v2',
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${config.clientSecret}`,
    },
  });
}

// For compatibility with existing code that expects dcApiFetch to be available
export const dcApiFetch = createDcApiFetch;
