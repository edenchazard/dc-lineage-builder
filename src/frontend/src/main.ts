import { FontAwesomeIcon } from './app/fontawesome';
import { createApp } from 'vue';
import router from './router/router';

import { createPinia } from 'pinia';
import App from './App.vue';

createApp(App)
  .use(createPinia())
  .use(router)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('body');
