<template>
    <div class="timing">
        <div class="panel">
            <div class="md-title">Time points</div>
            <md-table class="dark-bg" v-model="timepoints" @md-selected="onselect" :md-selected-value="selected">
                <md-table-empty-state md-description="No time points"></md-table-empty-state>
                <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="single">
                    <md-table-cell md-label="Time offset">{{item.time | time}}</md-table-cell>
                    <md-table-cell md-label="BPM">{{item.bpm}}</md-table-cell>
                    <md-table-cell md-label="Meter">{{item.bpb}}/4</md-table-cell>
                </md-table-row>
            </md-table>
            <div class="flex">
                <md-button class="md-accent" :disabled="!selected" @click="remove">Remove</md-button>
            </div>
        </div>
        <div class="panel">
            <div class="test-bar fill-w flex">
                <div v-for="o in padopacities" :key="o.id">
                    <div :style="{opacity: o.opacity}"></div>
                </div>
            </div>
            <md-button
                :md-ripple="false"
                class="fill-w"
                @click="measure"
                :disabled="!selected"
            >Hit here or press 't' 5 times and more to measure</md-button>
            <div class="flex">
                <md-field>
                    <label>Time offset</label>
                    <md-input v-model="inputoffset" type="number" step="0.001"></md-input>
                </md-field>
                <div>
                    <md-button class="md-icon-button" @click="movebeat(false)">
                        <md-icon>navigate_before</md-icon>
                    </md-button>
                </div>
                <div>
                    <md-button class="md-icon-button" @click="movebeat(true)">
                        <md-icon>navigate_next</md-icon>
                    </md-button>
                </div>
                <div>
                    <md-button @click="setoffset">Set to current</md-button>
                </div>
            </div>
            <div class="flex">
                <md-field>
                    <label>BPM</label>
                    <md-input v-model="inputbpm" type="number" step="0.001"></md-input>
                </md-field>
                <md-field style="margin-left: 20px">
                    <label>Meter</label>
                    <md-input v-model="inputbpb" type="number"></md-input>
                    <span class="md-suffix">/4</span>
                </md-field>
            </div>
            <div class="flex">
                <md-button @click="set" :disabled="!(inputbpb && inputbpm && inputoffset && selected)">Modify</md-button>
                <md-button @click="set" :disabled="!(inputbpb && inputbpm && inputoffset && !selected)">Add new</md-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { GameMapState, SecondToString, PlayState, ticker } from "../state";
import { TimePoint } from "../../core/MapCore";
import {
    debounce,
    lazyObject,
    addKeyDownListener,
    removeKeyDownListeners
} from "../../../tools/functions";

import tickurl from "../../assets/timing_tick.wav";
import tackurl from "../../assets/timing_tack.wav";

const sounds = lazyObject({
    tick: () => new Howl({ src: tickurl }),
    tack: () => new Howl({ src: tackurl })
});

function calcmeasure(taps: number[]) {
    const d = Math.floor(taps.length / 2);
    let sum = 0;
    let i = 0;
    for (; i + d < taps.length; i++) {
        sum += taps[i + d] - taps[i];
    }
    const beattime = sum / d / i;
    const bpm = 60 / beattime;
    sum = 0;
    i = 0;
    for (; i < taps.length; i++) {
        sum += taps[i] - i * beattime;
    }
    const offset = sum / i;
    return {
        bpm,
        offset
    };
}

let lastsoundid = 0;
let lastposition = 0;

