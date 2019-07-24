import Vue from "vue";
import Router from "vue-router";
import home from '@/components/home.vue'
import notfound from '@/components/notfound.vue'
import account from '@/components/account/account.vue'
import register from '@/components/account/register.vue'
import confirmemail from '@/components/account/confirmemail.vue'
import forgotpass from '@/components/account/forgotpass.vue'
import resetpass from '@/components/account/resetpass.vue'

Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            component: home,
        }, {
            path: '/account',
            component: account,
        }, {
            path: '/register',
            component: register
        }, {
            path: '/confirmemail',
            component: confirmemail
        }, {
            path: '/forgotpass',
            component: forgotpass
        }, {
            path: '/resetpass',
            component: resetpass
        }, {
            path: '*',
            component: notfound,
        }
    ],
});
