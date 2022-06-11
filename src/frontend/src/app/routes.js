import PageView from "../pages/PageView.vue";
import PageBuilder from '../pages/PageBuilder.vue';
import PageError from '../pages/PageError.vue';
import PageHowTo from '../pages/PageHowTo.vue';
import PageDisclaimer from '../pages/PageDisclaimer.vue';
import PageCheckerGen from '../pages/PageCheckerGen.vue';
import PageGhostBreeds from '../pages/PageGhostBreeds.vue';

export default [
    { 
        path: '/',
        name: "Build",
        component: PageBuilder
    },
    {
        path: '/view/:hash',
        name: "Viewing Lineage",
        component: PageView
    },
    {
        path: '/how-to',
        name: "How to Use",
        component: PageHowTo
    },
    {
        path: '/disclaimer',
        name: "Disclaimer",
        component: PageDisclaimer
    },
    {
        path: '/checkers',
        name: "Checker Generator",
        component: PageCheckerGen
    },
    {
        path: '/ghost-breeds',
        name: "Ghost Breeds",
        component: PageGhostBreeds
    },
    {
        path: '*',
        name: "Error",
        component: PageError
    }
];


/*
const routes = [
    { path: '/', name: "Build", component: () => import('@/pages/PageBuilder') },
    { path: '/view/:hash', name: "Viewing Lineage", component: () => import('@/pages/PageView') },
    { path: '/how-to', name: "How to Use", component: () => import('@/pages/PageHowTo') },
    { path: '/disclaimer', name: "Disclaimer", component: () => import('@/pages/PageDisclaimer') },
    { path: '*', name: "Error", component: () => import('@/pages/PageError') }
];
*/
