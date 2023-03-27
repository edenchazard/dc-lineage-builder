import * as compat from './compatibility';
import { FontAwesomeIcon } from './app/fontawesome';
import { createApp } from 'vue';
import router from './router/router';

import { createPinia } from 'pinia';
import App from './App.vue';

createApp(App)
  .use(createPinia())
  .use(router)
  //.use(bubblePlugin)
  // components
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');
