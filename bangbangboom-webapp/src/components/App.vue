<template>
    <div id="app">
        <div class="header">
            <div class="content" style="height: 100%;position: relative;">
                <div class="left flex header-part">
                    <md-menu md-align-trigger class="menu-item" v-if="$responsive.s">
                        <md-ripple class="flex" md-menu-trigger>
                            <i class="material-icons">menu</i>
                        </md-ripple>
                        <md-menu-content style="min-width: 200px" md-theme="default">
                            <md-menu-item v-for="menu in menus" :key="menu.to" @click="route(menu.to)">
                                <i class="material-icons">navigate_next</i>
                                <span style="flex-grow: 1;margin-left: 10px">{{menu.text}}</span>
                            </md-menu-item>
                        </md-menu-content>
                    </md-menu>
                    <router-link class="menu-item" tag="div" to="/">
                        <md-ripple class="flex">bangbangboom</md-ripple>
                    </router-link>
                    <router-link class="menu-item only-g" v-for="menu in menus" :key="menu.to" tag="div" :to="menu.to">
                        <md-ripple class="flex">{{menu.text}}</md-ripple>
                    </router-link>
                </div>
                <div class="right flex header-part">
                    <md-menu class="menu-item" md-align-trigger>
                        <md-ripple md-menu-trigger class="flex">
                            {{ $i18n.locale }}
                            <i class="material-icons">expand_more</i>
                        </md-ripple>
                        <md-menu-content>
                            <md-menu-item
                                v-for="locale in locales"
                                :key="locale.id"
                                :disabled="locale.id===$i18n.locale"
                                @click="changeLocale(locale.id)"
                            >{{locale.text}}</md-menu-item>
                        </md-menu-content>
                    </md-menu>
                    <md-menu
                        class="menu-item only-g"
                        md-direction="bottom-end"
                        md-size="huge"
                        :md-active="loginpopup && $responsive.g"
                        @md-opened="loginpopup = true"
                        @md-closed="loginpopup = false"
                        md-align-trigger
                    >
                        <md-ripple class="flex" md-menu-trigger>{{$t('w.login')}}</md-ripple>
                        <md-menu-content>
                            <user-login style="padding: 0 10px" @close="loginpopup = false"></user-login>
                        </md-menu-content>
                    </md-menu>
                    <router-link tag="div" class="menu-item" to="/account">
                        <md-ripple class="flex profile" style="border-radius: 50%;padding: 0">
                            <i class="icon-profile profile"></i>
                        </md-ripple>
                    </router-link>
                    <div class="menu-item only-s" @click="$router.back()">
                        <md-ripple class="flex">
                            <i class="material-icons">navigate_before</i>
                        </md-ripple>
                    </div>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="main">
                <router-view></router-view>
            </div>
            <div class="footer">footer</div>
        </div>
        <vue-progress-bar></vue-progress-bar>
        <back-top></back-top>
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import { HideLoader } from "@/tools/loader";
import userlogin from "./account/userlogin.vue";
import backtop from "./backtop.vue";

// tslint:disable-next-line
interface Menu {
    text: string;
    to: string;
}

// tslint:disable-next-line
interface Locale {
    id: string;
    text: string;
}

export default Vue.extend({
    name: "app",
    components: {
        "user-login": userlogin,
        "back-top": backtop
    },
    data: function() {
        return {
            loginpopup: false
        };
    },
    computed: {
        menus(): Menu[] {
            return [
                { text: this.$t("w.search") as string, to: "search" },
                { text: this.$t("w.ranking") as string, to: "ranking" },
                { text: this.$t("w.favorites") as string, to: "favorites" },
                { text: this.$t("w.mapping") as string, to: "mapping" }
            ];
        },
        locales(): Locale[] {
            return [
                { id: "en", text: "English" },
                { id: "zh", text: "中文" },
                { id: "ja", text: "日本語" }
            ];
        }
    },
    methods: {
        changeLocale: function(locale: string) {
            this.$i18n.locale = locale;
        },
        route: function(path: string) {
            this.$router.push(path);
        }
    },
    watch: {
        "$i18n.locale": function(locale: string) {
            localStorage.setItem("locale", locale);
        }
    },
    beforeMount: function() {
        const lang =
            localStorage.getItem("locale") || navigator.language.substr(0, 2);
        if (this.$i18n.messages[lang]) this.$i18n.locale = lang;
    },
    mounted: function() {
        HideLoader();
    }
});
</script>

<style scoped>
.profile {
    height: 40px;
    width: 40px;
}

.header-part {
    position: absolute;
    height: 100%;
}

.left {
    left: 0;
}

.right {
    right: 0;
}

.menu-item {
    width: auto;
    height: 100%;
    display: flex;
    align-items: center;
    transition: color 0.3s;
    margin: 0 5px;
    cursor: pointer;
}

.menu-item > * {
    padding: 0 5px;
}

.menu-item:hover {
    color: #ffffff;
}

.content {
    max-width: 800px;
    margin: auto;
    width: 100%;
}

.header {
    top: 0;
    height: 50px;
    width: 100%;
    position: fixed;
    background: #00000050;
    color: #ffffff;
    z-index: 100;
    backdrop-filter: blur(10px);
    box-shadow: 0 5px 5px #aaaaaa;
}

.header:hover {
    color: #e0e0e0;
}

.header + * {
    margin-top: 55px;
}

.footer {
    margin: 20px;
    border-top: solid #e0e0e0 1px;
}

.main {
    min-height: 70vh;
    transition: height 0.3s;
}
</style>
