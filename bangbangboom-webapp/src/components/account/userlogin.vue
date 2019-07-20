<template>
    <div>
        <el-input class="input" placeholder="用户名" v-model="username" clearable></el-input>
        <el-input class="input" placeholder="密码" v-model="password" show-password></el-input>
        <div v-if="userstate.message" class="message">{{userstate.message}}</div>
        <div class="buttons">
            <el-button type="primary" @click="login">登录</el-button>
            <div @click="register" class="register">注册</div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import userstate from "./state";

export default Vue.extend({
    data: () => {
        return {
            username: "",
            password: ""
        };
    },
    computed: {
        userstate: () => userstate
    },
    methods: {
        login: function() {},
        register: function() {
            this.$router.push("/account/register");
            this.$emit("close");
        }
    }
});
</script>

<style scoped>
.input {
    margin-bottom: 8px;
}
.message {
    width: 100%;
    display: flex;
    align-items: center;
}
.buttons {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
}
.register {
    padding: 0 20px;
}
</style>

