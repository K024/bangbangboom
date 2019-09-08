import { GameEvent } from "../utils/event";
import { SingleSprite } from "../components/mainlayer/note/single";
import { FlickSprite } from "../components/mainlayer/note/flick";
import { SlideSprite } from "../components/mainlayer/note/slide";
import { addNoteEvent, musicTimeUpdateEvent, MainGame, musicId } from "./mainStage";
import { missLatency, perfectLatency, greatLatency, badLatency, judgeOffset } from "../constants";
import { buttonSoundEvent } from "./soundEffect";
import { lightBaseParticle } from "../components/mainlayer/particle/lightBaseParticle";
import { hitParticalEvent } from "../components/mainlayer/particleLayer";


// tslint:disable-next-line: interface-name class-name interface-over-type-literal
type judgeBasic = {
    time: number,
    lane: number,
    perfect: () => void,
    great: () => void,
    bad: () => void,
    miss: () => void,
}

type judgeNeedDown = {
    downTime: number
    downPos: { x: number, y: number }
    pointerId: number
    pointerLane: number
} & judgeBasic

type judges =
    ({ type: "single" } & judgeBasic) |
    ({ type: "slide_start" } & { next: judgeNeedDown & judges } & judgeBasic) |
    ({ type: "flick" } & judgeNeedDown) |
    ({ type: "slide_among" } & { next: judgeNeedDown & judges } & judgeNeedDown) |
    ({ type: "slide_end" } & judgeNeedDown) |
    ({ type: "slide_flick" } & judgeNeedDown & { currentPos: { x: number, y: number } })

/** id, type, lane number */
export const intereactEvent = new GameEvent<[number, string, number, { x: number, y: number }]>()

/**
 * 有 slide among 的情况下 slide end 会提前判定
 */
// tslint:disable-next-line: class-name
export class judger {

    private pre_notes: judges[] = []

    private in_notes: judges[] = []

