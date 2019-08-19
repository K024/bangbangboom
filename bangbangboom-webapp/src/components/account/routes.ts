import { RouteConfig } from 'vue-router';
import account from '@/components/account/account.vue'
import register from '@/components/account/register.vue'
import confirmemail from '@/components/account/confirmemail.vue'
import forgotpass from '@/components/account/forgotpass.vue'
import resetpass from '@/components/account/resetpass.vue'

export const accountRoutes: RouteConfig[] = [{
    path: '/account',
    component: account,
    meta: { title: "w.account" },
}, {
    path: '/account/register',
    component: register,
    meta: { title: "w.register" },
}, {
    path: '/account/confirmemail',
    component: confirmemail,
    meta: { title: "w.register" },
}, {
    path: '/account/forgotpass',
    component: forgotpass,
    meta: { title: "w.forgotpass" },
}, {
    path: '/account/resetpass',
    component: resetpass,
    meta: { title: "w.forgotpass" },
},
]
