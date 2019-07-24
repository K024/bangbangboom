<template>
    <div class="container">
        <el-input class="input" :placeholder="$t('w.username') + '/' + $t('w.email')" v-model="username" clearable></el-input>
        <el-input class="input" :placeholder="$t('w.password')" v-model="password" show-password></el-input>
        <div v-if="userstate.message">{{userstate.message}}</div>
        <el-button
            type="primary"
            plain
            @click="login"
            class="fill-w"
            :disabled="!username && !password"
        >{{$t('w.login')}}</el-button>
        <div class="buttons flex">
            <div @click="register">{{$t('w.register')}}</div>
            <div @click="fogotpass">{{$t('w.forgotpass')}}</div>
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
        login: function() {
            // login
        },
        register: function() {
            this.$router.push("/register");
            this.$emit("close");
        },
        fogotpass: function() {
            this.$router.push("/forgotpass");
            this.$emit("close");
        }
    }
});
</script>

<style scoped>
.container > * {
    margin: 5px 0;
}
.buttons {
    justify-content: space-around;
}
.buttons > * {
    cursor: pointer;
}
</style>

