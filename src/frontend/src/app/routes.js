import PageView from '@/pages/PageView';
import PageBuilder from '@/pages/PageBuilder';
import PageError from '@/pages/PageError';
import PageHowTo from '@/pages/PageHowTo';
import PageDisclaimer from '@/pages/PageDisclaimer';
import PageCheckerGen from '@/pages/PageCheckerGen';

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
