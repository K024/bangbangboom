import { GameEvent } from "../utils/event";
import { SingleSprite } from "../components/mainlayer/note/single";
import { FlickSprite } from "../components/mainlayer/note/flick";
import { SlideSprite } from "../components/mainlayer/note/slide";
import { addNoteEvent, musicTimeUpdateEvent, MainGame, musicId } from "./mainStage";
import { missLatency, perfectLatency, greatLatency, badLatency, judgeOffset } from "../constants";
import { buttonSoundEvent } from "./soundEffect";
import { lightBaseParticle } from "../components/mainlayer/particle/lightBaseParticle";
import { hitParticalEvent } from "../components/mainlayer/particleLayer";


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


/** id, type, lane number */
export const intereactEvent = new GameEvent<[number, string, number, { x: number, y: number }]>()

/**
 * 有 slide among 的情况下 slide end 会提前判定
 */
export class judger {

    private pre_notes: judges[] = []

    private in_notes: judges[] = []

    private needed_pointer = new Map<number, judges & judgeNeedPointer>()

    getMusicTime() {
        return (MainGame.audios.song.seek(undefined, musicId) as number) + judgeOffset / 1000
    }

    constructor() {
        addNoteEvent.add(this.addNote)
        musicTimeUpdateEvent.add(this.musicTimeUpdate)
        intereactEvent.add(this.handle)
    }

    slideMiss(n: judges) {
        if (n.type === "slide_among" || n.type === "slide_start") {
            n.miss()
            if (n.next.type === "slide_among") {
                const nn = n.next as any
                nn.type = "slide_start"
            } else if (n.next.type === "slide_end") {
                const nn = n.next as any
                nn.type = "single"
            } else if (n.next.type === "slide_flick") {
                const nn = n.next as any
                nn.type = "flick"
            }
            if ("pointerId" in n)
                this.needed_pointer.delete(n.pointerId)
            const nn = n.next as any
            n.next.pointerId = -1
            n.next.pointerLane = -10
        }
    }

    handle = (id: number, type: string, lane: number, pos: { x: number, y: number }) => {
        const list: judges[] = []
        const t = this.getMusicTime()
        if (type.endsWith("down")) {
            const ns = this.in_notes.filter(n => {
                return (n.type === "single" ||
                    n.type === "flick" ||
                    n.type === "slide_start")
                    && Math.abs(n.lane - lane) < 1.1
            })
            if (ns.length <= 0) {
                if (lane >= 0) {
                    buttonSoundEvent.emit()
                    hitParticalEvent.emit(new lightBaseParticle(lane))
                }
                return
            }
            ns.sort((a, b) => Math.abs(a.time - t) - Math.abs(b.time - t))
            const n = ns[0]
            const dt = Math.abs(t - n.time)
            if (n.type === "single") {
                if (dt <= perfectLatency) n.perfect()
                else if (dt <= greatLatency) n.great()
                else if (dt <= badLatency) n.bad()
                else n.miss()
                list.push(n)
            } else if (n.type === "flick") {
                n.downTime = t
                n.downPos = pos
                this.needed_pointer.set(id, n)
            } else if (n.type === "slide_start") {
                if (dt <= perfectLatency) n.perfect()
                else if (dt <= greatLatency) n.great()
                else if (dt <= badLatency) n.bad()
                else this.slideMiss(n)
                this.needed_pointer.set(id, n.next)
                n.next.pointerId = id
                n.next.pointerLane = lane
                list.push(n)
            }
        } else if (type.endsWith("move")) {
            const n = this.needed_pointer.get(id)
            if (n) {
                n.pointerLane = lane
                if (n.type === "flick") {
                    const dx = n.downPos.x - pos.x
                    const dy = n.downPos.y - pos.y
                    if (Math.sqrt(dx * dx + dy * dy) > 10) {
                        if (t - n.downTime > badLatency) n.miss()
                        else {
                            const dt = Math.abs(n.time - n.downTime)
                            if (dt <= perfectLatency) n.perfect()
                            else if (dt <= greatLatency) n.great()
                            else if (dt <= badLatency) n.bad()
                            else n.miss()
                        }
                        list.push(n)
                        this.needed_pointer.delete(id)
                    }
                } else if (n.type === "slide_flick") {
                    const dt = n.time - t
                    if (dt > badLatency) {
                        n.downPos = pos
                    } else {
                        const dx = n.downPos.x - pos.x
                        const dy = n.downPos.y - pos.y
                        if (Math.sqrt(dx * dx + dy * dy) > 10) {
                            if (Math.abs(dt) > badLatency) n.miss()
                            else n.perfect()
                            this.needed_pointer.delete(id)
                            list.push(n)
                        }
                    }
                }
            }
        } else if (type.endsWith("up") /*|| type.endsWith("out") || type.endsWith("leave") || type.endsWith("cancel")*/) {
            const n = this.needed_pointer.get(id)
            if (n) {
                list.push(n)
                this.needed_pointer.delete(id)
                if (n.type === "flick" || n.type === "slide_flick") {
                    n.miss()
                } else if (n.type === "slide_among") {
                    this.slideMiss(n)
                }
                else if (n.type === "slide_end") {
                    const dt = Math.abs(n.time - t)
                    if (dt <= perfectLatency) n.perfect()
                    else if (dt <= greatLatency) n.great()
                    else if (dt <= badLatency) n.bad()
                    else n.miss()
                }
            }
        }
        if (list.length > 0) {
            this.pre_notes = this.pre_notes.filter(n => !list.find(n2 => n === n2))
            this.in_notes = this.in_notes.filter(n => !list.find(n2 => n === n2))
        }
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
            if (a.type === "slide_among" || a.type === "slide_start") {
                const dt = t - a.time
                if (dt >= 0) {
                    if (dt >= a.next.time - a.time) {
                        this.slideMiss(a)
                        list.push(a)
                    } else if (a.type === "slide_among" && Math.abs(a.lane - a.pointerLane) < 1.5) {
                        a.perfect()
                        this.needed_pointer.set(a.pointerId, a.next)
                        a.next.pointerId = a.pointerId
                        a.next.pointerLane = a.pointerLane
                        list.push(a)
                    }
                }
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
        intereactEvent.remove(this.handle)
    }
}

