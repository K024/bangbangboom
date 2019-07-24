<template>
    <div class="flex center">
        <div class="form-panel">
            <el-alert v-if="sent" type="success" show-icon :closable="false">
                <div style="font-size: 14px">{{$t('s.sentemail')}}</div>
            </el-alert>
            <template v-else>
                <div>{{$t('l.forgotpass')}}</div>
                <el-input v-model="email" :placeholder="$t('w.email')" style="display: block"></el-input>
                <el-button
                    type="primary"
                    plain
                    class="fill-w"
                    @click="confirm"
                    :disabled="!/^.+@.+$/.test(email)"
                >{{$t('w.confirm')}}</el-button>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";

export default Vue.extend({
    data: function() {
        return {
            email: "",
            sent: false
        };
    },
    methods: {
        confirm: function() {
            this.sent = true;
        }
    }
});
</script>

