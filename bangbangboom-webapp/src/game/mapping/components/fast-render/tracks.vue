<template>
    <div @wheel="scroll">
        <div class="panel" ref="panel" @mousemove="mouseMove" @click="click" @dragover="allowdrop" @drop="drop">
            <div class="layer">
                <div class="line" v-for="i in [15,25,35,45,55,65,75,85]" :key="i" :style="{left: i + '%'}"></div>
            </div>
            <div class="layer">
                <div class="time" v-for="t in timeList" :key="t" :style="{bottom: bottompx(t)}">{{ t | time }}</div>
            </div>
            <div class="layer">
                <div class="timepoint" v-for="t in timepoints" :key="t.track" :style="{bottom: bottompx(t.time)}">
                    <div style="position: absolute;left: 0">{{t.time | time}}</div>
                    <div style="position: absolute;right: 0">{{t.bpm}}</div>
                </div>
            </div>
            <div class="layer">
                <div
                    class="beatline1"
                    v-for="b in beatline1"
                    :key="b.time"
                    :style="{bottom: bottompx(b.time)}"
                >{{b.name}}</div>
            </div>
            <div class="layer" v-show="division % 2 === 0">
                <div class="subline beatline2" v-for="b in beatline2" :key="b" :style="{bottom: bottompx(b)}"></div>
            </div>
            <div class="layer" v-show="division % 3 === 0">
                <div class="subline beatline3" v-for="b in beatline3" :key="b" :style="{bottom: bottompx(b)}"></div>
            </div>
            <div class="layer" v-show="division % 4 === 0">
                <div class="subline beatline4" v-for="b in beatline4" :key="b" :style="{bottom: bottompx(b)}"></div>
            </div>
            <div class="layer">
                <img class="note preview" v-if="previewNote" :src="previewNote.src" :style="previewNote" />
                <img
                    class="note preview"
                    v-if="previewSlideNote && previewNote"
                    :src="previewNote.src"
                    :style="previewSlideNote"
                />
            </div>
            <div class="layer">
                <progressbar class="progress" :time-height-factor="timeHeightFactor"></progressbar>
            </div>
            <notes
                class="layer"
                :timeHeightFactor="timeHeightFactor"
                :tool="tool"
                :width="width"
                @drag="drag"
                @newmid="newmid"
            ></notes>
        </div>
    </div>
</template>

<script lang="ts">
import Vue, { VNode } from "vue";
import { PlayState, SecondToString } from "../../state";
import {
    SelectPosition,
    timelist,
    beatline1,
    beatline3,
    beatline2,
    beatline4,
    nearestBeatTime
} from "./state";
import { GameMapState, Actions } from "../../gamemapstate";
import { assets } from "@/game/assets/assetsmap";
import { trackid, Note, TimePoint } from "@/game/core/MapCore";
import notes from "./noteslayer";
import progressbar from "./tracksprogress";

