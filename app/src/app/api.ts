import axios, { AxiosError } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import type { PartialLineage } from '../../../shared/types';

interface APIResponse {
  errors: Array<{ type: 'Warning' | 'Error'; message: string }>;
  data: null | Record<string, unknown>;
}

const http = axios.create({
  method: 'get',
  baseURL: import.meta.env.BASE_URL + 'api',
});

async function callAPI<T>(url: string, options: AxiosRequestConfig = {}) {
  if ('url' in options)
    throw new Error('options parameter should not contain url');

  try {
    // url comes last to prevent it being overwritten via options
    return await http.request<T>({ ...options, url });
  } catch (ex) {
    let error = `Sorry, an error has occurred while contacting the server.`;
    // server responded with error
    if (ex instanceof AxiosError && typeof ex.response === 'object') {
      error += ` Error: ${ex.response.status} ${ex.response.statusText}`;
    }
    // other
    throw new Error(error);
  }
}

interface LineageResponse extends APIResponse {
  data: {
    lineage: PartialLineage;
  };
}
async function getLineage(hash: string) {
  return (await callAPI<LineageResponse>(`/lineage/${hash}`)).data;
}

interface LineageGenerationResponse extends APIResponse {
  data: {
    hash: string;
  };
}
async function saveLineage(tree: PartialLineage) {
  return (
    await callAPI<LineageGenerationResponse>('/lineage/create', {
      method: 'post',
      data: tree,
    })
  ).data;
}

interface OnSitePreviewResponse extends APIResponse {
  data: {
    dragons: {
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
    };
  };
}
function getOnSitePreview(
  male: string,
  female: string,
  doChecks: boolean = false,
) {
  return callAPI<OnSitePreviewResponse>(`/onsite-preview`, {
    method: 'post',
    data: {
      male,
      female,
      doChecks,
    },
  });
}

export {
  http as backendAxios,
  callAPI,
  getLineage,
  saveLineage,
  getOnSitePreview,
};
