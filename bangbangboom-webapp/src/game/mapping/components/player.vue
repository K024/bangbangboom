<template>
    <div class="flex player">
        <div class="flex center time">{{ playstate.position | time }}</div>
        <div ref="bar" class="bar" @click="barclick">
            <div class="layer flex">
                <div class="mid-line"></div>
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
        <md-checkbox style="margin: 16px" v-model="playstate.rate" :true-value="0.5" :false-value="1">Half Speed</md-checkbox>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { PlayState, MetaState, seekPercent, togglePlay } from "../state";

function SecondToString(s: number) {
    function padZero(n: number, len: number) {
        const str = n.toString();
        if (str.length >= len) return str;
        return ("000000" + n).slice(-len);
    }
    s = Math.abs(s);
    const minutes = Math.floor(s / 60);
    s -= minutes * 60;
    const seconds = Math.floor(s);
    s -= seconds;
    const milis = Math.floor(s * 1000);
    return `${padZero(minutes, 2)}:${padZero(seconds, 2)}.${padZero(milis, 3)}`;
}

export default Vue.extend({
    filters: {
        time: SecondToString
    },
    computed: {
        playstate: () => PlayState,
        metastate: () => MetaState,
        progressTrans: () => {
            const r =
                PlayState.duration > 0
                    ? PlayState.position / PlayState.duration
                    : 0;
            const p = r * 100;
            return { left: `${p}%` };
        }
    },
    methods: {
        pause: togglePlay,
        stop: function() {
            if (PlayState.music) PlayState.music.pause();
            seekPercent(0);
        },
        barclick: function(e: MouseEvent) {
            const bar = this.$refs.bar;
            const x = e.pageX - bar.offsetLeft;
            const p = x / bar.clientWidth;
            seekPercent(p);
        }
    },
    watch: {
        "metastate.musicSrc": function() {
            //
        }
    }
});
</script>

<style scoped>
.player {
    height: 50px;
    background-color: #00000030;
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
    position: relative;
    width: 4px;
    height: 100%;
    background-color: red;
    transition: left 0.1s;
}
</style>
