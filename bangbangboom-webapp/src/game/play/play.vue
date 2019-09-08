<template>
    <div class="play">
        <md-button class="md-icon-button back" @click="$router.back()" md-theme="dark">
            <md-icon>navigate_before</md-icon>
        </md-button>
        <canvas ref="canvas" touch-action="none"></canvas>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { App } from "./app";
import { MetaState } from "../mapping/state";
import { Config } from "./constants";
import { GameConfig } from "./config";

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
        },
        load() {
            const mapid = this.$route.params.id;
            if (!mapid) {
                this.$router.back();
                this.$toasted.error("Invalid map id");
                return;
            }
            let mapsource = "";
            let songurl = "";
            let background = "";
            if (mapid === "local") {
                songurl = MetaState.musicSrc;
                background = MetaState.backgroundImageSrc;
                mapsource = "local";
            } else {
                mapsource = "/api/map/content/" + mapid;
                songurl = "/api/map/music/" + mapid;
                background = "/api/map/image/" + mapid;
            }
            this.canvas = this.$refs.canvas as HTMLCanvasElement;
            if (!this.canvas) throw new Error();
            this.app = new App(this.canvas, {
                songurl,
                mapsource,
                background,
                skin: "skin0",
                config: GameConfig.config
            });
        }
    },
    mounted: function() {
        this.load();
        window.addEventListener("resize", this.resizeCanvas);
    },
    beforeDestroy: function() {
        if (this.app) this.app.destroy();
        window.removeEventListener("resize", this.resizeCanvas);
    }
});
</script>

<style scoped>
.play {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
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