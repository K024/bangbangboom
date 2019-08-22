import Vue from "vue"
import Router, { RouteConfig } from "vue-router"
import i18n from "@/plugins/i18n"
import home from '@/components/home.vue'
import notfound from '@/components/others/notfound.vue'
// import mapping from '@/game/mapping/mapping.vue'
import { accountRoutes } from './components/account/routes';

Vue.use(Router);

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
            // component: mapping,
            component: () => import("@/game/mapping/mapping.vue"),
            meta: { title: "w.mapping" },
        }, {
            path: '/play',
            // component: mapping,
            component: () => import("@/game/play/play.vue"),
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
