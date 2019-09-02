<template>
    <div class="flex center">
        <div class="form-panel fade-in">
            <md-empty-state v-if="sent" class="md-primary" md-icon="done" :md-description="$t('s.sentemail')"></md-empty-state>
            <template v-else>
                <div class="md-title">{{$t('l.forgotpass')}}</div>
                <md-field>
                    <label>{{$t('w.email')}}</label>
                    <md-input v-model="email"></md-input>
                </md-field>
                <md-button
                    class="fill-w md-primary md-raised"
                    @click="confirm"
                    :disabled="!emailvalid || loading"
                >{{$t('w.confirm')}}</md-button>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import { emailvalidate } from "./state";
import api, { Xform } from "../../tools/Axios";

export default Vue.extend({
    data: function() {
        return {
            email: "",
            sent: false,
            loading: false
        };
    },
    computed: {
        emailvalid(): boolean {
            return emailvalidate(this.email);
        }
    },
    methods: {
        confirm: async function() {
            try {
                this.loading = true;
                await api.post(
                    "account/forgotpassword",
                    Xform({ email: this.email })
                );
                this.sent = true;
            } catch (error) {
                this.$toasted.error("Email not found");
            } finally {
                this.loading = false;
            }
        }
    }
});
</script>

