<template>
    <div class="flex center">
        <div class="form-panel fade-in">
            <md-empty-state v-if="sent" class="md-primary" md-icon="done" :md-description="$t('s.sentemail')"></md-empty-state>
            <template v-else>
                <div class="md-title">{{$t('w.register')}}</div>
                <md-field :class="{'md-invalid': state == 'registered'}">
                    <label>{{$t('w.email')}}</label>
                    <md-input v-model="email"></md-input>
                    <div v-if="state == 'checking'" class="md-input-action">
                        <md-progress-spinner :md-diameter="20" :md-stroke="2" md-mode="indeterminate"></md-progress-spinner>
                    </div>
                    <span v-if="state == 'acceptable'" class="md-helper-text">{{$t('w.available')}}</span>
                    <span class="md-error">{{$t('s.emialregistered')}}</span>
                </md-field>
                <md-button
                    class="fill-w md-primary md-raised"
                    @click="confirm"
                    :disabled="state != 'acceptable' || loading"
                >{{$t('w.confirm')}}</md-button>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { debounce, delay } from "@/tools/functions";
import axios from "axios";
import { emailvalidate } from "./state";
import api, { Xform } from "../../tools/Axios";

const checkEmail = debounce(300, async (email: string) => {
    try {
        const res = await api.post<string>(
            "account/testemail",
            Xform({ email })
        );
        return res.data === "acceptable";
    } catch (err) {
        return false;
    }
});

export default Vue.extend({
    data: function() {
        return {
            email: "",
            sent: false,
            state: "empty",
            loading: false
        };
    },
    methods: {
        confirm: async function() {
            try {
                this.loading = true;
                await api.post(
                    "account/register",
                    Xform({ email: this.email })
                );
                this.sent = true;
            } catch (error) {
                this.$toasted.error("Error: something wrong, please retry");
            } finally {
                this.loading = false;
            }
        }
    },
    watch: {
        email: async function() {
            if (emailvalidate(this.email)) {
                this.state = "checking";
                const email = this.email;
                try {
                    const res = await checkEmail(this.email);
                    if (email !== this.email) return;
                    if (res) this.state = "acceptable";
                    else this.state = "registered";
                } catch (error) {
                    this.state = "empty";
                }
            } else {
                this.state = "empty";
            }
        }
    }
});
</script>


