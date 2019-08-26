import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/container/home/index.vue')
    }
];

export default new VueRouter({
    mode: 'history',
    routes: routes
});
