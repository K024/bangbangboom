<template>
    <div id="mapping">
        <md-content md-theme="default-dark"></md-content>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
    data: function() {
        return {
            tab: "meta"
        };
    }
});
</script>

<style scoped>
#mapping {
    background-color: black;
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 10000;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: stretch;
}
</style>
