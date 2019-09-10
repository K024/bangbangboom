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
        <md-button
            @click="login"
            class="fill-w md-primary md-raised"
            style="margin: 12px 0"
            :disabled="!username || !password || loading"
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
import { userstate, LoadCurrentUser } from "./state";
import api, { Xform, HandleErr } from "../../tools/Axios";
import { AccountInfo } from "../../tools/models";

export default Vue.extend({
    data: () => {
        return {
            username: "",
            password: "",
            loading: false
        };
    },
    computed: {
        userstate: () => userstate
    },
    methods: {
        login: async function() {
            try {
                this.loading = true;
                await api.post(
                    "account/login",
                    Xform({ username: this.username, password: this.password })
                );
                await LoadCurrentUser();
                this.$emit("close");
            } catch (error) {
                const res = HandleErr<string>(error);
                if (!res) this.$toasted.error(this.$t("s.neterror") as string);
                else if (res.status === 401)
                    this.$toasted.error(this.$t('s.userNameOrPasswordWrong') as string );
                else if (res.data.startsWith("lockedout"))
                    this.$toasted.error(this.$t('s.accountLockOut') as string );
                else if (res.data === "emailnotconfirmed")
                    this.$toasted.error(this.$t('s.emailNotConfirmed') as string );
            } finally {
                this.loading = false;
            }
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

