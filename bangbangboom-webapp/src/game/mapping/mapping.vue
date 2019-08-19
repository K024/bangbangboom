<template>
    <div class="flex center">
        <div class="md-title" style="margin: 30px">Mapping is recommended in larger devices</div>
        <md-content style="background-color: black" md-theme="dark" class="map-editor only-g">
            <div class="background-image" :style="backgroundStyle"></div>
            <md-content class="flex fill-w dark-bg">
                <md-tabs :md-active-tab="tab" style="flex-grow: 1">
                    <md-tab id="tab-meta" md-label="Meta" to="/mapping#meta" replace></md-tab>
                    <md-tab id="tab-timing" md-label="Timing" to="/mapping#timing" replace></md-tab>
                    <md-tab id="tab-mapping" md-label="Mapping" to="/mapping#mapping" replace></md-tab>
                </md-tabs>
                <div class="flex center buttons">
                    <md-button class="md-icon-button" @click="undo" :disabled="!undostate.canUndo">
                        <md-icon>undo</md-icon>
                    </md-button>
                    <md-button class="md-icon-button" @click="redo" :disabled="!undostate.canRedo">
                        <md-icon>redo</md-icon>
                    </md-button>
                    <md-button class="md-icon-button" @click="save">
                        <md-icon>save_alt</md-icon>
                    </md-button>
                </div>
                <md-button class="md-icon-button" @click="$router.back()">
                    <md-icon>navigate_before</md-icon>
                </md-button>
            </md-content>
            <meta-tab class="tab fade-in" v-show="tab === 'tab-meta'"></meta-tab>
            <timing-tab class="tab fade-in" v-if="tab === 'tab-timing'"></timing-tab>
            <mapping-tab class="tab fade-in" v-if="tab === 'tab-mapping'"></mapping-tab>
            <player-bar></player-bar>
        </md-content>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import player from "./components/player.vue";
import meta from "./components/meta.vue";
import timing from "./components/timing.vue";
import mapping from "./components/mapping.vue";
import { PlayState, MetaState, togglePlay, ticker } from "./state";
import { Route } from "vue-router";
import {
    addKeyDownListener,
    removeKeyDownListeners,
    addKeyDownListenerEx
} from "../../tools/functions";
import { undoState, saveState } from "./gamemapstate";

export default Vue.extend({
    components: {
        "player-bar": player,
        "meta-tab": meta,
        "timing-tab": timing,
        "mapping-tab": mapping
    },
    data: function() {
        return {
            tab: "tab-meta"
        };
    },
    computed: {
        backgroundStyle: () => {
            return {
                "background-image": MetaState.backgroundImageSrc
                    ? `url(${MetaState.backgroundImageSrc})`
                    : "",
                // tslint:disable-next-line
                opacity: 1 - MetaState.backgroundDim / 100,
                "background-size": MetaState.backgroundCover
                    ? "cover"
                    : "contain"
            };
        },
        undostate: () => undoState
    },
    watch: {
        $route: {
            immediate: true,
            handler: function(n: Route) {
                if (!n.hash) this.$router.replace("/mapping#meta");
                else {
                    this.tab = "tab-" + n.hash.slice(1);
                }
            }
        }
    },
    methods: {
        tabchange: function(tab: string) {
            this.tab = tab;
        },
        undo: undoState.Undo,
        redo: undoState.Redo,
        save: function() {
            saveState();
            this.$toasted.success("Saved in local store");
        }
    },
    mounted: function() {
        ticker.Start();
        addKeyDownListener(32, togglePlay, this);
        addKeyDownListenerEx(
            e => {
                return e.ctrlKey && !e.shiftKey && e.keyCode === 90 /* z */;
            },
            undoState.Undo,
            this
        );
        addKeyDownListenerEx(
            e => {
                return e.ctrlKey && e.shiftKey && e.keyCode === 90 /* z */;
            },
            undoState.Redo,
            this
        );
        addKeyDownListenerEx(
            e => {
                return e.ctrlKey && e.keyCode === 83 /* s */;
            },
            this.save,
            this
        );
    },
    beforeDestroy: function() {
        ticker.Stop();
        removeKeyDownListeners(this);
    }
});
</script>

<style scoped>
.map-editor {
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
.background-image {
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-position: center;
    background-repeat: no-repeat;
    transition: opacity 0.3s;
}
.tab {
    flex-grow: 1;
    overflow: hidden;
}
.buttons {
    margin: 0 20px;
}
</style>
