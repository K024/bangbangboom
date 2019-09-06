<template>
    <div @click="$router.push('/user/'+user.username)">
        <md-ripple>
            <avatar :username="user.username"></avatar>
            <md-tooltip md-direction="right">
                <div>{{user.nickname}}@{{user.username}}</div>
                <div>{{user.whatsup}}</div>
            </md-tooltip>
        </md-ripple>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
    props: {
        user: Object
    }
});
</script>

<style scoped>
</style>