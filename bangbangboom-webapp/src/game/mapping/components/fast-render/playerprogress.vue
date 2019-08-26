<template>
    <div class="flex bar">
        <div class="flex center time" ref="time"></div>
        <div ref="bar" class="bar" @click="barclick">
            <div class="layer flex">
                <div class="mid-line"></div>
            </div>
            <div class="layer">
                <div class="timepoint" v-for="tp in timepoints" :key="tp.track" :style="{left:leftstyle(tp.time)}"></div>
            </div>
            <div class="layer">
                <div class="progress" ref="progress"></div>
            </div>
        </div>
        <div class="flex center time">{{ playstate.duration | time }}</div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { PlayState, seekPercent, SecondToString } from "../../state";
import { GameMapState } from "../../gamemapstate";
export default Vue.extend({
    filters: {
        time: SecondToString
    },
    computed: {
        playstate: () => PlayState,
        timepoints: () => GameMapState.s.timepoints
    },
    methods: {
        leftstyle: function(time: number) {
            const r = PlayState.duration > 0 ? time / PlayState.duration : 0;
            const p = r * 100;
            return `${p}%`;
        },
        barclick: function(e: MouseEvent) {
            const bar = this.$refs.bar as HTMLElement;
            const x = e.pageX - bar.offsetLeft;
            const p = x / bar.clientWidth;
            seekPercent(p);
        }
    },
    mounted: function() {
        this.$watch(
            () => PlayState.position,
            n => {
                (this.$refs
                    .progress as HTMLElement).style.left = this.leftstyle(n);
                (this.$refs.time as HTMLElement).innerHTML = SecondToString(n);
            },
            { immediate: true }
        );
    }
});
</script>

<style scoped>
.bar {
    flex-grow: 1;
    height: 100%;
    position: relative;
    transform: translate(0, 0);
}
.time {
    margin: 0 20px;
}
.layer {
    position: absolute;
    width: 100%;
    height: 100%;
}
.mid-line {
    width: 100%;
    border-bottom: 1px solid white;
}
.progress {
    position: absolute;
    height: 100%;
    border-left: 4px solid red;
}
.timepoint {
    position: absolute;
    width: 1px;
    height: 50%;
    background-color: aquamarine;
    transition: left 0.2s;
}
</style>
