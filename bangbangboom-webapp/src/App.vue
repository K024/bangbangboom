<template>
    <div id="app">
        <div class="header">
            <div class="content" style="height: 100%;position: relative;">
                <div class="left flex header-part">
                    <div class="menu-item" v-if="$responsive.s">
                        <el-dropdown trigger="click" @command="route">
                            <i class="el-icon-menu"></i>
                            <el-dropdown-menu slot="dropdown" style="min-width: 200px">
                                <el-dropdown-item icon="el-icon-arrow-right" command="/search">{{$t('w.search')}}</el-dropdown-item>
                                <el-dropdown-item icon="el-icon-arrow-right" command="/ranking">{{$t('w.ranking')}}</el-dropdown-item>
                                <el-dropdown-item icon="el-icon-arrow-right" command="/favorites">{{$t('w.favorites')}}</el-dropdown-item>
                                <el-dropdown-item icon="el-icon-arrow-right" command="/mapping">{{$t('w.mapping')}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <router-link tag="div" class="menu-item" to="/">bangbangboom</router-link>
                    <router-link tag="div" class="menu-item only-g" to="/search">{{$t('w.search')}}</router-link>
                    <router-link tag="div" class="menu-item only-g" to="/ranking">{{$t('w.ranking')}}</router-link>
                    <router-link tag="div" class="menu-item only-g" to="/favorites">{{$t('w.favorites')}}</router-link>
                    <router-link tag="div" class="menu-item only-g" to="/mapping">{{$t('w.mapping')}}</router-link>
                </div>
                <div class="right flex header-part">
                    <el-dropdown trigger="click" class="menu-item" @command="changeLocale">
                        <div>
                            {{ $i18n.locale }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="zh">中文</el-dropdown-item>
                            <el-dropdown-item command="en">English</el-dropdown-item>
                            <el-dropdown-item command="ja">日本語</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-popover
                        class="menu-item only-g"
                        v-model="loginpopup"
                        placement="bottom-end"
                        visible-arrow
                        width="250"
                        trigger="click"
                    >
                        <user-login @close="loginpopup=false"></user-login>
                        <div slot="reference">{{$t('w.login')}}</div>
                    </el-popover>
                    <router-link tag="div" class="menu-item" to="/account">
                        <i class="profile icon-profile"></i>
                    </router-link>
                    <div class="menu-item only-s" @click="$router.back()">
                        <i class="el-icon-arrow-left"></i>
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
        <el-backtop></el-backtop>
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import userlogin from "@/components/account/userlogin.vue";

export default Vue.extend({
    name: "app",
    components: {
        "user-login": userlogin
    },
    data: function() {
        return {
            loginpopup: false
        };
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
    }
});
</script>

<style scoped>
.profile {
    height: 40px;
    width: 40px;
    fill: #505050;
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
    height: 100%;
    padding: 0 5px;
    display: flex;
    align-items: center;
    transition: color 0.3s;
    margin-right: 10px;
    cursor: pointer;
}

.left .menu-item:first-child {
    margin-left: 10px;
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
    z-index: 1;
    backdrop-filter: blur(10px);
    box-shadow: 0 5px 5px #aaaaaa;
}

.header:hover {
    color: #e0e0e0;
}

/* override element theme */
.header > div > div > .el-dropdown {
    color: #ffffff;
}
.header:hover > div > div > .el-dropdown {
    color: #e0e0e0;
}
.header > div > div > .el-dropdown:hover {
    color: #ffffff;
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
}
</style>
