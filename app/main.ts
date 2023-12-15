import { FontAwesomeIcon } from './app/fontawesome';
import VueDragscroll from 'vue-dragscroll';

import { createApp } from 'vue';
import router from './router/router';

import { createPinia } from 'pinia';
import Application from './App.vue';
import { syncPortraits } from './shared/breeds';

const app = createApp(Application);

syncPortraits();

app
  .use(createPinia())
  .use(router)
  .use(VueDragscroll)
  .component('FontAwesomeIcon', FontAwesomeIcon)
  .mount('body');
