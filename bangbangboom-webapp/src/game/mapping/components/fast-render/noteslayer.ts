import Vue, { VNode, CreateElement } from 'vue';
import { GameMapState, Actions } from '../../gamemapstate';
import { Single, Flick, Slide, trackid, Note } from '@/game/core/MapCore';
import { assets } from '@/game/assets/assetsmap';
import { lazyObject } from '@/tools/functions';
import { minTicker, SoundTime, PlayState } from '../../state';
import { soundList } from './state';


const sounds = lazyObject({
    perfect: () => new Howl({ src: assets.perfect }),
    flick: () => new Howl({ src: assets.flick }),
    long: () => new Howl({ src: assets.long, loop: true })
});

let longCounter = 0;

function bs(list: (i: number) => number, length: number, target: number, ) {
    let l = 0
    let r = length - 1
    if (length <= 0) return -1
    if (target < list(l)) return -1
    if (list(r) <= target) return r
    while (l < r - 1) {
        const m = Math.floor((l + r) / 2)
        const v = list(m)
        if (target < v) r = m
        else if (v < target) l = m
        else return m
    }
    return l
}

export default Vue.extend({
    props: {
        timeHeightFactor: {
            type: Number,
            required: true
        },
        tool: {
            type: String,
            required: true
        },
        width: {
            type: Number,
            required: true
        }
    },
    data: function () {
        return {
            active: true
        }
    },
    methods: {
        bottompx: function (t: number) {
            return this.timeHeightFactor * t + "px";
        },
    },
    mounted: function () {
        minTicker.Start()
        const loaded = sounds.perfect && sounds.long && sounds.flick
        this.$watch(() => SoundTime.value, (n, p) => {
            if (
                !this.active ||
                !PlayState.music ||
                !PlayState.playing
            ) return
            if (Math.abs(n - p) > 0.1) {
                let t = 0
                let i = 0
                longCounter = 0
                while (t <= n && i < soundList.l.length) {
                    const s = soundList.l[i]
                    t = s.time
                    i++
                    if (s.type === "longstart") longCounter++;
                    else if (s.type === "longend") longCounter--;
                }
            } else {
                const index = bs(i => soundList.l[i].time, soundList.l.length, n)
                const pindex = bs(i => soundList.l[i].time, soundList.l.length, p) + 1
                if (index < 0) return
                for (let i = pindex; i <= index; i++) {
                    const s = soundList.l[i]
                    if (p < s.time) {
                        switch (s.type) {
                            case "perfect":
                                sounds.perfect.play()
                                break
                            case "flick":
                                sounds.flick.play()
                                break
                            case "longstart":
                                if (longCounter === 0)
                                    sounds.long.play()
                                longCounter++
                                break
                            case "longend":
                                longCounter--
                                if (longCounter === 0)
                                    sounds.long.pause()
                        }
                    }
                }
            }
        })
        this.$watch(() => PlayState.playing, n => !n && sounds.long.pause())
    },
    deactivated: function () {
        this.active = false
    },
    activated: function () {
        this.active = true
    },
    beforeDestroy: function () {
        minTicker.Stop()
    },
    render(h): VNode {
        const list: VNode[] = [];
        const click = (e: MouseEvent, tpid: string, noteid: string, slideid?: string) => {
            e.stopPropagation()
            if (this.tool !== "delete") return
            if (!slideid)
                Actions.removeNote(tpid, noteid)
            else {
                Actions.removeSlideNote(tpid, slideid, noteid);
            }
        }
        for (const tp of GameMapState.s.timepoints) {
            const off = tp.time;
            const bt = tp.beatTime();
            for (const note of tp.notes) {
                const attrs = (n: Single | Flick, src: string) => {
                    return {
                        attrs: {
                            src: src
                        },
                        staticClass: "note",
                        on: {
                            click: (e: MouseEvent) => click(e, tp.track, note.track),
                            dragstart: (e: DragEvent) => this.$emit("drag", e, tp.track, note.track),
                        },
                        key: note.track,
                        style: {
                            left: n.lane * 10 + 15 + "%",
                            bottom: this.bottompx(
                                off + (bt * n.time) / 24
                            )
                        }
                    }
                }
                if (note instanceof Single) {
                    list.push(h("img", attrs(note, assets.note_normal)));
                } else if (note instanceof Flick) {
                    list.push(h("img", attrs(note, assets.note_flick)));
                } else if (note instanceof Slide) {
                    const on = (n: Single) => {
                        return {
                            click: (e: MouseEvent) => click(e, tp.track, n.track, note.track),
                            dragstart: (e: DragEvent) => this.$emit("drag", e, tp.track, n.track, note.track),
                        }
                    }
                    const style = (n: Single) => {
                        return {
                            left: n.lane * 10 + 15 + "%",
                            bottom: this.bottompx(
                                off + (bt * n.time) / 24
                            )
                        }
                    }
                    let i = 0
                    {
                        const start = note.notes[i]
                        list.push(h("img", {
                            attrs: {
                                src: assets.note_long
                            },
                            staticClass: "note",
                            on: on(start),
                            key: start.track,
                            style: style(start)
                        }))
                    }
                    i++
                    while (i < note.notes.length - 1) {
                        const n = note.notes[i]
                        list.push(h("img", {
                            attrs: {
                                src: assets.note_slide_among
                            },
                            staticClass: "note",
                            on: on(n),
                            key: n.track,
                            style: style(n)
                        }))
                        i++;
                    }
                    {
                        const end = note.notes[i]
                        list.push(h("img", {
                            attrs: {
                                src: note.flickend ? assets.note_flick : assets.note_long
                            },
                            staticClass: "note",
                            on: {
                                click: (e: MouseEvent) => {
                                    e.stopPropagation()
                                    if (this.tool !== 'delete')
                                        Actions.setFlickEnd(tp.track, note.track, !note.flickend)
                                    else
                                        click(e, tp.track, end.track, note.track)
                                },
                                dragstart: (e: DragEvent) => this.$emit("drag", e, tp.track, end.track, note.track),
                            },
                            key: end.track,
                            style: style(end)
                        }))
                    }
                    for (i = 0; i < note.notes.length - 1; i++) {
                        const from = note.notes[i]
                        const to = note.notes[i + 1]
                        const b = (t: number) =>
                            this.timeHeightFactor * t
                        const bottom = b(off + (bt * from.time) / 24)
                        const top = b(off + (bt * to.time) / 24)
                        const dh = top - bottom
                        const dw = this.width * (from.lane - to.lane) * 0.1
                        list.push(h("div", {
                            staticClass: "slide-among",
                            key: from.track + to.track,
                            on: {
                                click: (e: MouseEvent) => {
                                    e.stopPropagation()
                                    this.$emit("newmid", e, tp.track, note.track)
                                }
                            },
                            style: {
                                bottom: bottom + "px",
                                height: dh + "px",
                                transform: `skew(${Math.atan2(dw, dh)}rad)`,
                                left: (from.lane + to.lane) * 5 + 15 + "%",
                            }
                        }))
                    }
                }
            }
        }
        return h("div", {}, list);
    }
});
