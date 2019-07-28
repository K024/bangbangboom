<template>
    <div class="containder">
        <template v-if="true">
            <div class="only-g flex center login">{{$t('s.pleaselogin')}}</div>
            <div class="only-s login">
                <user-login></user-login>
            </div>
        </template>
        <template v-else></template>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import userlogin from "./userlogin.vue";

/**
 * 用户修改个人信息界面
 * 个人设置界面
 */
export default Vue.extend({
    components: {
        "user-login": userlogin
    }
});
</script>

<style scoped>
.login {
    max-width: 300px;
    margin: auto;
    padding: 20px 10px;
}
</style>
