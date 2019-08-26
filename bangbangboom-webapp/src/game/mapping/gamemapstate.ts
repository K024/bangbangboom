import Vue from 'vue'
import { GameMap, TimePoint, copyGameMap, Single, Flick, Note, Slide } from '../core/MapCore';

const init = (() => {
    const s = localStorage.getItem("gamemapstate")
    return s && GameMap.fromMapString(s) || new GameMap()
})()

function getInit() {
    return copyGameMap(init)
}

const done: Array<() => void> = []
const todo: Array<() => void> = []

const state = Vue.observable({
    s: getInit()
})

export const undoState = Vue.observable({
    canUndo: false,
    canRedo: false,

    Undo() {
        if (done.length <= 0) return
        const action = done.pop()
        if (!action) return
        todo.push(action)

        state.s = getInit()
        done.forEach(a => a())

        undoState.canUndo = done.length > 0
        undoState.canRedo = true
    },

    Redo() {
        if (todo.length <= 0) return
        const action = todo.pop()
        if (!action) return
        done.push(action)

        action()

        undoState.canRedo = todo.length > 0
        undoState.canUndo = true
    }
})

export function saveState() {
    localStorage.setItem("gamemapstate", state.s.toMapString())
}


function MakeAction<TArgs extends any[]>(func: (...args: TArgs) => any) {
    return function (...args: TArgs) {
        const action = () => func(...args)
        done.push(action)
        undoState.canUndo = true
        undoState.canRedo = false
        todo.length = 0
        return action()
    }
}

function MakeActions<T extends { [key: string]: (...args: any) => any }>(actions: T) {
    for (const key in actions) {
        actions[key] = MakeAction(actions[key]) as T[Extract<keyof T, string>]
    }
    return actions
}

function comparator(a: Note, b: Note) {
    const i = a.getTime() - b.getTime()
    if (i !== 0) return i
    const l = a.getLane() - b.getLane()
    if (l === 0) Vue.toasted.info("Same Location Notes!")
    return l
}

export const Actions = MakeActions({
    addTimePoint(trackid: string, offset: number, bpm: number, bpb: number) {
        const tp = new TimePoint()
        tp.time = offset
        tp.bpm = bpm
        tp.bpb = Math.floor(bpb)
        tp.track = trackid
        state.s.timepoints.push(tp)
        state.s.timepoints.sort((a, b) => a.time - b.time)
    },
    removeTimePoint(trackid: string) {
        const i = state.s.timepoints.findIndex(tp => tp.track === trackid)
        if (i >= 0) state.s.timepoints.splice(i, 1)
    },
    setTimePoint(trackid: string, offset?: number, bpm?: number, bpb?: number) {
        const t = state.s.timepoints.find(tp => tp.track === trackid)
        if (t) {
            if (offset && offset > 0) t.time = offset
            if (bpm && bpm > 0) t.bpm = bpm
            if (bpb && bpb > 0) t.bpb = Math.floor(bpb)
            state.s.timepoints.sort((a, b) => a.time - b.time)
        }
    },
    addSingle(tpid: string, lane: number, offsetbeat: number, noteid: string) {
        const tp = state.s.timepoints.find(x => x.track === tpid)
        if (!tp) return
        const s = new Single()
        s.track = noteid
        s.time = offsetbeat
        s.lane = lane
        tp.notes.push(s)
        tp.notes.sort(comparator)
    },
    addFlick(tpid: string, lane: number, offsetbeat: number, noteid: string) {
        const tp = state.s.timepoints.find(x => x.track === tpid)
        if (!tp) return
        const s = new Flick()
        s.track = noteid
        s.time = offsetbeat
        s.lane = lane
        tp.notes.push(s)
        tp.notes.sort(comparator)
    },
    addSlide(tpid: string, lane1: number, offsetbeat1: number,
        lane2: number, offsetbeat2: number, noteid1: string, // tslint:disable-line
        noteid2: string, noteid3: string) { // tslint:disable-line
        const tp = state.s.timepoints.find(x => x.track === tpid)
        if (!tp) return
        const s = new Slide()
        s.track = noteid1
        const n1 = new Single()
        n1.lane = lane1
        n1.time = offsetbeat1
        n1.track = noteid2
        const n2 = new Single()
        n2.lane = lane2
        n2.time = offsetbeat2
        n2.track = noteid3
        s.notes.push(n1, n2)
        s.notes.sort(comparator)
        tp.notes.push(s)
        tp.notes.sort(comparator)
    },
    addSlideMid(tpid: string, slideid: string, lane: number, offsetbeat: number, noteid: string) {
        const tp = state.s.timepoints.find(x => x.track === tpid)
        if (!tp) return
        const s = tp.notes.find(x => x.track === slideid)
        if (s && s instanceof Slide) {
            const n = new Single()
            n.lane = lane
            n.time = offsetbeat
            n.track = noteid
            s.notes.push(n)
            s.notes.sort(comparator)
            tp.notes.sort(comparator)
        }
    },
    moveSingleOrFlick(tpid: string, noteid: string, lane: number, offsetbeat: number, ntpid?: string) {
        const tp = state.s.timepoints.find(x => x.track === tpid)
        if (!tp) return
        const index = tp.notes.findIndex(x => x.track === noteid)
        if (index < 0) return
        const note = tp.notes[index]
        if (note instanceof Single || note instanceof Flick) {
            note.time = offsetbeat
            note.lane = lane
            if (!ntpid || ntpid === tpid) {
                tp.notes.sort(comparator)
                return
            }
            const ntp = state.s.timepoints.find(x => x.track === ntpid)
            if (!ntp) return
            tp.notes.splice(index, 1)
            ntp.notes.push(note)
            ntp.notes.sort(comparator)
        }
    },
    moveSlideNote(tpid: string, slideid: string, noteid: string, lane: number, offsetbeat: number) {
        const tp = state.s.timepoints.find(x => x.track === tpid)
        if (!tp) return
        const index = tp.notes.findIndex(x => x.track === slideid)
        if (index < 0) return
        const s = tp.notes[index]
        if (s instanceof Slide) {
            const n = s.notes.find(x => x.track === noteid)
            const n2 = s.notes.find(x => x.time === offsetbeat)
            if (!n || (n2 && n2 !== n)) return
            n.lane = lane
            n.time = offsetbeat
            s.notes.sort(comparator)
            tp.notes.sort(comparator)
        }
    },
    setFlickEnd(tpid: string, slideid: string, flickend: boolean) {
        const tp = state.s.timepoints.find(x => x.track === tpid)
        if (!tp) return
        const index = tp.notes.findIndex(x => x.track === slideid)
        if (index < 0) return
        const s = tp.notes[index]
        if (s instanceof Slide) {
            s.flickend = flickend
        }
    },
    removeNote(tpid: string, noteid: string) {
        const tp = state.s.timepoints.find(x => x.track === tpid)
        if (!tp) return
        const index = tp.notes.findIndex(x => x.track === noteid)
        if (index >= 0) tp.notes.splice(index, 1)
    },
    removeSlideNote(tpid: string, slideid: string, noteid: string) {
        const tp = state.s.timepoints.find(x => x.track === tpid)
        if (!tp) return
        const index = tp.notes.findIndex(n => n.track === slideid)
        if (index < 0) return
        const s = tp.notes[index]
        if (s instanceof Slide) {
            if (s.notes.length <= 2) tp.notes.splice(index, 1)
            else {
                const i = s.notes.findIndex(x => x.track === noteid)
                if (i < 0) return
                s.notes.splice(i, 1)
            }
        }
    }
})

export const GameMapState = state as DeepReadonly<{ s: GameMap }>


