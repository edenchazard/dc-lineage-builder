import Vue from 'vue';
import App from '@/App';
import { router } from '@/app/router';
import { FontAwesomeIcon } from '@/app/fontawesome';
import { store } from '@/app/store';

// vue settings
Vue.config.productionTip = false;

// Add Font Awesome
Vue.component('font-awesome-icon', FontAwesomeIcon);

// bubble plugin via https://stackoverflow.com/a/54940012
// Add this as a Vue plugin
Vue.use((Vue) => {
  Vue.prototype.$bubble = function $bubble(eventName, ...args) {
    // Emit the event on all parent components
    let component = this;
    do {
      component.$emit(eventName, ...args);
      component = component.$parent;
    } while (component);
  };
});

new Vue({
  router,
  store,
  render(createElement) {
      return createElement(App);
  }
}).$mount('#app');