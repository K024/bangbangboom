<template>
    <div class="home">
        <div>Home</div>
        <md-button @click="$Progress.set(20)">progress start</md-button>
        <md-button @click="$Progress.finish()">progress finish</md-button>
    </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({});
</script>

<style scoped>
.home {
    font-size: 30px;
}
</style>
