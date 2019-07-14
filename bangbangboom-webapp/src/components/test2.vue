<template>
    <div>
        <div>{{ store.count }}</div>
        <el-button @click="store.count++">add</el-button>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import store from "./store";

export default Vue.component("my-testt", {
    props: ["content"],
    computed: {
        store
    }
});
</script>
