import { FontAwesomeIcon } from './app/fontawesome';
import VueDragscroll from 'vue-dragscroll';

import { createApp } from 'vue';
import router from './router/router';

import { createPinia } from 'pinia';
import Application from './App.vue';

const app = createApp(Application);

app
  .use(createPinia())
  .use(router)
  .use(VueDragscroll)
  .component('FontAwesomeIcon', FontAwesomeIcon)
  .mount('body');
