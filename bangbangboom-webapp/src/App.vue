<template>
    <div id="app">
        <img src="./assets/logo.png" />
        <div>
            <my-test content="test1"></my-test>
            <my-testt content="test2"></my-testt>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import Test from "./components/test.vue";
import Test2 from "./components/test2.vue";

export default Vue.extend({
    name: "app"
});
</script>

<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
