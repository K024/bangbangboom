<template>
    <div class="mapping">
        <div class="tools">
            <div>
                <md-radio v-model="selected" value="none">None</md-radio>
                <div class="flex" v-for="tool in tools" :key="tool.name">
                    <md-radio v-model="selected" :value="tool.name" :id="'note-' + tool.name"></md-radio>
                    <label :for="'note-' + tool.name">
                        <img class="note-select" :src="tool.src" alt="nomal" />
                    </label>
                </div>
                <md-radio v-model="selected" value="delete">Delete</md-radio>
                <div class="field">
                    <md-field>
                        <label for="movie">Beat Division</label>
                        <md-select v-model="division">
                            <md-option value="1">1/1</md-option>
                            <md-option value="2">1/2</md-option>
                            <md-option value="3">1/3 (Tritone?)</md-option>
                            <md-option value="4">1/4</md-option>
                            <md-option value="6">1/6 (Tritone?)</md-option>
                            <md-option value="8">1/8 (Double the bpm?)</md-option>
                            <md-option value="24">1/24 (Not recommended!)</md-option>
                        </md-select>
                    </md-field>
                </div>
                <div class="flex">
                    <md-button class="md-icon-button" @click="zoom(false)" :disabled="factor>=800">
                        <md-icon>zoom_in</md-icon>
                    </md-button>
                    <md-button class="md-icon-button" @click="zoom(true)" :disabled="factor<=100">
                        <md-icon>zoom_out</md-icon>
                    </md-button>
                </div>
                <div class="flex">
                    <md-switch v-model="follow">Follow</md-switch>
                </div>
            </div>
        </div>
        <tracks class="track" :time-height-factor="factor" :division="parseInt(division)" :tool="selected"></tracks>
        <scrollbar class="scrollbar" :time-height-factor="factor">scrollbar</scrollbar>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { assets } from "../../assets/assetsmap";
import { GameMapState } from "../gamemapstate";
import { TimePoint } from "@/game/core/MapCore";
import { SecondToString } from "../state";
import scrollbar from "./fast-render/scrollbar.vue";
import tracks from "./fast-render/tracks.vue";
import { SelectPosition } from "./fast-render/state";
import {
    addKeyDownListener,
    removeKeyDownListeners
} from "../../../tools/functions";

export default Vue.extend({
    filters: {
        time: SecondToString
    },
    components: {
        scrollbar,
        tracks
    },
    data: function() {
        return {
            selected: "none",
            division: "1",
            factor: 400,
            active: true
        };
    },
    computed: {
        assets: () => assets,
        timepoints: () => GameMapState.s.timepoints,
        tools: () => [
            { name: "normal", src: assets.note_normal },
            { name: "flick", src: assets.note_flick },
            { name: "slide", src: assets.note_long }
        ],
        follow: {
            get() {
                return SelectPosition.follow;
            },
            set(v: boolean) {
                SelectPosition.follow = v;
            }
        }
    },
    methods: {
        zoom: function(out: boolean) {
            if (out) {
                let f = this.factor / 1.414;
                if (f < 120) f = 100;
                this.factor = f;
            } else {
                let f = this.factor * 1.414;
                if (f > 780) f = 800;
                this.factor = f;
            }
        },
        addlisteners: function() {
            addKeyDownListener(
                49 /** 1 */,
                () => (this.selected = "none"),
                this
            );
            addKeyDownListener(
                50 /** 2 */,
                () => (this.selected = "normal"),
                this
            );
            addKeyDownListener(
                51 /** 3 */,
                () => (this.selected = "flick"),
                this
            );
            addKeyDownListener(
                52 /** 4 */,
                () => (this.selected = "slide"),
                this
            );
            addKeyDownListener(
                53 /** 5 */,
                () => (this.selected = "delete"),
                this
            );
            addKeyDownListener(
                84 /** t */,
                () => (this.follow = !this.follow),
                this
            );
        }
    },
    deactivated: function() {
        removeKeyDownListeners(this);
    },
    activated: function() {
        this.addlisteners();
    }
});
</script>

<style scoped>
.mapping {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
}
.tools {
    position: relative;
    flex-grow: 0.5;
    padding: 40px;
    max-width: calc(40% - 100px);
}
.tools > * {
    max-width: 300px;
    position: absolute;
    right: 10px;
}
.track {
    position: relative;
    flex-grow: 1;
    max-width: 600px;
}
.scrollbar {
    position: relative;
    width: 100px;
}
.note-select {
    width: 100px;
    cursor: pointer;
}
</style>

<style>
div.md-select-menu.md-menu-content-bottom-start.md-menu-content-small.md-menu-content.md-theme-dark {
    z-index: 10012;
    background-color: #202020;
}
</style>