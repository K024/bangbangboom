import Vue from "vue"
import Router, { RouteConfig } from "vue-router"
import i18n from "@/plugins/i18n"
import home from '@/components/home.vue'
import notfound from '@/components/others/notfound.vue'
// import mapping from '@/game/mapping/mapping.vue'
import { accountRoutes } from '@/components/account/routes';

import favorites from "@/components/favorites.vue";
import ranking from "@/components/ranking.vue";
import search from "@/components/search.vue";
import musics from "@/components/musics.vue"
import settings from "@/components/settings.vue"
import mapdetail from "@/components/mapdetail.vue";
import musicdetail from "@/components/musicdetail.vue";
import userdetail from "@/components/userdetail.vue";

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
            path: '/favorites',
            component: favorites,
            meta: { title: "w.favorites" },
        }, {
            path: '/ranking',
            component: ranking,
            meta: { title: "w.ranking" },
        }, {
            path: '/search',
            component: search,
            meta: { title: "w.search" },
        }, {
            path: '/musics',
            component: musics,
        }, {
            path: '/settings',
            component: settings,
        }, {
            path: '/map/:id',
            component: mapdetail,
        }, {
            path: '/music/:id',
            component: musicdetail,
        }, {
            path: '/user/:id',
            component: userdetail,
        }, {
            path: '/mapping',
            // component: mapping,
            component: () => import("@/game/mapping/mapping.vue"),
            meta: { title: "w.mapping" },
        }, {
            path: '/play/:id',
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
