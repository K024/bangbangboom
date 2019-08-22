<template>
    <div class="pad flex">
        <div v-for="o in padopacities" :key="o.id">
            <div :style="{opacity: o.opacity}"></div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { PlayState, minTicker, SoundTime } from "../../state";
import { MinTicker } from "@/game/core/Ticker";
import { lazyObject } from "@/tools/functions";

import { assets } from "../../../assets/assetsmap";
import { TimePoint } from "../../../core/MapCore";
import { GameMapState } from "../../gamemapstate";

const sounds = lazyObject({
    tick: () => new Howl({ src: assets.timing_tick }),
    tack: () => new Howl({ src: assets.timing_tack })
});

export default Vue.extend({
    props: {
        mute: { type: Boolean },
        selected: { type: TimePoint }
    },
    data: function() {
        return {
            active: true
        };
    },
    computed: {
        padopacities: function(): Array<{ id: number; opacity: number }> {
            if (!this.active) return [];
            const tp =
                this.selected ||
                GameMapState.s.getCurrentTimePoint(PlayState.position);
            if (!tp) return [];
            const beatinfo = tp.getBeat(PlayState.position);
            if (!beatinfo) return [];

            const r: number[] = [];
            for (let i = 1; i <= tp.bpb; i++) {
                if (i === beatinfo.beat) {
                    let opacity = (0.2 - beatinfo.offset) * 5;
                    if (opacity < 0) opacity = 0;
                    r.push(opacity);
                    // r.push(1);
                } else r.push(0);
            }
            return r.map((v, i) => ({ id: i, opacity: v }));
        }
    },
    methods: {
        mintick: function() {
            // defined later
        }
    },
    mounted: function() {
        const soundload = sounds.tick && sounds.tack;
        this.active = true;
        this.$watch(
            () => SoundTime.value,
            (n, p) => {
                if (
                    !this.active ||
                    !PlayState.music ||
                    !PlayState.playing ||
                    this.mute
                )
                    return;
                const tp =
                    this.selected || GameMapState.s.getCurrentTimePoint(n);
                if (!tp) return;
                const beatinfo = tp.getBeat(n);
                if (!beatinfo) return;
                const off = n - p;
                if (off > 0.1) return;
                if (beatinfo.offset < off) {
                    if (beatinfo.beat === 1) sounds.tick.play();
                    else sounds.tack.play();
                }
            }
        );
        minTicker.Start();
    },
    activated: function() {
        this.active = true;
    },
    deactivated: function() {
        this.active = false;
    },
    beforeDestroy: function() {
        minTicker.Stop();
    }
});
</script>

<style scoped>
.pad {
    height: 80px;
    padding: 10px;
    transform: translate(0, 0);
}
.pad > * {
    flex-grow: 1;
    height: 100%;
    margin: 10px;
    border: solid 3px cornflowerblue;
    border-radius: 5px;
    overflow: hidden;
}
.pad :first-child {
    border-color: darkorange;
}
.pad > * > * {
    width: 100%;
    height: 100%;
    background-color: cornflowerblue;
    will-change: opacity;
}
.pad :first-child > * {
    background-color: darkorange;
}
</style>
