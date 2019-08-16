<template>
    <div class="flex player dark-bg">
        <progress-bar></progress-bar>
        <md-button class="md-icon-button" @click="pause">
            <md-icon v-if="playstate.playing">pause</md-icon>
            <md-icon v-else>play_arrow</md-icon>
        </md-button>
        <md-button class="md-icon-button" @click="stop">
            <md-icon>stop</md-icon>
        </md-button>
        <md-switch v-model="playstate.half">Half Speed</md-switch>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { PlayState, MetaState, seekPercent, togglePlay } from "../state";
import progressbar from "./fast-render/playerprogress.vue";

export default Vue.extend({
    components: {
        "progress-bar": progressbar
    },
    computed: {
        playstate: () => PlayState,
        metastate: () => MetaState
    },
    methods: {
        pause: togglePlay,
        stop: function() {
            if (PlayState.music) PlayState.music.pause();
            seekPercent(0);
        }
    }
});
</script>

<style scoped>
.player {
    height: 50px;
}
</style>