export default Vue.extend({
    filters: {
        time: SecondToString
    },
    components: {
        notes: notes,
        progressbar
    },
    props: {
        timeHeightFactor: {
            type: Number,
            required: true
        },
        division: {
            type: Number,
            required: true
        },
        tool: {
            type: String,
            required: true
        }
    },
    data: function() {
        return {
            width: 0,
            mouseTime: 0,
            mouseLane: -1,
            dropNote: {
                tpid: "",
                noteid: "",
                slideid: "" as string | undefined
            },
            previewSlideNote: null as { left: string; bottom: string } | null,
            previewSlideNoteData: {
                offset: 0,
                tp: "",
                lane: 0
            },
            active: true
        };
    },
    computed: {
        position: () => SelectPosition.p,
        paddedDuration: () => PlayState.duration * 1.2,
        timeList: function(): number[] {
            return timelist(2, this.paddedDuration);
        },
        timepoints: () => GameMapState.s.timepoints,
        beatline1: () => beatline1(),
        beatline2: () => beatline2(),
        beatline3: () => beatline3(),
        beatline4: () => beatline4(),
        previewNote: function(): any {
            if (this.tool === "none") return null;
            if (this.mouseLane < 0) return null;
            const t = nearestBeatTime(this.mouseTime, this.division);
            if (!t) return null;
            let src = "";
            switch (this.tool) {
                case "normal":
                    src = assets.note_normal;
                    break;
                case "flick":
                    src = assets.note_flick;
                    break;
                case "slide":
                    src = assets.note_long;
                    break;
            }
            return {
                left: this.mouseLane * 10 + 15 + "%",
                bottom: this.bottompx(t.time),
                src: src
            };
        },
        assets: () => assets
    },
    methods: {
        resize: function() {
            const c = this.$refs.panel as HTMLElement;
            this.width = c.clientWidth;
        },
        bottompx: function(t: number) {
            return this.timeHeightFactor * t + "px";
        },
        scroll: function(e: WheelEvent) {
            const dt = e.deltaY / this.timeHeightFactor;
            let target = SelectPosition.p - dt;
            if (target < 0) target = 0;
            if (target > PlayState.duration) target = PlayState.duration;
            SelectPosition.p = target;
        },
        mouseMove: function(e: MouseEvent) {
            const p = this.$refs.panel as HTMLElement;
            const rect = p.getBoundingClientRect();
            const y = rect.bottom - e.clientY;
            const x = e.clientX - rect.left;
            this.mouseTime = y / this.timeHeightFactor;
            let l = Math.floor((x / rect.width) * 10 - 1.5);
            if (l < 0) l = -1;
            if (l > 6) l = -1;
            this.mouseLane = l;
        },
        click: function(e: MouseEvent) {
            if (this.tool === "none") return;
            if (this.mouseLane < 0) return;
            const t = nearestBeatTime(this.mouseTime, this.division);
            if (!t) return;
            switch (this.tool) {
                case "normal":
                    Actions.addSingle(
                        t.timepoint,
                        this.mouseLane,
                        t.beatoffset,
                        trackid()
                    );
                    break;
                case "flick":
                    Actions.addFlick(
                        t.timepoint,
                        this.mouseLane,
                        t.beatoffset,
                        trackid()
                    );
                    break;
                case "slide":
                    if (this.previewSlideNote) {
                        const d = this.previewSlideNoteData;
                        if (d.tp === t.timepoint) {
                            Actions.addSlide(
                                t.timepoint,
                                d.lane,
                                d.offset,
                                this.mouseLane,
                                t.beatoffset,
                                trackid(),
                                trackid(),
                                trackid()
                            );
                        }
                        this.previewSlideNote = null;
                    } else {
                        this.previewSlideNote = {
                            bottom: this.previewNote.bottom as string,
                            left: this.previewNote.left as string
                        };
                        this.previewSlideNoteData = {
                            offset: t.beatoffset,
                            lane: this.mouseLane,
                            tp: t.timepoint
                        };
                    }
                    break;
            }
        },
        newmid: function(e: MouseEvent, tpid: string, slideid: string) {
            this.mouseMove(e);
            if (this.mouseLane < 0) return;
            const t = nearestBeatTime(this.mouseTime, this.division);
            if (!t || t.timepoint !== tpid) return;
            Actions.addSlideMid(
                tpid,
                slideid,
                this.mouseLane,
                t.beatoffset,
                trackid()
            );
        },
        allowdrop: function(e: DragEvent) {
            e.preventDefault();
        },
        drag: function(
            e: DragEvent,
            tpid: string,
            noteid: string,
            slideid?: string
        ) {
            this.dropNote.tpid = tpid;
            this.dropNote.noteid = noteid;
            this.dropNote.slideid = slideid;
        },
        drop: function(e: DragEvent) {
            e.preventDefault();
            this.mouseMove(e);
            const t = nearestBeatTime(this.mouseTime, this.division);
            if (!t) return;
            if (!this.dropNote.slideid) {
                Actions.moveSingleOrFlick(
                    this.dropNote.tpid,
                    this.dropNote.noteid,
                    this.mouseLane,
                    t.beatoffset,
                    t.timepoint
                );
            } else {
                if (this.dropNote.tpid === t.timepoint)
                    Actions.moveSlideNote(
                        this.dropNote.tpid,
                        this.dropNote.slideid,
                        this.dropNote.noteid,
                        this.mouseLane,
                        t.beatoffset
                    );
            }
        }
    },
    mounted: function() {
        const p = this.$refs.panel as HTMLElement;
        this.$watch(
            () => this.position * this.timeHeightFactor,
            n => {
                if (!this.active) return;
                p.style.transform = `translateY(${this.position *
                    this.timeHeightFactor}px)`;
            },
            { immediate: true }
        );
        this.$watch(
            () => this.timeHeightFactor * this.paddedDuration,
            n => {
                if (!this.active) return;
                p.style.height =
                    this.paddedDuration * this.timeHeightFactor + "px";
            },
            { immediate: true }
        );
        this.resize();
        this.$watch(() => this.tool, n => (this.previewSlideNote = null));
        window.addEventListener("resize", this.resize);
    },
    activated: function() {
        this.active = true;
    },
    deactivated: function() {
        this.active = false;
    },
    beforeDestroy: function() {
        window.removeEventListener("resize", this.resize);
    }
});
</script>

<style scoped>
.panel {
    width: 100%;
    position: absolute;
    bottom: 0;
    will-change: transform;
}
.layer {
    width: 100%;
    height: 100%;
    position: absolute;
    pointer-events: none;
}
.line {
    border-left: 1px solid lightgray;
    height: 100%;
    position: absolute;
}
.time {
    position: absolute;
}
.timepoint {
    position: absolute;
    color: aquamarine;
    width: 95%;
    border-bottom: 1px aquamarine solid;
    height: 1.5em;
}
.beatline1 {
    position: absolute;
    text-align: right;
    width: 80%;
    right: 5%;
    border-bottom: 1px lightgray solid;
}
.subline {
    position: absolute;
    width: 70%;
    left: 15%;
}
.beatline2 {
    border-bottom: 1px solid gray;
}
.beatline3 {
    border-bottom: 1px dashed firebrick;
}
.beatline4 {
    border-bottom: 1px dashed darkslateblue;
}
.preview {
    opacity: 0.5;
}
.progress {
    position: absolute;
    width: 80%;
    left: 10%;
    border-bottom: 2px solid red;
    bottom: 0;
    will-change: transform;
    opacity: 0.7;
}
</style>

<style>
.note {
    transform: translateY(50%) scale(1.2);
    width: 10%;
    position: absolute;
    pointer-events: auto;
    z-index: 1;
    min-height: 10px;
}
.slide-among {
    background: greenyellow;
    opacity: 0.2;
    width: 10%;
    position: absolute;
    pointer-events: auto;
}
</style>