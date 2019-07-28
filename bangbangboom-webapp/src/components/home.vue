<template>
    <div class="home">
        <div>Home</div>
        <el-button @click="$Progress.set(20)">progress start</el-button>
        <el-button @click="$Progress.finish()">progress finish</el-button>
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
