import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueDragscroll from 'vue-dragscroll';
// @ts-expect-error No types available.
import VueRovingTabindex from '@4rk/vue-roving-tabindex';

import { createApp } from 'vue';
import router from './router/router';

import { createPinia } from 'pinia';
import Application from './App.vue';
import { injectBreedList } from './shared/breeds.js';

try {
  await injectBreedList();
} catch (error) {
  console.error('Failed to load breed definitions:', error);
}

createApp(Application)
  .use(createPinia())
  .use(router)
  .use(VueDragscroll)
  .use(VueRovingTabindex)
  .component('FontAwesomeIcon', FontAwesomeIcon)
  .mount('body');
