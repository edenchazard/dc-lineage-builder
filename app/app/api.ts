import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import type { PartialLineage } from '../shared/types';

interface APIResponse {
  errors: Array<{ type: 'warning' | 'error'; message: string }>;
}

const http = axios.create({
  method: 'get',
  baseURL: import.meta.env.VITE_API_URL,
});

function callAPI<T>(url: string, options: AxiosRequestConfig = {}) {
  if ('url' in options)
    throw new Error('options parameter should not contain url');

  // url comes last to prevent it being overwritten via options
  return http.request<T>({
    ...options,
    url,
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
    method: 'post',
    data: {
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
    method: 'post',
    data: {
      male,
      female,
      options: {
        dpr: 1,
        ...options,
      },
    },
  });
}

export { callAPI, getLineage, saveLineage, getOnSitePreview };
