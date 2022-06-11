import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from "./routes";

const router = new VueRouter({
    base: process.env.VUE_APP_URL,
    mode: 'history',
    routes: routes
});

Vue.use(VueRouter);

export {
    router,
    VueRouter
};