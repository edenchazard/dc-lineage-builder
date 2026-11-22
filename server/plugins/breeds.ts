import { injectBreedList } from '../../app/shared/breeds.js';

// Nitro's plugin type only allows a void return, but the returned promise is honoured.
export default defineNitroPlugin(() => {
  // Breed data must be loaded before any validation/schema runs on the server.
  return injectBreedList();
});
