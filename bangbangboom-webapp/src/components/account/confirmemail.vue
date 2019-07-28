<template>
    <div class="flex center">
        <div class="form-panel">
            <el-alert v-if="sent" type="success" show-icon :closable="false">
                <div style="font-size: 14px">{{$t('s.registersuccess')}}</div>
            </el-alert>
            <template v-else>
                <div>{{$t('l.register')}}</div>
                <el-input v-model="userName" :placeholder="$t('w.username')" style="display: block"></el-input>
                <div class="flex">
                    <el-alert
                        class="inline"
                        type="info"
                        :closable="false"
                        v-if="unstate === 'checking'"
                    >{{$t('s.checking')}}</el-alert>
                    <el-alert
                        class="inline"
                        type="warning"
                        :closable="false"
                        v-else-if="unstate === 'registered'"
                    >{{$t('s.usernameregistered')}}</el-alert>
                    <el-alert
                        class="inline"
                        type="success"
                        :closable="false"
                        v-else-if="unstate === 'acceptable'"
                    >{{$t('w.available')}}</el-alert>&nbsp;
                </div>
                <div class="flex">
                    <el-input :placeholder="$t('s.enterpass')" v-model="password" show-password class="input"></el-input>
                    <i v-if="passwordValid" class="el-icon-success" style="color:#67c23a"></i>
                    <el-tooltip v-else-if="password" effect="dark" :content="$t('s.validpass')" placement="top">
                        <i class="el-icon-error" style="color:#f56c6c"></i>
                    </el-tooltip>
                </div>
                <div class="flex">
                    <el-input :placeholder="$t('s.enterpass2')" v-model="password2" show-password class="input"></el-input>
                    <i v-if="password2 && password != password2" class="el-icon-error" style="color:#f56c6c"></i>
                    <i v-if="password2 && password == password2" class="el-icon-success" style="color:#67c23a"></i>
                </div>
                <el-button
                    type="primary"
                    plain
                    class="fill-w"
                    @click="confirm"
                    :disabled="!inputValid"
                >{{$t('w.confirm')}}</el-button>
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
        await delay(200);
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
                    this.$message.error(this.$t("s.neterror") as string);
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

