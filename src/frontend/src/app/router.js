import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from "@/app/routes";

const router = new VueRouter({
    base: process.env.BASEURL,
    mode: 'history',
    routes: routes
});

Vue.use(VueRouter);

export {
    router as router,
    VueRouter as VueRouter
};