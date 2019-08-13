<template>
    <div class="flex center">
        <div class="md-title" style="margin: 30px">Mapping is recommended in larger devices</div>
        <md-content style="background-color: black" md-theme="dark" class="map-editor only-g">
            <div class="background-image" :style="backgroundStyle"></div>
            <md-content class="flex fill-w">
                <md-tabs :md-active-tab="tab" @md-changed="tabchange" style="flex-grow: 1">
                    <md-tab id="tab-meta" md-label="Meta"></md-tab>
                    <md-tab id="tab-timing" md-label="Timing"></md-tab>
                    <md-tab id="tab-mapping" md-label="Mapping"></md-tab>
                </md-tabs>
                <md-button class="md-icon-button" @click="$router.back()">
                    <md-icon>navigate_before</md-icon>
                </md-button>
            </md-content>
            <meta-tab class="tab fade-in" v-show="tab === 'tab-meta'"></meta-tab>
            <div class="tab" v-show="tab === 'tab-timing'">timing</div>
            <div class="tab" v-show="tab === 'tab-mapping'">mapping</div>
            <player-bar></player-bar>
        </md-content>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import player from "./components/player.vue";
import meta from "./components/meta.vue";
import { PlayState, MetaState, togglePlay, ticker } from "./state";

function spacePause(e: KeyboardEvent) {
    if (e.keyCode === 32) {
        togglePlay();
    }
}

export default Vue.extend({
    components: {
        "player-bar": player,
        "meta-tab": meta
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
        }
    },
    methods: {
        tabchange: function(tab: string) {
            this.tab = tab;
        }
    },
    mounted: function() {
        ticker.Start();
        window.addEventListener("keydown", spacePause);
    },
    beforeDestroy: function() {
        ticker.Stop();
        window.removeEventListener("keydown", spacePause);
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
    padding: 20px;
    overflow: hidden;
}
</style>
