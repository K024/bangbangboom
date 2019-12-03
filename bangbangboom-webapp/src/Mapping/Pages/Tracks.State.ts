import { observable, autorun, reaction } from "mobx"
import { PlayState } from "../MappingState"
import { GameMapState } from "../GameMapState"
import { binarySearch } from "../core/Utils"
import { lazyObject } from "../../Global/Utils"
import { Assets } from "../Assets"

export type ToolTypes = "none" | "normal" | "flick" | "slide" | "delete"

export const TracksState = observable({
  viewposition: 0,
  tracking: false,
  timeHeightFactor: 400,
  division: 1,
  tool: "none" as ToolTypes,
  mirror: false
})

export const zoomin = () => {
  let f = TracksState.timeHeightFactor * 1.414
  if (f > 1580) f = 1600
  TracksState.timeHeightFactor = f
}
export const zoomout = () => {
  let f = TracksState.timeHeightFactor / 1.414
  if (f < 120) f = 100
  TracksState.timeHeightFactor = f
}

autorun(() => {
  if (TracksState.tracking) TracksState.viewposition = PlayState.position
})

const sounds = lazyObject({
  perfect: () => new Howl({ src: Assets.perfect }),
  flick: () => new Howl({ src: Assets.flick })
})

const soundList = observable({
  get list() {
    const list: Array<{ type: string, time: number }> = []
    for (const tp of GameMapState.map.timepoints) {
      const off = tp.offset
      const dt = (60 / tp.bpm) / 24
      for (const n of tp.notes) {
        if (n.type === "single") {
          list.push({ type: "perfect", time: off + n.time * dt })
        } else if (n.type === "flick") {
          list.push({ type: "flick", time: off + n.time * dt })
        } else {
          // list.push({ type: "longstart", time: off + n.notes[0].time * dt })
          n.notes.forEach(s => list.push({ type: "perfect", time: off + s.time * dt }))
          if (n.flickend) list[list.length - 1].type = "flick"
          // list.push({ type: "longend", time: off + n.notes[n.notes.length - 1].time * dt })
        }
      }
    }
    list.sort((a, b) => a.time - b.time)
    return list
  }
})

export function StartTrackMapping() {
  let lastpos = -1
  return reaction(() => PlayState.position, position => {
    if (Math.abs(position - lastpos) > 0.2) return
    const list = soundList.list
    const index = binarySearch(i => list[i].time, list.length, position)
    if (index < 0) return
    const pindex = binarySearch(i => list[i].time, list.length, lastpos) + 1
    for (let i = pindex; i <= index; i++) {
      const s = list[i]
      if (lastpos < s.time) {
        switch (s.type) {
          case "perfect": sounds.perfect.play(); break
          case "flick": sounds.flick.play(); break
        }
      }
    }
    lastpos = position
  })
}
