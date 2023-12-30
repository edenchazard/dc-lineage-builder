import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes.js';

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
});

export default router;
