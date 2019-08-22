<template>
    <div class="flex center">
        <div class="form-panel fade-in">
            <md-empty-state v-if="sent" class="md-primary" md-icon="done" :md-description="$t('s.resetpasssuccess')"></md-empty-state>
            <template v-else>
                <div class="md-title">{{$t('l.resetpass')}}</div>
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

