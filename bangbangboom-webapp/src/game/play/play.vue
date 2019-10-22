<template>
    <div class="play">
        <!-- <md-button class="md-icon-button back" @click="$router.back()" md-theme="dark">
            <md-icon>navigate_before</md-icon>
        </md-button>-->
        <canvas ref="canvas" touch-action="none"></canvas>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import "pixi.js";
import { Game, GameLoadConfig } from "bangbangboom-game";
import { MetaState } from "../mapping/state";
import api from "@/tools/Axios";
import { MapDetailed } from "@/tools/models";
import { GameConfig } from "./config";

export default Vue.extend({
    data: function() {
        return {
            canvas: null as null | HTMLCanvasElement,
            game: null as null | Game,
            destroyed: false
        };
    },
    methods: {
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
                mapsource = URL.createObjectURL(
                    new Blob([localStorage.getItem("gamemapstate") || ""])
                );
            } else {
                mapsource = "/api/map/content/" + mapid;
                songurl = "/api/map/music/" + mapid;
                background = "/api/map/image/" + mapid;
            }
            this.canvas = this.$refs.canvas as HTMLCanvasElement;
            if (!this.canvas) throw new Error();
            const loadConfig = Object.assign(new GameLoadConfig(), {
                musicSrc: songurl,
                mapSrc: mapsource,
                backgroundSrc: background,
                skin: "/assets/default",
                songName: ""
            });
            const c = GameConfig.config as any;
            for (const key in c) {
                if (c[key] && typeof c[key] === "string")
                    c[key] = parseFloat(c[key]);
            }
            this.game = new Game(this.canvas, GameConfig.config, loadConfig);
            this.game.start();
            this.game.ondestroyed = () => {
                if (!this.destroyed) this.$router.back();
                this.destroyed = true;
            };

            if (mapid !== "local")
                api.get<MapDetailed>("map/info", {
                    params: { id: mapid }
                }).then(res => {
                    loadConfig.songName =
                        res.data.music.titleunicode + " - " + res.data.mapname;
                });
        }
    },
    mounted: function() {
        this.load();
    },
    beforeDestroy: function() {
        this.destroyed = true;
        if (this.game) this.game.destroy();
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