import React, { useEffect, useRef } from "react"
import { makeStyles } from "@material-ui/core"
import { useObserver } from "mobx-react-lite"
import { PlayState } from "../MappingState"
import { TracksState } from "../Pages/Tracks.State"
import { autorun } from "mobx"

const useStyles = makeStyles(theme => ({
  progress: {
    position: "absolute",
    width: "80%",
    left: "10%",
    borderBottom: "2px solid red",
    bottom: 0,
    willChange: "transform",
    opacity: 0.7,
  }
}))

export const ProgressLine = () => {
  const cn = useStyles()

  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => autorun(() => {
    if (ref.current) ref.current.style.transform = `translateY(${-TracksState.timeHeightFactor * PlayState.position}px)`
  }), [])

  return useObserver(() => (
    <div className={cn.progress} ref={ref}></div>
  ))
}
