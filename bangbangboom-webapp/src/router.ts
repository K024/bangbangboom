import Vue from "vue";
import Router from "vue-router";
import home from '@/components/home.vue'
import notfound from '@/components/notfound.vue'
import account from '@/components/account/account.vue'

Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            component: home,
        },
        {
            path: '/account',
            component: account,
            children: [],
        },
        {
            path: '*',
            component: notfound,
        }
    ],
});
