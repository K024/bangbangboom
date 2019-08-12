import Vue from "vue"
import Router, { RouteConfig } from "vue-router"
import i18n from "@/plugins/i18n"
import home from '@/components/home.vue'
import notfound from '@/components/notfound.vue'
import account from '@/components/account/account.vue'
import register from '@/components/account/register.vue'
import confirmemail from '@/components/account/confirmemail.vue'
import forgotpass from '@/components/account/forgotpass.vue'
import resetpass from '@/components/account/resetpass.vue'
import mapping from '@/game/mapping/mapping.vue'

Vue.use(Router);

const accountRoutes: RouteConfig[] = [{
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

export const router = new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            component: home,
        },
        ...accountRoutes
        , {
            path: '/mapping',
            component: mapping,
            meta: { title: "w.mapping" },
        }, {
            path: '*',
            component: notfound,
            meta: { title: "s.notfound" },
        }
    ],
});

export const title = new Vue({
    data: function () {
        return {
            title: "",
            suffix: " - bangbangboom",
            fallback: "bangbangboom",
        }
    },
    computed: {
        fulltitle(): string {
            if (!this.title) {
                return this.fallback
            }
            return i18n.t(this.title) + this.suffix
        }
    },
    watch: {
        fulltitle: {
            immediate: true,
            handler: function (newtitle) {
                document.title = newtitle
            }
        }
    }
})

router.afterEach(to => {
    title.title = to.meta && to.meta.title || ""
})

export default router
