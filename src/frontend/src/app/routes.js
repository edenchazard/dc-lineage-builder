export default [
    { 
        path: '/',
        name: "Build",
        component: () => import(/* webpackChunkName: "builder" */'../pages/PageBuilder.vue')
    },
    {
        path: '/view/:hash',
        name: "Viewing Lineage",
        component: () => import(/* webpackChunkName: "view" */"../pages/PageView.vue")
    },
    {
        path: '/how-to',
        name: "How to Use",
        component: () => import(/* webpackChunkName: "how-to" */'../pages/PageHowTo.vue')
    },
    {
        path: '/disclaimer',
        name: "Disclaimer",
        component: () => import(/* webpackChunkName: "disclaimer" */'../pages/PageDisclaimer.vue')
    },
    {
        path: '/checkers',
        name: "Checker Generator",
        component: () => import(/* webpackChunkName: "checker-gen" */'../pages/PageCheckerGen.vue')
    },
    {
        path: '/ghost-breeds',
        name: "Ghost Breeds",
        component: () => import(/* webpackChunkName: "ghost-breeds" */'../pages/PageGhostBreeds.vue')
    },
    {
        path: '*',
        name: "Error",
        component: () => import(/* webpackChunkName: "error" */'../pages/PageError.vue')
    }
];