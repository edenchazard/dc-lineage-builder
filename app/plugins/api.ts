export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  // Nuxt mounts server routes under app.baseURL, so keep the client and SSR
  // fetcher in sync with the runtime-configured mount path.
  const api = $fetch.create({
    baseURL: `${config.app.baseURL}api`,
  });

  return {
    provide: { api },
  };
});
