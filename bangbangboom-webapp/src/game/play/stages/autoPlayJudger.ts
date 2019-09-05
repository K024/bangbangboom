import {  addNoteEvent, musicTimeUpdateEvent } from "./mainStage";
import {  missLatency, perfectLatency } from "../constants";
import { SingleSprite } from "../components/mainlayer/note/single";
import { FlickSprite } from "../components/mainlayer/note/flick";
import { SlideSprite } from "../components/mainlayer/note/slide";



type judgeBasic = {
    time: number,
    lane: number,
    perfect: () => void,
    great: () => void,
    bad: () => void,
    miss: () => void,
}

type judgeNeedPointer = {
    pointerId: number
    pointerLane: number,
} & judgeBasic

type judges = ({
    type: "single",
} | {
    type: "slide_start",
    next: judges & judgeNeedPointer,
} | (({
    type: "flick",
    downTime: number,
    downPos: { x: number, y: number },
} | {
    type: "slide_among",
    next: judges & judgeNeedPointer,
} | {
    type: "slide_end",
} | {
    type: "slide_flick",
    downPos: { x: number, y: number },
}) & judgeNeedPointer)) & judgeBasic

export class autoPlayJudger {
    private pre_notes: judges[] = []

    private in_notes: judges[] = []

    constructor() {
        addNoteEvent.add(this.addNote)
        musicTimeUpdateEvent.add(this.musicTimeUpdate)
    }

    musicTimeUpdate = (t: number) => {
        let n = this.pre_notes[0]
        while (n && n.time - t <= missLatency) {
            this.pre_notes.shift()
            this.in_notes.push(n)
            n = this.pre_notes[0]
        }
        n = this.in_notes[0]
        while (n && n.time - t < -missLatency) {
            this.in_notes.shift()
            n.miss()
            n = this.in_notes[0]
        }
        const list: judges[] = []
        for (const a of this.in_notes) {
            const dt = t - a.time
            if (Math.abs(dt) < perfectLatency) {
                a.perfect()
                list.push(a)
            }

        }
        if (list.length > 0) {
            this.pre_notes = this.pre_notes.filter(n => !list.find(n2 => n === n2))
            this.in_notes = this.in_notes.filter(n => !list.find(n2 => n === n2))
        }
    }

    addNote = (n: SingleSprite | FlickSprite | SlideSprite) => {
        if (n instanceof SingleSprite) {
            this.pre_notes.push({
                type: "single",
                time: n.info.time,
                lane: n.info.lane,
                perfect() { n.perfect() },
                great() { n.great() },
                bad() { n.bad() },
                miss() { n.miss() },
            })
        } else if (n instanceof FlickSprite) {
            this.pre_notes.push({
                type: "flick",
                time: n.info.time,
                lane: n.info.lane,
                pointerLane: -10,
                pointerId: -1,
                downTime: -1,
                downPos: { x: -1, y: -1 },
                perfect() { n.perfect() },
                great() { n.great() },
                bad() { n.bad() },
                miss() { n.miss() },
            })
        } else if (n instanceof SlideSprite) {
            const { notes, flickend } = n.info
            let i = notes.length - 1
            let end: judgeNeedPointer & judges
            if (flickend) {
                const j = i
                end = {
                    type: "slide_flick",
                    time: notes[i].time,
                    lane: notes[i].lane,
                    pointerLane: -10,
                    pointerId: -1,
                    downPos: { x: -1, y: -1 },
                    perfect() { n.perfect(j) },
                    great() { n.great(j) },
                    bad() { n.bad(j) },
                    miss() { n.miss(j) },
                }
            } else {
                const j = i
                end = {
                    type: "slide_end",
                    time: notes[i].time,
                    lane: notes[i].lane,
                    pointerLane: -10,
                    pointerId: -1,
                    perfect() { n.perfect(j) },
                    great() { n.great(j) },
                    bad() { n.bad(j) },
                    miss() { n.miss(j) },
                }
            }
            this.pre_notes.push(end)
            i--;
            while (i > 0) {
                const end2 = () => end;
                const k = i
                const j: judges = {
                    type: "slide_among",
                    time: notes[i].time,
                    lane: notes[i].lane,
                    next: end2(),
                    pointerLane: -10,
                    pointerId: -1,
                    perfect() { n.perfect(k) },
                    great() { n.great(k) },
                    bad() { n.great(k) },
                    miss() { n.miss(k) },
                }
                this.pre_notes.push(j)
                end = j
                i--;
            }
            const j = i
            const e = end
            this.pre_notes.push({
                type: "slide_start",
                time: notes[i].time,
                lane: notes[i].lane,
                next: e,
                perfect() { n.perfect(j) },
                great() { n.great(j) },
                bad() { n.great(j) },
                miss() { n.miss(j) },
            })
        }
        this.pre_notes.sort((a, b) => a.time - b.time)
    }

    destroy() {
        addNoteEvent.remove(this.addNote)
        musicTimeUpdateEvent.remove(this.musicTimeUpdate)
    }
}
