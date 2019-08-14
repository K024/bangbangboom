<template>
    <div class="flex player dark-bg">
        <div class="flex center time">{{ playstate.position | time }}</div>
        <div ref="bar" class="bar" @click="barclick">
            <div class="layer flex">
                <div class="mid-line"></div>
            </div>
            <div class="layer">
                <div class="timepoint" v-for="tp in timepoints" :key="tp.track" :style="leftstyle(tp.time)"></div>
            </div>
            <div class="layer">
                <div class="progress" :style="progressTrans"></div>
            </div>
        </div>
        <div class="flex center time">{{ playstate.duration | time }}</div>
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
import {
    PlayState,
    MetaState,
    seekPercent,
    togglePlay,
    SecondToString,
    GameMapState
} from "../state";

export default Vue.extend({
    filters: {
        time: SecondToString
    },
    computed: {
        playstate: () => PlayState,
        metastate: () => MetaState,
        progressTrans: function(): object {
            return this.leftstyle(PlayState.position);
        },
        timepoints: () => GameMapState.timepoints
    },
    methods: {
        pause: togglePlay,
        stop: function() {
            if (PlayState.music) PlayState.music.pause();
            seekPercent(0);
        },
        barclick: function(e: MouseEvent) {
            const bar = this.$refs.bar as HTMLElement;
            const x = e.pageX - bar.offsetLeft;
            const p = x / bar.clientWidth;
            seekPercent(p);
        },
        leftstyle: function(time: number) {
            const r = PlayState.duration > 0 ? time / PlayState.duration : 0;
            const p = r * 100;
            return { left: `${p}%` };
        }
    }
});
</script>

<style scoped>
.player {
    height: 50px;
}
.time {
    margin: 0 20px;
}
.bar {
    flex-grow: 1;
    height: 100%;
    position: relative;
}
.layer {
    position: absolute;
    width: 100%;
    height: 100%;
}
.mid-line {
    height: 1px;
    width: 100%;
    background-color: white;
}
.progress {
    position: absolute;
    width: 4px;
    height: 100%;
    background-color: red;
    transition: left 0.1s;
}
.timepoint {
    position: absolute;
    width: 1px;
    height: 50%;
    background-color: aquamarine;
    transition: left 0.2s;
}
</style>
