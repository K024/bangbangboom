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
                    :disabled="!emailvalid"
                >{{$t('w.confirm')}}</md-button>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import { emailvalidate } from "./state";

export default Vue.extend({
    data: function() {
        return {
            email: "",
            sent: false
        };
    },
    computed: {
        emailvalid(): boolean {
            return emailvalidate(this.email);
        }
    },
    methods: {
        confirm: function() {
            this.sent = true;
        }
    }
});
</script>