    private needed_pointer = new Map<number, judges & judgeNeedDown>()

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
                // tslint:disable: no-shadowed-variable
                const nn = n.next as any
                nn.type = "slide_start"
            } else if (n.next.type === "slide_end") {
                const nn = n.next as any
                nn.type = "single"
            } else if (n.next.type === "slide_flick") {
                const nn = n.next as any
                nn.type = "flick"
                nn.downPos = { x: -1, y: -1 }
                nn.downTime = -1
            }
            if ("pointerId" in n)
                this.needed_pointer.delete(n.pointerId)
            n.next.pointerId = -1
            n.next.pointerLane = -10
        }
    }

    handle = (id: number, type: string, lane: number, pos: { x: number, y: number }) => {
        const list: judges[] = []
        const currentTime = this.getMusicTime()
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
            ns.sort((a, b) => Math.abs(a.time - currentTime) - Math.abs(b.time - currentTime))
            const n = ns[0]
            const dt = Math.abs(currentTime - n.time)
            if (n.type === "single") {
                if (dt <= perfectLatency) n.perfect()
                else if (dt <= greatLatency) n.great()
                else if (dt <= badLatency) n.bad()
                else n.miss()
                list.push(n)
            } else if (n.type === "flick") {
                n.downTime = currentTime
                n.downPos = pos
                this.needed_pointer.set(id, n)
            } else if (n.type === "slide_start") {
                if (dt > badLatency) {
                    this.slideMiss(n)
                } else {
                    if (dt <= perfectLatency) n.perfect()
                    else if (dt <= greatLatency) n.great()
                    else n.bad()

                    this.needed_pointer.set(id, n.next)
                    n.next.pointerId = id
                    n.next.pointerLane = lane
                    n.next.downPos = pos
                    n.next.downTime = currentTime
                }
                list.push(n)
            }
        } else if (type.endsWith("move")) {
            const n = this.needed_pointer.get(id)
            if (n) {
                n.pointerLane = lane
                if (n.type === "flick") {
                    const dx = n.downPos.x - pos.x
                    const dy = n.downPos.y - pos.y
                    if (Math.sqrt(dx * dx + dy * dy) > 5) {
                        if (currentTime - n.downTime > badLatency) n.miss()
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
                    const dt = n.time - currentTime
                    if (dt > badLatency) { // not in the judge time, update finger position only
                        n.downPos = pos
                    }
                    n.currentPos = pos
                } else if (n.type === "slide_among") {
                    n.downPos = pos;
                    n.downTime = currentTime;
                }
            }
        } else if (type.endsWith("up") || type.endsWith("out") || type.endsWith("leave") || type.endsWith("cancel")) {
            const n = this.needed_pointer.get(id)
            if (n) {
                list.push(n)
                this.needed_pointer.delete(id)
                if (n.type === "flick" || n.type === "slide_flick") {
                    n.miss()
                } else if (n.type === "slide_among") {
                    this.slideMiss(n)
                } else if (n.type === "slide_end") {
                    const dt = Math.abs(n.time - currentTime)
                    if (dt <= badLatency) n.perfect()
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
            if (a.type === "slide_among" || a.type === "slide_start" || a.type === "slide_flick") {
                const dt = t - a.time
                if (dt >= 0) {
                    if (a.type === "slide_flick") {
                        const dx = a.downPos.x - a.currentPos.x
                        const dy = a.downPos.y - a.currentPos.y
                        if (Math.sqrt(dx * dx + dy * dy) > 5) {
                            if (Math.abs(dt) > badLatency) n.miss()
                            else n.perfect()
                            this.needed_pointer.delete(a.pointerId)
                            list.push(n)
                        }
                    } else if (dt >= a.next.time - a.time) {
                        this.slideMiss(a)
                        list.push(a)
                    } else if (a.type === "slide_among" && Math.abs(a.lane - a.pointerLane) < 1.1) {
                        a.perfect()
                        this.needed_pointer.set(a.pointerId, a.next)
                        a.next.pointerId = a.pointerId
                        a.next.pointerLane = a.pointerLane
                        a.next.downPos = a.downPos
                        a.next.downTime = a.downTime
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
            const slide_start = (note: { time: number, lane: number }, i: number, next: judges & judgeNeedDown) => {
                return {
                    type: "slide_start" as "slide_start",
                    time: note.time,
                    lane: note.lane,
                    next,
                    perfect() { n.perfect(i) },
                    great() { n.great(i) },
                    bad() { n.great(i) },
                    miss() { n.miss(i) },
                }
            }
            const slide_among = (note: { time: number, lane: number }, i: number, next: judges & judgeNeedDown) => {
                return {
                    type: "slide_among" as "slide_among",
                    time: note.time,
                    lane: note.lane,
                    next,
                    pointerLane: -10,
                    pointerId: -1,
                    downTime: -1,
                    downPos: { x: -1, y: -1 },
                    perfect() { n.perfect(i) },
                    great() { n.great(i) },
                    bad() { n.great(i) },
                    miss() { n.miss(i) },
                }
            }
            const slide_end = (note: { time: number, lane: number }, i: number) => {
                return {
                    type: "slide_end" as "slide_end",
                    time: note.time,
                    lane: note.lane,
                    pointerLane: -10,
                    pointerId: -1,
                    downTime: -1,
                    downPos: { x: -1, y: -1 },
                    perfect() { n.perfect(i) },
                    great() { n.great(i) },
                    bad() { n.bad(i) },
                    miss() { n.miss(i) },
                }
            }
            const slide_flick = (note: { time: number, lane: number }, i: number) => {
                return {
                    type: "slide_flick" as "slide_flick",
                    time: note.time,
                    lane: note.lane,
                    pointerLane: -10,
                    pointerId: -1,
                    downPos: { x: -1, y: -1 },
                    currentPos: { x: -1, y: -1 },
                    downTime: -1,
                    perfect() { n.perfect(i) },
                    great() { n.great(i) },
                    bad() { n.bad(i) },
                    miss() { n.miss(i) },
                }
            }
            const notes = n.info.notes
            const flickend = n.info.flickend
            let i = notes.length - 1
            let end: judgeNeedDown & judges
            if (flickend) {
                end = slide_flick(notes[i], i)
            } else {
                end = slide_end(notes[i], i)
            }
            this.pre_notes.push(end)
            i--;
            while (i > 0) {
                const j = slide_among(notes[i], i, end)
                this.pre_notes.push(j)
                end = j
                i--;
            }
            this.pre_notes.push(slide_start(notes[i], i, end))
        }
        this.pre_notes.sort((a, b) => a.time - b.time)
    }

    destroy() {
        addNoteEvent.remove(this.addNote)
        musicTimeUpdateEvent.remove(this.musicTimeUpdate)
        intereactEvent.remove(this.handle)
    }
}

