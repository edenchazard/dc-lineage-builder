import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    name: 'Error',
    component: () => import('../pages/PageErrors/PageError404.vue'),
  },
  {
    path: '/',
    name: 'Build',
    component: () => import('../pages/PageBuilder/index.vue'),
  },
  {
    path: '/view/:hash',
    name: 'Viewing Lineage',
    component: () => import('../pages/PageView/index.vue'),
  },
  {
    path: '/how-to',
    name: 'How to Use',
    component: () => import('../pages/PageTutorial/index.vue'),
  },
  {
    path: '/disclaimer',
    name: 'Disclaimer',
    component: () => import('../pages/PageDisclaimer/index.vue'),
  },
  {
    path: '/checkers',
    name: 'Checker Generator',
    component: () => import('../pages/PageCheckerGen/index.vue'),
  },
  {
    path: '/ghost-breeds',
    name: 'Ghost Breeds',
    component: () => import('../pages/PageGhostBreeds/index.vue'),
  },
  {
    path: '/onsite-preview',
    name: 'Onsite Preview',
    component: () => import('../pages/PageOnsitePreview/index.vue'),
  },
];

export default routes;
