<template>
    <div class="play">
        <md-button class="md-icon-button back" @click="$router.back()" md-theme="dark">
            <md-icon>navigate_before</md-icon>
        </md-button>
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { App } from "./app";
export default Vue.extend({
    data: function() {
        return {
            canvas: null as null | HTMLCanvasElement,
            app: null as null | App
        };
    },
    methods: {
        resizeCanvas: function() {
            if (this.app) this.app.resizeCanvas();
        }
    },
    mounted: function() {
        this.canvas = this.$refs.canvas as HTMLCanvasElement;
        this.app = new App(this.canvas);
        window.addEventListener("resize", this.resizeCanvas);
    },
    beforeDestroy: function() {
        if (!this.app) return;
        this.app.destroy();
        window.removeEventListener("resize", this.resizeCanvas);
    }
});
</script>

<style scoped>
.play {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    align-items: stretch;
}
.back {
    position: absolute;
    right: 10px;
    top: 10px;
}
canvas {
    width: 100%;
    height: 100%;
    flex-grow: 1;
}
</style>