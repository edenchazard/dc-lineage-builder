import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    name: 'Error',
    component: () => import('../pages/errors/404.vue'),
  },
  {
    path: '/',
    name: 'Build',
    component: () => import('../pages/Builder.vue'),
  },
  {
    path: '/view/:hash',
    name: 'Viewing Lineage',
    component: () => import('../pages/LineageView.vue'),
  },
  {
    path: '/how-to',
    name: 'How to Use',
    redirect: '/tutorial',
  },
  {
    path: '/disclaimer',
    name: 'Disclaimer',
    component: () => import('../pages/Disclaimer.vue'),
  },
  {
    path: '/checkers',
    name: 'Checker Generator',
    component: () => import('../pages/CheckerGenerator.vue'),
  },
  {
    path: '/ghost-breeds',
    name: 'Ghost Breeds',
    component: () => import('../pages/GhostBreeds.vue'),
  },
  {
    path: '/onsite-preview',
    name: 'Onsite Preview',
    component: () => import('../pages/OnsitePreview.vue'),
  },
  {
    path: '/tutorial',
    name: 'Tutorial',
    component: () => import('../pages/Tutorial.vue'),
  },
];

export default routes;
