<template>
    <div class="flex center">
        <div class="form-panel">
            <el-alert v-if="sent" type="success" show-icon :closable="false">
                <div style="font-size: 14px">{{$t('s.sentemail')}}</div>
            </el-alert>
            <template v-else>
                <div>{{$t('w.register')}}</div>
                <el-input v-model="email" :placeholder="$t('w.email')" style="display: block"></el-input>
                <div class="flex">
                    <el-alert
                        class="inline"
                        type="info"
                        :closable="false"
                        v-if="state == 'checking'"
                    >{{$t('s.checking')}}</el-alert>
                    <el-alert
                        class="inline"
                        type="warning"
                        :closable="false"
                        v-else-if="state == 'registered'"
                    >{{$t('s.emialregistered')}}</el-alert>
                    <el-alert
                        class="inline"
                        type="success"
                        :closable="false"
                        v-else-if="state == 'acceptable'"
                    >{{$t('w.available')}}</el-alert>&nbsp;
                </div>
                <el-button
                    type="primary"
                    plain
                    class="fill-w"
                    @click="confirm"
                    :disabled="state != 'acceptable'"
                >{{$t('w.confirm')}}</el-button>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { debounce, delay } from "@/tools/functions";
import axios from "axios";

const checkEmail = debounce(
    300,
    async (email: string, callback: (res: boolean) => void) => {
        try {
            await delay(200);
            callback(true);
        } catch (err) {
            callback(false);
        }
    }
);

export default Vue.extend({
    data: function() {
        return {
            email: "",
            sent: false,
            state: "empty"
        };
    },
    methods: {
        confirm: function() {
            this.sent = true;
        }
    },
    watch: {
        email: function() {
            if (this.email && /^.+@.+$/.test(this.email)) {
                this.state = "checking";
                const email = this.email;
                checkEmail(this.email, (res: boolean) => {
                    if (email !== this.email) return;
                    if (res) this.state = "acceptable";
                    else this.state = "registered";
                });
            } else {
                this.state = "empty";
            }
        }
    }
});
</script>


