import { injectBreedList } from '~/shared/breeds.js';

export default defineNuxtPlugin(async () => {
  // The breed table must be populated before any page or API validation runs.
  await injectBreedList();
});
