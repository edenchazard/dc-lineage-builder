import VueDragscroll from 'vue-dragscroll';
// @ts-expect-error No types available.
import VueRovingTabindex from '@4rk/vue-roving-tabindex';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueDragscroll);
  nuxtApp.vueApp.use(VueRovingTabindex);
});
