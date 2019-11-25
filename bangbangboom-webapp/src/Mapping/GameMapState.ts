import { observable } from "mobx"
import { GameMapFromString, GameMapToString, Note, Point, GameMap, TimePoint, Single, Flick, Slide, IdItem } from "./core/MapCore"

function FromStorage() {
  return GameMapFromString(localStorage.getItem("gamemapstate") || "")
}

let initmap = FromStorage()

const state = observable({
  map: JSON.parse(JSON.stringify(initmap)) as GameMap
})

export function SaveToStorage() {
  localStorage.setItem("gamemapstate", GameMapToString(state.map))
}

const done: Array<() => void> = []
const todo: Array<() => void> = []

export const undoState = observable({
  canUndo: false,
  canRedo: false,

  Undo() {
    if (done.length <= 0) return
    const action = done.pop()
    if (!action) return
    todo.push(action)

    state.map = JSON.parse(JSON.stringify(initmap))
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

export function ResetMap(mapstring = "") {
  done.length = 0
  todo.length = 0
  undoState.canUndo = false
  undoState.canRedo = false
  initmap = GameMapFromString(mapstring)
  state.map = JSON.parse(JSON.stringify(initmap))
}

function MakeAction<TArgs extends any[]>(func: (...args: TArgs) => any) {
  return function (...args: TArgs) {
    const action = () => func(...args)
    const ret = action()
    if (ret !== "failed") {
      done.push(action)
      undoState.canUndo = true
      undoState.canRedo = false
      todo.length = 0
    }
    return ret
  }
}

function MakeActions<T extends { [key: string]: (...args: any) => any }>(actions: T) {
  for (const key in actions) {
    actions[key] = MakeAction(actions[key]) as T[Extract<keyof T, string>]
  }
  return actions
}

function getTime(n: Note | Point) {
  if (!("type" in n) || n.type !== "slide") return n.time
  return n.notes[0].time
}
function getLane(n: Note | Point) {
  if (!("type" in n) || n.type !== "slide") return n.lane
  return n.notes[0].lane
}
function comparator(a: Note | Point, b: Note | Point) {
  const i = getTime(a) - getTime(b)
  if (i !== 0) return i
  const l = getLane(a) - getLane(b)
  return l
}

export const Actions = MakeActions({
  addTimePoint(trackid: string, offset: number, bpm: number, bpb: number) {
    const tp: TimePoint = {
      offset, bpm, bpb, notes: [], id: trackid
    }
    state.map.timepoints.push(tp)
    state.map.timepoints = state.map.timepoints.slice().sort((a, b) => a.offset - b.offset)
  },
  removeTimePoint(trackid: string) {
    const i = state.map.timepoints.findIndex(tp => tp.id === trackid)
    if (i >= 0) state.map.timepoints.splice(i, 1)
    else return "failed"
  },
  setTimePoint(trackid: string, offset?: number, bpm?: number, bpb?: number) {
    const t = state.map.timepoints.find(tp => tp.id === trackid)
    if (t) {
      if (offset && offset > 0) t.offset = offset
      if (bpm && bpm > 0) t.bpm = bpm
      if (bpb && bpb > 0) t.bpb = Math.floor(bpb)
      state.map.timepoints = state.map.timepoints.slice().sort((a, b) => a.offset - b.offset)
    } else return "failed"
  },
  addSingle(tpid: string, lane: number, offsetbeat: number, noteid: string) {
    const tp = state.map.timepoints.find(x => x.id === tpid)
    if (!tp) return "failed"
    const s: Single = {
      type: "single",
      time: offsetbeat,
      lane,
      id: noteid
    }
    tp.notes.push(s)
    tp.notes = tp.notes.slice().sort(comparator)
  },
  addFlick(tpid: string, lane: number, offsetbeat: number, noteid: string) {
    const tp = state.map.timepoints.find(x => x.id === tpid)
    if (!tp) return "failed"
    const s: Flick = {
      type: 'flick',
      id: noteid,
      time: offsetbeat,
      lane,
    }
    tp.notes.push(s)
    tp.notes = tp.notes.slice().sort(comparator)
  },
  addSlide(tpid: string, lane1: number, offsetbeat1: number,
    lane2: number, offsetbeat2: number, noteid1: string, // tslint:disable-line
    noteid2: string, noteid3: string) { // tslint:disable-line
    const tp = state.map.timepoints.find(x => x.id === tpid)
    if (!tp) return "failed"
    const s: Slide = {
      type: "slide",
      flickend: false,
      id: noteid1,
      notes: [{
        time: offsetbeat1, lane: lane1, id: noteid2
      }, {
        time: offsetbeat2, lane: lane2, id: noteid3
      }],
    }
    s.notes = s.notes.slice().sort(comparator)
    tp.notes.push(s)
    tp.notes = tp.notes.slice().sort(comparator)
  },
  addSlideMid(tpid: string, slideid: string, lane: number, offsetbeat: number, noteid: string) {
    const tp = state.map.timepoints.find(x => x.id === tpid)
    if (!tp) return "failed"
    const s = tp.notes.find(x => x.id === slideid)
    if (s && s.type === "slide") {
      const n: Point & IdItem = {
        id: noteid,
        time: offsetbeat,
        lane
      }
      s.notes.push(n)
      s.notes = s.notes.slice().sort(comparator)
      tp.notes = tp.notes.slice().sort(comparator)
    } else return "failed"
  },
  moveSingleOrFlick(tpid: string, noteid: string, lane: number, offsetbeat: number, ntpid?: string) {
    const tp = state.map.timepoints.find(x => x.id === tpid)
    if (!tp) return "failed"
    const index = tp.notes.findIndex(x => x.id === noteid)
    if (index < 0) return "failed"
    const note = tp.notes[index]
    if (note.type !== "slide") {
      note.time = offsetbeat
      note.lane = lane
      if (!ntpid || ntpid === tpid) {
        tp.notes = tp.notes.slice().sort(comparator)
        return
      }
      const ntp = state.map.timepoints.find(x => x.id === ntpid)
      if (!ntp) return "failed"
      tp.notes.splice(index, 1)
      ntp.notes.push(note)
      ntp.notes = ntp.notes.slice().sort(comparator)
    } else return "failed"
  },
  moveSlideNote(tpid: string, slideid: string, noteid: string, lane: number, offsetbeat: number) {
    const tp = state.map.timepoints.find(x => x.id === tpid)
    if (!tp) return "failed"
    const index = tp.notes.findIndex(x => x.id === slideid)
    if (index < 0) return "failed"
    const s = tp.notes[index]
    if (s.type === "slide") {
      const n = s.notes.find(x => x.id === noteid)
      const n2 = s.notes.find(x => x.time === offsetbeat)
      if (!n || (n2 && n2 !== n)) return "failed"
      n.lane = lane
      n.time = offsetbeat
      s.notes = s.notes.slice().sort(comparator)
      tp.notes = tp.notes.slice().sort(comparator)
    } else return "failed"
  },
  setFlickEnd(tpid: string, slideid: string, flickend: boolean) {
    const tp = state.map.timepoints.find(x => x.id === tpid)
    if (!tp) return "failed"
    const index = tp.notes.findIndex(x => x.id === slideid)
    if (index < 0) return "failed"
    const s = tp.notes[index]
    if (s.type !== "slide") return "failed"
    s.flickend = flickend
  },
  removeNote(tpid: string, noteid: string) {
    const tp = state.map.timepoints.find(x => x.id === tpid)
    if (!tp) return "failed"
    const index = tp.notes.findIndex(x => x.id === noteid)
    if (index < 0) return "failed"
    tp.notes.splice(index, 1)
  },
  removeSlideNote(tpid: string, slideid: string, noteid: string) {
    const tp = state.map.timepoints.find(x => x.id === tpid)
    if (!tp) return "failed"
    const index = tp.notes.findIndex(n => n.id === slideid)
    if (index < 0) return "failed"
    const s = tp.notes[index]
    if (s.type === "slide") {
      if (s.notes.length <= 2) tp.notes.splice(index, 1)
      else {
        const i = s.notes.findIndex(x => x.id === noteid)
        if (i < 0) return "failed"
        s.notes.splice(i, 1)
      }
    } else return "failed"
  }
})

export const GameMapState = state



