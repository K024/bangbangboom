<template>
    <div ref="container" @click="click">
        <div class="bar" :style="barstyle">
            <canvas ref="canvas" width="100" :height="barheight"></canvas>
            <progressbar class="progress" :time-height-factor="barTimeHeightFactor"></progressbar>
        </div>
        <div class="view-port" :style="viewportstyle"></div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { PlayState } from "../../state";
import { SelectPosition, timelist, beatline1 } from "./state";
import { GameMapState } from "../../gamemapstate";
import { Slide, Single, Flick } from "@/game/core/MapCore";
import progressbar from "./tracksprogress";
import { SecondToString } from '@/tools/functions';

const barTimeHeightFactor = 30; // 1s => n px height

export default Vue.extend({
    components: {
        progressbar
    },
    props: {
        timeHeightFactor: {
            type: Number,
            required: true
        }
    },
    data: function() {
        return {
            height: 0,
            activate: true
        };
    },
    computed: {
        playstate: () => PlayState,
        position: () => SelectPosition.p,
        paddedDuration: () => PlayState.duration * 1.2,
        barTimeHeightFactor: () => barTimeHeightFactor,
        barheight: function(): number {
            return barTimeHeightFactor * this.paddedDuration;
        },
        barstyle: function(): any {
            if (!this.activate) return {};
            const height = this.barheight;
            if (height <= this.height) {
                return {
                    height,
                    bottom: 0
                };
            }
            const p = this.position / this.paddedDuration;
            const transx = this.height * p - height * p;
            return {
                height: height + "px",
                transform: `translateY(${-transx}px)`
            };
        },
        viewportstyle: function(): any {
            if (!this.activate) return {};
            const height =
                (this.height / this.timeHeightFactor) * barTimeHeightFactor;
            let h = this.height;
            if (this.barheight < this.height) {
                h = this.barheight;
            }
            const transx = (h * this.position) / this.paddedDuration;
            return {
                height: height + "px",
                transform: `translateY(${-transx}px)`
            };
        },
        timelist: function(): number[] {
            return timelist(2, this.paddedDuration);
        }
    },
    methods: {
        resize: function() {
            const c = this.$refs.container as HTMLElement;
            this.height = c.clientHeight;
        },
        click: function(e: MouseEvent) {
            const c = this.$refs.container as HTMLElement;
            const rect = c.getBoundingClientRect();
            const y = e.clientY - rect.top;
            let h = this.height;
            if (this.barheight < this.height) {
                h = this.barheight;
            }
            const by =
                c.clientHeight - y - parseFloat(this.viewportstyle.height) / 2;
            let target = (by / h) * this.paddedDuration;
            if (target < 0) target = 0;
            if (target > PlayState.duration) target = PlayState.duration;
            SelectPosition.p = target;
        }
    },
    mounted: function() {
        this.resize();
        window.addEventListener("resize", this.resize);
        const canvas = this.$refs.canvas as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const crossline = (y: number) => {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(100, y);
            ctx.stroke();
        };
        const arc = (x: number, y: number) => {
            ctx.beginPath();
            ctx.lineTo(x, y);
            ctx.arcTo(x + 5, y + 5, x + 10, y, 7);
            ctx.arcTo(x + 5, y - 5, x, y, 7);
            ctx.fill();
        };
        this.$watch(
            () => {
                if (!this.activate) return;
                const getY = (time: number) =>
                    (this.paddedDuration - time) * barTimeHeightFactor;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.font = "12px";
                ctx.lineWidth = 1;

                ctx.strokeStyle = "gray";
                for (const t of beatline1()) {
                    crossline(getY(t.time));
                }

                ctx.fillStyle = "aquamarine";
                ctx.strokeStyle = "aquamarine";
                for (const t of GameMapState.s.timepoints) {
                    const y = getY(t.time);
                    crossline(y);
                    ctx.fillText(t.bpm + "", 80, y - 3);
                }

                ctx.fillStyle = "white";
                for (const t of this.timelist) {
                    ctx.fillText(
                        SecondToString(t).split(".")[0],
                        0,
                        getY(t) - 3
                    );
                }

                ctx.fillStyle = "rgb(173,255,47,0.2)";
                for (const t of GameMapState.s.timepoints) {
                    const off = t.time;
                    const dt = t.beatTime() / 24;
                    for (const s of t.notes) {
                        if (s instanceof Slide) {
                            for (let i = 0; i < s.notes.length - 1; i++) {
                                const from = s.notes[i];
                                const to = s.notes[i + 1];
                                const fromx = from.lane * 10 + 15;
                                const fromy = getY(from.time * dt + off);
                                const tox = to.lane * 10 + 15;
                                const toy = getY(to.time * dt + off);
                                ctx.beginPath();
                                ctx.lineTo(fromx, fromy);
                                ctx.lineTo(fromx + 10, fromy);
                                ctx.lineTo(tox + 10, toy);
                                ctx.lineTo(tox, toy);
                                ctx.fill();
                            }
                        }
                    }
                }

                for (const t of GameMapState.s.timepoints) {
                    const off = t.time;
                    const dt = t.beatTime() / 24;
                    for (const n of t.notes) {
                        if (n instanceof Single) {
                            ctx.fillStyle = "rgba(21,224,225)";
                            const x = n.lane * 10 + 15;
                            const y = getY(n.time * dt + off);
                            arc(x, y)
                        } else if (n instanceof Flick) {
                            ctx.fillStyle = "rgba(255,59,114)";
                            const x = n.lane * 10 + 15;
                            const y = getY(n.time * dt + off);
                            ctx.beginPath();
                            ctx.lineTo(x, y);
                            ctx.lineTo(x + 5, y + 3);
                            ctx.lineTo(x + 10, y);
                            ctx.lineTo(x + 5, y - 3);
                            ctx.fill();
                        } else if (n instanceof Slide) {
                            ctx.fillStyle = "rgba(1,219,1)";
                            ctx.strokeStyle = "rgba(1,219,1)";
                            ctx.lineWidth = 2;
                            let i = 0;
                            let x = n.notes[i].lane * 10 + 15;
                            let y = getY(n.notes[i].time * dt + off);
                            ctx.beginPath();
                            arc(x, y)
                            i++;
                            while (i < n.notes.length - 1) {
                                x = n.notes[i].lane * 10 + 15;
                                y = getY(n.notes[i].time * dt + off);
                                ctx.beginPath();
                                ctx.lineTo(x, y);
                                ctx.lineTo(x + 10, y);
                                ctx.stroke();
                                i++;
                            }
                            if (n.flickend) ctx.fillStyle = "rgba(255,59,114)";
                            x = n.notes[i].lane * 10 + 15;
                            y = getY(n.notes[i].time * dt + off);
                            arc(x, y)
                        }
                    }
                }
            },
            () => {
                /** empty */
            },
            { immediate: true }
        );
    },
    activated() {
        this.activate = true;
    },
    deactivated() {
        this.activate = false;
    },
    beforeDestroy: function() {
        window.removeEventListener("resize", this.resize);
    }
});
</script>

<style scoped>
.view-port {
    position: absolute;
    width: 100%;
    background-color: #fff;
    opacity: 0.2;
    transition: opacity 0.2s;
    bottom: 0;
    will-change: opacity transform;
}
.view-port:hover {
    opacity: 0.4;
}
.bar {
    position: absolute;
    width: 100%;
    bottom: 0;
    will-change: transform;
}
.progress {
    position: absolute;
    width: 100%;
    border-bottom: 2px solid red;
    bottom: 0;
    will-change: transform;
    opacity: 0.7;
}
canvas {
    width: 100%;
    height: 100%;
}
</style>