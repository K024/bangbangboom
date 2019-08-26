<template>
    <div>
        <div class="timing">
            <div class="panel">
                <div class="md-title">Time points</div>
                <md-table class="dark-bg" v-model="timepoints" :md-selected-value.sync="selected">
                    <md-table-empty-state md-description="No time points"></md-table-empty-state>
                    <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="single">
                        <md-table-cell md-label="Time offset">{{item.time | time}}</md-table-cell>
                        <md-table-cell md-label="BPM">{{item.bpm}}</md-table-cell>
                        <md-table-cell md-label="Meter">{{item.bpb}}/4</md-table-cell>
                    </md-table-row>
                </md-table>
                <md-button class="md-accent" :disabled="!selected" @click="remove">Remove</md-button>
            </div>
            <div class="panel">
                <timing-pad :mute="mute || measuring" :selected="selected"></timing-pad>
                <md-button
                    :md-ripple="false"
                    @click="measure"
                    :disabled="!selected"
                >{{selected ? 'Hit here or press \'t\' 5 times and more to measure' : 'Select a timepoint first'}}</md-button>
                <div class="flex">
                    <div>
                        <md-field>
                            <label>Time offset</label>
                            <md-input v-model="inputoffset" type="number" step="0.001"></md-input>
                        </md-field>
                    </div>
                    <md-button class="md-icon-button" @click="movebeat(false)">
                        <md-icon>navigate_before</md-icon>
                    </md-button>
                    <md-button class="md-icon-button" @click="movebeat(true)">
                        <md-icon>navigate_next</md-icon>
                    </md-button>
                    <md-button @click="setoffset">Set to current</md-button>
                </div>
                <div class="flex">
                    <div>
                        <md-field>
                            <label>BPM</label>
                            <md-input v-model="inputbpm" type="number" step="0.001"></md-input>
                        </md-field>
                    </div>
                    <div>
                        <md-field>
                            <label>Meter</label>
                            <md-input v-model="inputbpb" type="number"></md-input>
                            <span class="md-suffix">/4</span>
                        </md-field>
                    </div>
                </div>
                <div class="flex">
                    <md-button @click="set" :disabled="!(canset && selected)">Modify</md-button>
                    <md-button @click="set" :disabled="!(canset && !selected)">Add new</md-button>
                    <md-switch v-model="mute">Mute ticker</md-switch>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { SecondToString, PlayState, ticker } from "../state";
import { TimePoint, trackid } from "../../core/MapCore";
import {
    debounce,
    lazyObject,
    addKeyDownListener,
    removeKeyDownListeners,
    addKeyDownListenerEx
} from "../../../tools/functions";
import timingpad from "./fast-render/timingpad.vue";
import { GameMapState, Actions } from "../gamemapstate";

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

export default Vue.extend({
    filters: {
        time: SecondToString
    },
    components: {
        "timing-pad": timingpad
    },
    data: function() {
        return {
            selectedid: "",
            inputoffset: "1",
            inputbpm: "120",
            inputbpb: "4",
            measuring: false,
            taps: [] as number[],
            mute: false
        };
    },
    computed: {
        timepoints: () => GameMapState.s.timepoints,
        selected: {
            get(): DeepReadonly<TimePoint> | null {
                return (
                    this.timepoints.find(t => t.track === this.selectedid) ||
                    null
                );
            },
            set(value: DeepReadonly<TimePoint> | null) {
                if (value) this.selectedid = value.track;
                else this.selectedid = "";
            }
        },
        canset: function(): boolean {
            return (
                (this.inputbpb && this.inputbpm && this.inputoffset && true) ||
                false
            );
        }
    },
    methods: {
        setoffset: function() {
            this.inputoffset = PlayState.position.toFixed(3);
        },
        set: function() {
            const off = parseFloat(this.inputoffset) || 1;
            const bpm = parseFloat(this.inputbpm) || 120;
            const bpb = parseInt(this.inputbpb) || 4;
            const item = this.timepoints.find(t => t.time === off);
            if (item && this.selected !== item) {
                this.selected = item;
                return;
            }
            if (this.selected) {
                Actions.setTimePoint(this.selectedid, off, bpm, bpb);
            } else {
                Actions.addTimePoint(trackid(), off, bpm, bpb);
            }
        },
        remove: function() {
            Actions.removeTimePoint(this.selectedid);
            this.selected = null;
        },
        stopmeasure: function() {
            // later debounced
            this.measuring = false;
            this.set();
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
        addKeyListeners: function() {
            addKeyDownListener(46 /* del */, this.remove, this);
            addKeyDownListener(84 /* t */, this.measure, this);
            addKeyDownListener(13 /* enter */, this.set, this);
            addKeyDownListener(27 /* esc */, this.unselect, this);
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
        this.stopmeasure = debounce(3000, this.stopmeasure);
    },
    activated: function() {
        this.addKeyListeners();
    },
    deactivated: function() {
        removeKeyDownListeners(this);
    }
});
</script>

<style scoped>
.timing {
    width: 100%;
    max-width: 1000px;
    margin: 20px auto;
    display: flex;
}
.md-table {
    margin: 20px 0;
    max-height: 60vh;
    overflow: auto;
}
.panel {
    flex: 1 1;
    display: flex;
    max-width: 50%;
    min-width: 50%;
    flex-direction: column;
    align-items: stretch;
    padding: 30px;
}
.flex {
    flex-wrap: wrap;
}
.flex > * {
    margin: 0 10px;
    flex-grow: 1;
}
.md-icon-button {
    flex-grow: 0;
}
.md-switch {
    min-height: 40px;
    align-items: center;
}
</style>
