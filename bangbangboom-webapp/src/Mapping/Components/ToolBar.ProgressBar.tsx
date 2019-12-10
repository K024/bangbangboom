import React, { useRef, useEffect } from "react"
import { useObserver, useLocalStore } from "mobx-react-lite"
import { makeStyles } from "@material-ui/core"
import clsx from "clsx"
import { GameMapState } from "../GameMapState"
import { PlayState, seekPercent, handleScroll } from "../MappingState"
import { TimeToString } from "../../Global/Utils"
import { autorun } from "mobx"

const useStyles = makeStyles(theme => ({
  flex: {
    display: "flex",
    alignItems: "center"
  },
  center: {
    justifyContent: "center"
  },
  bar: {
    flexGrow: 1,
    height: "100%",
    position: "relative",
  },
  time: {
    margin: theme.spacing(0, 2),
    width: 80,
    textAlign: "center"
  },
  layer: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },
  midline: {
    width: "100%",
    borderBottom: "1px solid white"
  },
  progress: {
    position: "absolute",
    height: "100%",
    borderLeft: "4px solid red"
  },
  timepoint: {
    position: "absolute",
    width: 1,
    height: "50%",
    backgroundColor: "aquamarine",
    transition: "left 0.2s"
  }
}))

function leftStyle(time: number) {
  const r = PlayState.duration > 0 ? time / PlayState.duration : 0
  const p = r * 100
  return `${p}%`
}

export const ProgressBar = () => {

  const cn = useStyles()
  const s = useLocalStore(() => ({
    get timepoints() {
      return GameMapState.map.timepoints.map(x => ({ key: x.id, left: leftStyle(x.offset) }))
    }
  }))

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget
    const x = e.pageX - bar.offsetLeft
    const p = x / bar.clientWidth
    seekPercent(p)
  }

  const playtimediv = useRef<HTMLDivElement>(null)
  const progressdiv = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return autorun(() => {
      if (playtimediv.current) playtimediv.current.innerText = TimeToString(PlayState.position)
      if (progressdiv.current) progressdiv.current.style.left = leftStyle(PlayState.position)
    })
  }, [])

  return useObserver(() => (
    <div className={clsx(cn.flex, cn.bar)} onWheel={handleScroll}>
      <div className={clsx(cn.flex, cn.center, cn.time)} ref={playtimediv}>
      </div>
      <div className={cn.bar} onClick={handleClick}>
        <div className={clsx(cn.flex, cn.layer, cn.center)}>
          <div className={cn.midline}></div>
        </div>
        <div className={cn.layer}>
          {s.timepoints.map(x => <div key={x.key} style={{ left: x.left }} />)}
        </div>
        <div className={cn.layer}>
          <div className={cn.progress} ref={progressdiv}></div>
        </div>
      </div>
      <div className={clsx(cn.flex, cn.center, cn.time)}>
        {TimeToString(PlayState.duration)}
      </div>
    </div>
  ))
}