export default Vue.extend({
    filters: {
        time: SecondToString
    },
    data: function() {
        return {
            selected: null as null | TimePoint,
            inputoffset: "1",
            inputbpm: "120",
            inputbpb: "4",
            measuring: false,
            taps: [] as number[],
            padopacities: [] as Array<{ id: number; opacity: number }>
        };
    },
    computed: {
        timepoints: () => GameMapState.timepoints
    },
    methods: {
        onselect: function(item: TimePoint) {
            this.selected = item;
        },
        setoffset: function() {
            this.inputoffset = PlayState.position.toFixed(3);
        },
        set: function() {
            const off = parseFloat(this.inputoffset) || 1;
            const bpm = parseFloat(this.inputbpm) || 120;
            const bpb = parseInt(this.inputbpb) || 4;
            const item = GameMapState.timepoints.find(t => t.time === off);
            if (item && this.selected !== item) {
                this.selected = item;
                return;
            }
            if (this.selected) {
                this.selected.time = off;
                this.selected.bpm = bpm;
                this.selected.bpb = bpb;
            } else {
                const tp = new TimePoint();
                tp.time = off;
                tp.bpm = bpm;
                tp.bpb = bpb;
                GameMapState.timepoints.push(tp);
            }
            GameMapState.timepoints.sort((a, b) => {
                return a.time - b.time;
            });
        },
        remove: function() {
            const index =
                (this.selected &&
                    GameMapState.timepoints.indexOf(this.selected)) ||
                -1;
            if (index >= 0) GameMapState.timepoints.splice(index, 1);
            this.selected = null;
        },
        stopmeasure: function() {
            // later debounced
            this.measuring = false;
        },
        measure: function() {
            if (!this.selected || !PlayState.playing) return;
            if (!this.measuring) this.taps = [];
            this.measuring = true;
            this.stopmeasure();
            this.taps.push(PlayState.position);
            if (this.taps.length >= 5) {
                const { bpm, offset } = calcmeasure(this.taps);
                this.inputbpm = bpm.toFixed(3);
                this.inputoffset = offset.toFixed(3);
                this.set();
            }
        },
        movebeat: function(forward = false) {
            let back = 60 / (parseFloat(this.inputbpm) || 120);
            if (forward) back = -back;
            this.inputoffset = (parseFloat(this.inputoffset) - back).toFixed(3);
            if (this.selected) this.set();
        },
        unselect: function() {
            this.selected = null;
        },
        tick: function() {
            if (PlayState.position === lastposition) return;
            lastposition = PlayState.position;
            this.padopacities = (() => {
                const tp =
                    this.selected ||
                    GameMapState.getCurrentTimePoint(lastposition);
                if (!tp) return [];
                const beatinfo = tp.getBeat(lastposition);
                if (!beatinfo) return [];

                const r: number[] = [];
                for (let i = 1; i <= tp.bpb; i++) {
                    if (i === beatinfo.beat) {
                        let opacity = (0.2 - beatinfo.offset) * 5;
                        if (opacity < 0) opacity = 0;
                        r.push(opacity);
                        if (!PlayState.playing) {
                            lastsoundid = -1;
                        } else if (
                            beatinfo.offset *
                                (PlayState.half ? 0.5 : 1) *
                                500 <=
                                ticker.lastFrame &&
                            !this.measuring &&
                            lastsoundid !== i
                        ) {
                            if (i === 1) sounds.tick.play();
                            else sounds.tack.play();
                            lastsoundid = i;
                        }
                    } else r.push(0);
                }
                return r.map((v, i) => ({ id: i, opacity: v }));
            })();
        }
    },
    watch: {
        selected: function(n: TimePoint) {
            if (n) {
                this.inputoffset = n.time.toFixed(3);
                this.inputbpm = n.bpm.toFixed(3);
                this.inputbpb = n.bpb.toFixed(0);
            }
        }
    },
    mounted: function() {
        addKeyDownListener(46 /* del */, this.remove, this);
        addKeyDownListener(84 /* t */, this.measure, this);
        addKeyDownListener(13 /* enter */, this.set, this);
        addKeyDownListener(27 /* esc */, this.unselect, this);
        this.stopmeasure = debounce(3000, this.stopmeasure);
        const soundloaded = sounds.tick && sounds.tack;
        ticker.Tick.add(this.tick);
    },
    beforeDestroy: function() {
        removeKeyDownListeners(this);
        ticker.Tick.delete(this.tick);
    }
});
</script>

<style scoped>
.timing {
    display: flex;
    justify-content: center;
    padding: 20px;
}
.md-table {
    margin: 20px 0;
    max-height: 60vh;
    overflow: auto;
}
.panel {
    flex-grow: 1;
    max-width: 400px;
    margin: 30px;
}
.test-bar {
    height: 80px;
    padding: 10px;
    transform: translate(0, 0);
}
.test-bar > * {
    flex-grow: 1;
    height: 100%;
    margin: 10px;
    border: solid 3px cornflowerblue;
    border-radius: 5px;
    overflow: hidden;
}
.test-bar :first-child {
    border-color: darkorange;
}
.test-bar > * > * {
    width: 100%;
    height: 100%;
    background-color: cornflowerblue;
}
.test-bar :first-child > * {
    background-color: darkorange;
}
</style>
