import React, { useMemo, useCallback, useEffect, useRef } from "react"
import { makeStyles } from "@material-ui/core"
import { useNoteStyles, NotesLayer } from "./Tracks.NotesLayer"
import { useObserver, useLocalStore } from "mobx-react-lite"
import { PlayState, seek } from "../MappingState"
import { GameMapState, Actions } from "../GameMapState"
import { MakeArray, TimeToString } from "../../Global/Utils"
import { BeatLines } from "./Tracks.BeatLines"
import { nearestBeatTime } from "./Utils"
import { Assets } from "../Assets"
import clsx from "clsx"
import { ProgressLine } from "./Tracks.ProgressLine"
import { uuid } from "../core/Utils"
import { TracksState } from "../Pages/Tracks.State"
import { autorun } from "mobx"

const useStyles = makeStyles(theme => ({
  panel: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    willChange: "transform"
  },
  layer: {
    width: "100%",
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
  },
  line: {
    borderLeft: "1px solid lightgray",
    height: "100%",
    position: "absolute",
    pointerEvents: "none"
  },
  time: {
    position: "absolute"
  },
  timepoint: {
    position: "absolute",
    color: "aquamarine",
    width: "95%",
    borderBottom: "1px aquamarine solid",
    height: "1.5em"
  },
}))

const VerticalLineLefts = MakeArray(90, 15, 10)

