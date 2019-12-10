import React, { useRef, useEffect } from "react"
import { makeStyles } from "@material-ui/core"
import { useObserver, useLocalStore } from "mobx-react-lite"
import { PlayState } from "../MappingState"
import { autorun } from "mobx"
import { barTimeHeightFactor, drawScrollBar } from "./Utils"
import { TracksState } from "../Pages/Tracks.State"

const useStyles = makeStyles(theme => ({
  viewport: {
    position: "absolute",
    width: "100%",
    backgroundColor: "#fff",
    opacity: 0.2,
    transition: "opacity 0.2s",
    bottom: 0,
    willChange: "opacity, transform",
    "&:hover": {
      opacity: 0.4
    }
  },
  bar: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    willChange: "transform"
  },
  canvas: {
    width: "100%",
    height: "100%"
  },
  progress: {
    position: "absolute",
    width: "100%",
    borderBottom: "2px solid red",
    bottom: 0,
    willChange: "transform",
    opacity: 0.7
  },
}))

const ScrollProgressLine = () => {
  const { progress } = useStyles()

  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => autorun(() => {

    if (ref.current) ref.current.style.transform = `translateY(${-barTimeHeightFactor * PlayState.position}px)`
  }), [])

  return <div className={progress} ref={ref}></div>
}

export const ScrollBar = ({ className = "" }) => {

  const cn = useStyles()


  const s = useLocalStore(() => ({
    containerheight: 0,
    get paddedDuration() { return PlayState.duration * 1.2 },
    get barheight() { return barTimeHeightFactor * s.paddedDuration },
    get viewportheight() { return s.containerheight / TracksState.timeHeightFactor * barTimeHeightFactor },
    get bartransform() {
      const height = s.barheight
      if (height <= s.containerheight) return ""
      const p = TracksState.viewposition / s.paddedDuration
      const transx = s.containerheight * p - height * p
      return `translateY(${-transx}px)`
    },
    get viewporttransform() {
      let h = s.containerheight
      if (s.barheight < s.containerheight) h = s.barheight
      const transx = (h * TracksState.viewposition) / s.paddedDuration
      return `translateY(${-transx}px)`
    }
  }))

  const container = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const listener = () => {
      if (container.current)
        s.containerheight = container.current.clientHeight
    }
    listener()
    window.addEventListener("resize", listener)
    return () => { window.removeEventListener("resize", listener) }
  }, [s])

  useEffect(() => autorun(() => {
    if (canvas.current)
      drawScrollBar(canvas.current)
  }), [])

  useEffect(() => autorun(() => {
    if (bar.current)
      bar.current.style.transform = s.bartransform
    if (viewport.current)
      viewport.current.style.transform = s.viewporttransform
  }), [s])

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const c = e.currentTarget
    const rect = c.getBoundingClientRect()
    const y = e.clientY - rect.top
    let h = s.containerheight
    if (s.barheight < s.containerheight) h = s.barheight
    const by = c.clientHeight - y - s.viewportheight / 2
    let target = (by / h) * s.paddedDuration
    if (target < 0) target = 0
    if (target > PlayState.duration) target = PlayState.duration
    TracksState.viewposition = target
  }

  return useObserver(() => (
    <div className={className} ref={container} onClick={handleClick}>
      <div className={cn.bar} ref={bar} style={{ height: s.barheight }}>
        <canvas ref={canvas} className={cn.canvas} width={100} height={s.barheight}></canvas>
        <ScrollProgressLine />
      </div>
      <div ref={viewport} className={cn.viewport} style={{ height: s.viewportheight }}></div>
    </div>
  ))
}
