import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes.js';

let hasNavigated = false;

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { left: 0, top: 0 };
  },
});

router.afterEach((route) => {
  const pageName = route.name?.toString();
  document.title = (pageName ? `${pageName} | ` : '') + 'Lineage Builder';

  if (!hasNavigated) {
    hasNavigated = true;
    return;
  }

  setTimeout(() => {
    const h1 = document.querySelector('h1');

    if (!h1) return;

    h1.tabIndex = -1;
    h1.focus();
  }, 50);
});

export default router;
