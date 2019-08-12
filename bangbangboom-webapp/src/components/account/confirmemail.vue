<template>
    <div class="flex center">
        <div class="form-panel fade-in">
            <md-empty-state v-if="sent" class="md-primary" md-icon="done" :md-description="$t('s.registersuccess')"></md-empty-state>
            <template v-else>
                <div class="md-title">{{$t('l.register')}}</div>
                <md-field :class="{'md-invalid': unstate == 'registered'}">
                    <label>{{$t('w.username')}}</label>
                    <md-input v-model="userName"></md-input>
                    <div v-if="unstate == 'checking'" class="md-input-action">
                        <md-progress-spinner :md-diameter="20" :md-stroke="2" md-mode="indeterminate"></md-progress-spinner>
                    </div>
                    <span v-if="unstate == 'acceptable'" class="md-helper-text" style="color:">{{$t('w.available')}}</span>
                    <span class="md-error">{{$t('s.usernameregistered')}}</span>
                </md-field>
                <md-field :class="{'md-invalid': password && !passwordValid}">
                    <label>{{$t('s.enterpass')}}</label>
                    <md-input v-model="password" type="password"></md-input>
                    <span class="md-error">{{$t('s.validpass')}}</span>
                </md-field>
                <md-field :class="{'md-invalid': password2 && password != password2}">
                    <label>{{$t('s.enterpass2')}}</label>
                    <md-input v-model="password2" type="password"></md-input>
                </md-field>
                <md-button
                    class="fill-w md-primary md-raised"
                    @click="confirm"
                    :disabled="!inputValid"
                >{{$t('w.confirm')}}</md-button>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { debounce, delay } from "@/tools/functions";
import axios from "axios";
import { usernamevalidate, passwordvalidate } from "./state";

/**
 * 检查用户名
 */
const checkUserName = debounce(300, async (userName: string) => {
    try {
        await delay(2000);
        return true;
    } catch (error) {
        return false;
    }
});

export default Vue.extend({
    data: function() {
        return {
            guid: "",
            token: "",
            userName: "",
            unstate: "empty",
            password: "",
            password2: "",
            sent: false
        };
    },
    computed: {
        passwordValid(): boolean {
            return passwordvalidate(this.password);
        },
        inputValid(): boolean {
            return (
                this.unstate === "acceptable" &&
                this.passwordValid &&
                this.password === this.password2
            );
        }
    },
    methods: {
        confirm: function() {
            this.sent = true;
        }
    },
    watch: {
        userName: async function() {
            if (usernamevalidate(this.userName)) {
                this.unstate = "checking";
                const userName = this.userName;
                try {
                    const res = await checkUserName(this.userName);
                    if (userName !== this.userName) return;
                    if (res) this.unstate = "acceptable";
                    else this.unstate = "registered";
                } catch (error) {
                    this.unstate = "empty";
                    // this.$message.error(this.$t("s.neterror") as string);
                }
            } else {
                this.unstate = "empty";
            }
        }
    },
    mounted: function() {
        const url = new URL(window.location.href);
        this.guid = url.searchParams.get("guid") || "";
        this.token = url.searchParams.get("token") || "";
    }
});
</script>

<style scoped>
.input {
    flex-grow: 1;
}
.input + * {
    margin-left: 10px;
}
</style>

