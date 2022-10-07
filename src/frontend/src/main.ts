import { FontAwesomeIcon } from './app/fontawesome';
import VirtualCollection from "vue-virtual-collection";

import { createApp } from 'vue';
import router from "./router/router";

import { createPinia } from 'pinia'
import App from "./App.vue";

createApp(App)
    .use(createPinia())
    .use(router)
    //.use(bubblePlugin)
    // components
    .use(VirtualCollection)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app');
