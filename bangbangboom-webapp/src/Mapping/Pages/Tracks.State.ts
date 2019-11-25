import { observable, autorun } from "mobx"
import { PlayState } from "../MappingState"

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
