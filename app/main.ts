import { FontAwesomeIcon } from './app/fontawesome';
// @ts-expect-error No types available.
import VueRovingTabindex from '@4rk/vue-roving-tabindex';

import { createApp } from 'vue';
import router from './router/router';

import { createPinia } from 'pinia';
import Application from './App.vue';

const app = createApp(Application);

app
  .use(createPinia())
  .use(router)
  .use(VueRovingTabindex)
  .component('FontAwesomeIcon', FontAwesomeIcon)
  .mount('body');
