/** Options accepted by the JSON fetcher provided in `app/plugins/api.ts`. */
export interface APIFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
  body?: unknown;
  query?: Record<string, unknown>;
  headers?: Record<string, string>;
}

/** The plain JSON fetcher exposed as `$api` by the api plugin. */
export interface APIFetch {
  <T>(url: string, options?: APIFetchOptions): Promise<T>;
}

declare module '#app' {
  interface NuxtApp {
    $api: APIFetch;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: APIFetch;
  }
}
