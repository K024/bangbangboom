import React, { useEffect, useRef, useCallback } from "react"
import { makeStyles } from "@material-ui/core"
import { useObserver, useLocalStore, useAsObservableSource } from "mobx-react-lite"
import { TracksState } from "../Pages/Tracks.State"
import { GameMapState, Actions } from "../GameMapState"
import { Assets } from "../Assets"

export const useNoteStyles = makeStyles(theme => ({
  note: {
    transform: "translateY(50%) scale(1.2)",
    width: "10%",
    position: "absolute",
    pointerEvents: "auto",
    zIndex: 1,
    minHeight: "10px",
  },
  slideamong: {
    background: "greenyellow",
    opacity: 0.2,
    width: "10%",
    position: "absolute",
    pointerEvents: "auto",
  },
  preview: {
    opacity: 0.5,
    zIndex: 0,
  }
}))

export type NotesLayerProps = {
  className?: string
  onDragNote: (tpid?: string, noteid?: string, slideid?: string) => void
  onAddSlideMid: (tpid: string, slideid: string) => void
}

const StopPrevent = <T extends React.SyntheticEvent>(h: (e: T) => any) => {
  return (e: T) => {
    e.stopPropagation()
    e.preventDefault()
    h(e)
  }
}

const handleClick = (e: React.MouseEvent, tpid: string, noteid: string, slideid?: string, right = false) => {
  e.stopPropagation()
  e.preventDefault()
  if (TracksState.tool !== "delete" && !right) return
  if (!slideid)
    Actions.removeNote(tpid, noteid)
  else {
    Actions.removeSlideNote(tpid, slideid, noteid)
  }
}

export const NotesLayer = (props: NotesLayerProps) => {

  const cn = useNoteStyles()
  const p = useAsObservableSource(props)
  const s = useLocalStore(() => ({
    width: 0,
    get bottompx() { return (t: number) => TracksState.timeHeightFactor * t + "px" }
  }))
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const div = ref.current
    if (!div) return
    const listener = () => s.width = div.clientWidth
    listener()
    window.addEventListener("resize", listener)
    return () => window.removeEventListener("resize", listener)
  }, [s])

  const getNotesList = useCallback(() => {
    const list: JSX.Element[] = []
    GameMapState.map.timepoints.forEach(tp => {
      const { offset, bpm } = tp
      const beattime = 60 / bpm
      const notestyle = ({ time = 0, lane = 0 }) => ({
        left: lane * 10 + 15 + "%",
        bottom: s.bottompx(offset + (beattime * time) / 24)
      })
      tp.notes.forEach(note => {
        if (note.type !== "slide") {
          const props: React.ImgHTMLAttributes<HTMLImageElement> = {
            src: Assets.note_normal,
            className: cn.note,
            onClick: e => handleClick(e, tp.id, note.id),
            onContextMenu: e => handleClick(e, tp.id, note.id, undefined, true),
            onDragStart: e => p.onDragNote(tp.id, note.id),
            style: notestyle(note)
          }
          if (note.type === "flick") props.src = Assets.note_flick
          list.push(<img key={note.id} {...props} alt="" />)
        } else {
          note.notes.forEach((n, i) => {
            const onClick = (e: React.MouseEvent) => handleClick(e, tp.id, n.id, note.id)
            const props: React.ImgHTMLAttributes<HTMLImageElement> = {
              src: Assets.note_long,
              className: cn.note,
              onClick,
              onContextMenu: e => handleClick(e, tp.id, n.id, note.id, true),
              onDragStart: e => p.onDragNote(tp.id, n.id, note.id),
              style: notestyle(n)
            }
            if (i > 0 && i < note.notes.length - 1) {
              props.src = Assets.note_slide_among
            }
            else if (i === note.notes.length - 1) {
              props.onClick = StopPrevent(e => {
                if (TracksState.tool !== "delete")
                  Actions.setFlickEnd(tp.id, note.id, !note.flickend)
                else onClick(e)
              })
              if (note.flickend)
                props.src = Assets.note_flick
            }
            list.push(<img key={n.id} {...props} alt="" />)
            if (i > 0) {
              const from = note.notes[i - 1]
              const to = note.notes[i]
              const bottom = (offset + (beattime * from.time) / 24) * TracksState.timeHeightFactor
              const top = (offset + (beattime * to.time) / 24) * TracksState.timeHeightFactor
              const dh = top - bottom
              const dw = s.width * (from.lane - to.lane) * 0.1
              const props: React.HTMLAttributes<HTMLDivElement> = {
                onClick: StopPrevent(e => p.onAddSlideMid(tp.id, note.id)),
                className: cn.slideamong,
                style: {
                  bottom: bottom + "px",
                  height: dh + "px",
                  transform: `skew(${Math.atan2(dw, dh)}rad)`,
                  left: (from.lane + to.lane) * 5 + 15 + "%",
                }
              }
              list.push(<div key={from.id + to.id} {...props}></div>)
            }
          })
        }
      })
    })
    return list
  }, [cn, p, s])

  return useObserver(() => (
    <div ref={ref} className={p.className}
      style={{ transform: TracksState.mirror ? "scaleX(-1)" : undefined }}>
      {getNotesList()}
    </div>
  ))
}
