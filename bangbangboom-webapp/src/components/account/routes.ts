import { RouteConfig } from 'vue-router';
import account from './account.vue'
import register from './register.vue'
import confirmemail from './confirmemail.vue'
import forgotpass from './forgotpass.vue'
import resetpass from './resetpass.vue'

import mapupload from '@/components/mapupload.vue'
import musicupload from '@/components/musicupload.vue'
import { userstate } from './state';


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
}, {
    path: '/uploadmap',
    component: mapupload,
    beforeEnter: (to, from, next) => {
        if (!userstate.loginstate) next("/account")
        else next()
    },
}, {
    path: '/uploadmusic',
    component: musicupload,
    beforeEnter: (to, from, next) => {
        if (!userstate.loginstate) next("/account")
        else next()
    },
},
]
