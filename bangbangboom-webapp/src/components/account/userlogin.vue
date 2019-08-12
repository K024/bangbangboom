<template>
    <div class="container">
        <md-field md-clearable>
            <label>{{$t('w.username') + '/' + $t('w.email')}}</label>
            <md-input v-model="username"></md-input>
        </md-field>
        <md-field>
            <label>{{$t('w.password')}}</label>
            <md-input v-model="password" type="password"></md-input>
        </md-field>
        <div v-if="userstate.message">{{userstate.message}}</div>
        <md-button
            @click="login"
            class="fill-w md-primary md-raised"
            style="margin: 12px 0"
            :disabled="!username || !password"
        >
            <span>{{$t('w.login')}}</span>
        </md-button>
        <div class="buttons flex">
            <md-button @click="register">{{$t('w.register')}}</md-button>
            <md-button @click="fogotpass">{{$t('w.forgotpass')}}</md-button>
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
            this.$router.push("/account/register");
            this.$emit("close");
        },
        fogotpass: function() {
            this.$router.push("/account/forgotpass");
            this.$emit("close");
        }
    },
    mounted() {
        this.$el.addEventListener("click", (e: Event) => {
            e.stopPropagation();
            e.cancelBubble = true;
        });
    }
});
</script>

<style scoped>
.container > * {
    margin: 5px 0;
}
.buttons {
    margin: 0;
    justify-content: space-around;
}
.buttons > * {
    margin: 0;
}
.md-button {
    display: block;
}
</style>

