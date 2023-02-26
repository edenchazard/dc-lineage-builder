import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    name: 'Error',
    component: () => import('../pages/PageError.vue'),
  },
  {
    path: '/',
    name: 'Build',
    component: () => import('../pages/PageBuilder.vue'),
  },
  {
    path: '/view/:hash',
    name: 'Viewing Lineage',
    component: () => import('../pages/PageView.vue'),
  },
  {
    path: '/how-to',
    name: 'How to Use',
    component: () => import('../pages/PageHowTo.vue'),
  },
  {
    path: '/disclaimer',
    name: 'Disclaimer',
    component: () => import('../pages/PageDisclaimer.vue'),
  },
  {
    path: '/checkers',
    name: 'Checker Generator',
    component: () => import('../pages/PageCheckerGen.vue'),
  },
  {
    path: '/ghost-breeds',
    name: 'Ghost Breeds',
    component: () => import('../pages/PageGhostBreeds.vue'),
  },
  {
    path: '/onsite-preview',
    name: 'Onsite Preview',
    component: () => import('../pages/PageOnsitePreview.vue'),
  },
];

export default routes;
