import axios, { AxiosRequestConfig } from 'axios';
import { DragonType, LineageRoot } from './types';

interface APIResponse {
  errors: Array<{ type: 'Warning' | 'Error'; message: string }>;
  data: null | Object;
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
    const standardResponse = `Sorry, an error has occurred while contacting the server.`;
    // server responded with error
    if (ex.response)
      throw new Error(
        `${standardResponse} Error: ${ex.response.status} ${ex.response.statusText}`,
      );
    // other
    throw new Error(standardResponse);
  }
}

interface LineageResponse extends APIResponse {
  data: {
    lineage: DragonType;
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
async function saveLineage(tree: LineageRoot) {
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
