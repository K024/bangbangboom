<template>
    <div id="app">
        <div class="header">
            <div class="content" style="height: 100%;position: relative;">
                <div class="float-left">
                    <router-link tag="div" class="menu-item" to="/">bangbangboom</router-link>
                    <router-link tag="div" class="menu-item" to="/search">搜索</router-link>
                    <router-link tag="div" class="menu-item" to="/ranking">排行</router-link>
                    <router-link tag="div" class="menu-item" to="/favorite">收藏</router-link>
                    <router-link tag="div" class="menu-item" to="/mapping">作图</router-link>
                </div>
                <div class="float-right">
                    <el-popover
                        v-model="loginpopup"
                        placement="bottom-end"
                        visible-arrow
                        width="200"
                        trigger="click"
                    >
                        <user-login @close="loginpopup=false"></user-login>
                        <div class="menu-item" slot="reference">登录</div>
                    </el-popover>
                    <i class="profile icon-profile"></i>
                </div>
            </div>
        </div>
        <div class="main content">
            <router-view></router-view>
            <div class="footer">footer</div>
        </div>
        <el-backtop></el-backtop>
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import userlogin from "@/components/account/userlogin.vue";
import "./App.css";
import "element-ui/lib/theme-chalk/display.css";

export default Vue.extend({
    name: "app",
    components: {
        "user-login": userlogin
    },
    data: function() {
        return {
            loginpopup: false
        };
    }
});
</script>

<style scoped>
.profile {
    height: 40px;
    width: 40px;
    fill: #505050;
}

.float-left {
    position: absolute;
    left: 0;
    display: flex;
    align-items: center;
    height: 100%;
}

.float-right {
    position: absolute;
    right: 0;
    display: flex;
    align-items: center;
    height: 100%;
}

.menu-item {
    height: 100%;
    margin-right: 10px;
    padding: 0 5px;
    display: flex;
    align-items: center;
    transition: all 0.3s;
}

.menu-item:hover {
    color: #ffffff;
}

.content {
    width: 100%;
    max-width: 800px;
    margin: auto;
}

.header {
    top: 0;
    width: 100%;
    height: 50px;
    position: fixed;
    background: #00000050;
    color: #ffffff;
}

.header:hover {
    color: #e0e0e0;
}

.header + * {
    margin-top: 50px;
}

.footer {
    margin-top: 20px;
    border-top: solid #e0e0e0 1px;
}
</style>
