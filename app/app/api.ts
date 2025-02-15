import { ofetch, type FetchOptions } from 'ofetch';
import type { PartialLineage } from '../shared/types';

interface APIResponse {
  errors: Array<{ type: 'warning' | 'error'; message: string }>;
}

async function callAPI<T>(url: string, options: FetchOptions<'json'> = {}) {
  if ('url' in options)
    throw new Error('options parameter should not contain url');

  // url comes last to prevent it being overwritten via options
  return ofetch<T>(url, {
    ...options,
    baseURL: import.meta.env.VITE_API_URL,
  });
}

interface LineageResponse extends APIResponse {
  lineage: PartialLineage;
}

function getLineage(hash: string) {
  return callAPI<LineageResponse>(`/lineage/${hash}`);
}

interface LineageGenerationResponse extends APIResponse {
  hash: string;
}

function saveLineage(tree: PartialLineage) {
  return callAPI<LineageGenerationResponse>('/lineage', {
    method: 'POST',
    body: {
      lineage: tree,
    },
  });
}

interface OnSitePreviewResponse extends APIResponse {
  male: {
    code: string;
    html: string;
    gen: number;
  };
  female: {
    code: string;
    html: string;
    gen: number;
  };
}
function getOnSitePreview(
  male: string,
  female: string,
  options?: { dpr: number },
) {
  return callAPI<OnSitePreviewResponse>(`/onsite`, {
    method: 'POST',
    body: {
      male,
      female,
      options: {
        dpr: 1,
        ...options,
      },
    },
  });
}

interface BulkCodesResponse extends APIResponse {
  dragons: Record<string, string[]>;
}

function getInbred(codes: string[]) {
  return callAPI<BulkCodesResponse>('/onsite/inbred', {
    method: 'POST',
    body: {
      codes,
    },
  });
}

export { callAPI, getLineage, saveLineage, getOnSitePreview, getInbred };
