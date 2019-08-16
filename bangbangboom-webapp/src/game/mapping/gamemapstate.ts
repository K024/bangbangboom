import Vue from 'vue'
import { GameMap, TimePoint, copyGameMap } from '../core/MapCore';

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
    }
})

export const GameMapState = state as DeepReadonly<{ s: GameMap }>