export const Tracks = ({ className = "" }) => {
  const cn = useStyles()
  const ncn = useNoteStyles()

  const s = useLocalStore(() => ({
    mouse: {
      time: 0,
      lane: -1,
    },
    touch: {
      touching: false,
      startY: 0,
      startPos: 0
    },
    dropnote: {
      tpid: "",
      noteid: "",
      slideid: "",
    },
    previewSlide: {
      style: null as { left: string, bottom: string } | null,
      data: { offset: 0, tpid: "", lane: 0 }
    },
    get paddedDuration() { return PlayState.duration * 1.2 },
    get bottompx() { return (t: number) => TracksState.timeHeightFactor * t + "px" },
    get previewNote() {
      if (TracksState.tool === "none") return null
      if (s.mouse.lane < 0) return null
      const t = nearestBeatTime(s.mouse.time, TracksState.division)
      if (!t) return null
      let src = ""
      switch (TracksState.tool) {
        case "normal": src = Assets.note_normal; break
        case "flick": src = Assets.note_flick; break
        case "slide": src = Assets.note_long; break
      }
      return {
        style: {
          left: s.mouse.lane * 10 + 15 + "%",
          bottom: s.bottompx(t.time),
        },
        src
      }
    },
    get panelStyle() {
      return {
        height: TracksState.timeHeightFactor * s.paddedDuration + "px",
      }
    },
  }))

  const panelref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    return autorun(() => {
      if (panelref.current)
        panelref.current.style.transform = `translateY(${TracksState.timeHeightFactor * TracksState.viewposition}px)`
    })
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const p = e.currentTarget
    const rect = p.getBoundingClientRect()
    const y = rect.bottom - e.clientY
    const x = e.clientX - rect.left
    s.mouse.time = y / TracksState.timeHeightFactor
    let l = Math.floor((x / rect.width) * 10 - 1.5)
    l = TracksState.mirror ? 6 - l : l
    if (l < 0) l = -1
    if (l > 6) l = -1
    s.mouse.lane = l
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (TracksState.tool === "none") return
    handleMouseMove(e)
    if (s.mouse.lane < 0) return
    const t = nearestBeatTime(s.mouse.time, TracksState.division)
    if (!t) return
    switch (TracksState.tool) {
      case "normal":
        Actions.addSingle(t.timepoint, s.mouse.lane, t.beatoffset, uuid()); break
      case "flick":
        Actions.addFlick(t.timepoint, s.mouse.lane, t.beatoffset, uuid()); break
      case "slide":
        if (s.previewSlide.style) {
          const d = s.previewSlide.data
          if (d.tpid === t.timepoint) {
            Actions.addSlide(t.timepoint, d.lane, d.offset, s.mouse.lane,
              t.beatoffset, uuid(), uuid(), uuid())
          }
          s.previewSlide.style = null
        } else {
          if (!s.previewNote) break
          s.previewSlide.style = Object.assign({}, s.previewNote.style)
          s.previewSlide.data = { offset: t.beatoffset, lane: s.mouse.lane, tpid: t.timepoint }
        }
        break
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    handleMouseMove(e)
    if (!s.dropnote.noteid || s.mouse.lane < 0) return
    const t = nearestBeatTime(s.mouse.time, TracksState.division)
    if (!t) return
    if (!s.dropnote.slideid) {
      Actions.moveSingleOrFlick(s.dropnote.tpid, s.dropnote.noteid, s.mouse.lane, t.beatoffset, t.timepoint)
    } else {
      Actions.moveSlideNote(s.dropnote.tpid, s.dropnote.slideid, s.dropnote.noteid, s.mouse.lane, t.beatoffset)
    }
  }

  const handleScroll = (e: React.WheelEvent) => {
    // e.preventDefault() // ???
    e.stopPropagation()
    const dt = e.deltaY / TracksState.timeHeightFactor
    let target = TracksState.viewposition - dt
    if (target < 0) target = 0
    if (target > PlayState.duration) target = PlayState.duration
    if (TracksState.tracking) seek(target)
    else TracksState.viewposition = target
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (s.touch.touching) return
    s.touch.touching = true
    s.touch.startY = e.targetTouches[0].clientY
    s.touch.startPos = TracksState.viewposition
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    const dt = (s.touch.startY - e.targetTouches[0].clientY) / TracksState.timeHeightFactor
    let target = s.touch.startPos - dt
    if (target < 0) target = 0
    if (target > PlayState.duration) target = PlayState.duration
    if (TracksState.tracking) seek(target)
    else TracksState.viewposition = target
  }
  const handleTouchEnd = () => {
    s.touch.touching = false
  }

  const handleDragNote = useCallback((tpid = "", noteid = "", slideid = "") => {
    s.dropnote.tpid = tpid
    s.dropnote.noteid = noteid
    s.dropnote.slideid = slideid
  }, [s])

  const handleNewSlideMid = useCallback((tpid: string, slideid: string) => {
    if (s.mouse.lane < 0) return
    const t = nearestBeatTime(s.mouse.time, TracksState.division)
    if (!t || t.timepoint !== tpid) return
    Actions.addSlideMid(tpid, slideid, s.mouse.lane, t.beatoffset, uuid())
  }, [s])

  const basicLinesPart = () => {
    const timeList = MakeArray(s.paddedDuration, 0, 2)
    return <>
      <div className={cn.layer}>
        {VerticalLineLefts.map(x =>
          <div key={x} className={cn.line} style={{ left: x + "%" }}></div>)}
      </div>
      <div className={cn.layer}>
        {timeList.map(x =>
          <div key={x} className={cn.time} style={{ bottom: s.bottompx(x) }}>{TimeToString(x)}</div>)}
      </div>
      <div className={cn.layer}>
        {GameMapState.map.timepoints.map(tp =>
          <div className={cn.timepoint} key={tp.id} style={{ bottom: s.bottompx(tp.offset) }}>
            <div style={{ position: "absolute", left: 0 }}>{TimeToString(tp.offset)}</div>
            <div style={{ position: "absolute", right: 0 }}>{tp.bpm}</div>
          </div>)}
      </div>
    </>
  }

  const previewNotePart = () =>
    <div className={cn.layer} style={{ transform: TracksState.mirror ? "scaleX(-1)" : undefined }}>
      {s.previewNote &&
        <img className={clsx(ncn.note, ncn.preview)} {...s.previewNote} alt=""></img>}
      {s.previewNote && s.previewSlide.style &&
        <img className={clsx(ncn.note, ncn.preview)} src={s.previewNote.src} style={s.previewSlide.style} alt=""></img>}
    </div>

  const beatlines = useMemo(() => <BeatLines />, [])
  const progressline = useMemo(() => <ProgressLine />, [])
  const noteslayer = useMemo(() =>
    <NotesLayer className={cn.layer}
      onAddSlideMid={handleNewSlideMid} onDragNote={handleDragNote}></NotesLayer>
    , [handleNewSlideMid, handleDragNote, cn])

  return useObserver(() => (
    <div className={className} onWheel={handleScroll} onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onTouchCancel={handleTouchEnd}>
      <div className={cn.panel} ref={panelref} onMouseMove={handleMouseMove} onClick={handleClick}
        onDragOver={handleDragOver} onDrop={handleDrop} style={s.panelStyle}>
        {basicLinesPart()}
        <div className={cn.layer}>
          {beatlines}
        </div>
        {previewNotePart()}
        <div className={cn.layer}>
          {progressline}
        </div>
        {noteslayer}
      </div>
    </div>
  ))
}
