<template>
    <div class="mapping">
        <div class="tools"></div>
        <div class="track"></div>
        <div class="scrollbar"></div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
    data: function() {
        return {};
    },
    computed: {}
});
</script>

<style scoped>
.mapping {
    position: relative;
    display: flex;
    justify-content: stretch;
}
.tools {
    position: relative;
    flex-grow: 1;
}
.track {
    position: relative;
    flex-grow: 1;
}
.scrollbar {
    position: relative;
    width: 100px;
}
</style>