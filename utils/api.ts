import type { PartialLineage } from './types';

interface APIResponse {
  errors: Array<{ type: 'warning' | 'error'; message: string }>;
}

async function callAPI<T>(url: string, options: any = {}) {
  const config = useRuntimeConfig();
  
  // Use Nuxt's built-in $fetch which is available both on client and server
  return $fetch<T>(url, {
    ...options,
    baseURL: `${config.public.baseUrl}/api`,
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

export interface InbredCheckResponse extends APIResponse {
  checks: {
    code: string;
    name: string | null;
    failed: number;
    problems: {
      code: string;
      name: string | null;
      conflicts: string[];
      observable: boolean;
    }[];
    selfProblems: {
      code: string;
      name: string | null;
      observable: boolean;
    }[];
  }[];
}

function getInbred(codes: string[]) {
  return callAPI<InbredCheckResponse>('/onsite/inbred', {
    method: 'POST',
    body: {
      codes,
    },
  });
}

export { callAPI, getLineage, saveLineage, getOnSitePreview, getInbred };
