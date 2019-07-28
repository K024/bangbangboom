<template>
    <div class="flex center">
        <div class="form-panel">
            <el-alert v-if="sent" type="success" show-icon :closable="false">
                <div style="font-size: 14px">{{$t('s.resetpasssuccess')}}</div>
            </el-alert>
            <template v-else>
                <div>{{$t('l.resetpass')}}</div>
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
import { passwordvalidate } from "./state";

export default Vue.extend({
    data: function() {
        return {
            guid: "",
            token: "",
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
            return this.passwordValid && this.password === this.password2;
        }
    },
    methods: {
        confirm: function() {
            this.sent = true;
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

