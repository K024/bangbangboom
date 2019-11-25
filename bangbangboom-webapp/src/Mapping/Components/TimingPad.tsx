import React, { useRef, useEffect } from "react"
import { makeStyles } from "@material-ui/core"
import { useObserver, useAsObservableSource, useLocalStore } from "mobx-react-lite"
import { lazyObject, MakeArray } from "../../Global/Utils"
import { Howl } from "howler"
import { Assets } from "../Assets"
import { TimePoint } from "../core/MapCore"
import { GameMapState } from "../GameMapState"
import { PlayState } from "../MappingState"
import { autorun } from "mobx"

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    height: 80,
    padding: 10,
    transform: "translate(0, 0)",
    "&>*": {
      flexGrow: 1,
      height: "100%",
      margin: 10,
      border: "solid 3px cornflowerblue",
      borderRadius: 3,
      overflow: "hidden",
    },
    "& :first-child": {
      borderColor: "darkorange",
    },
    "&>*>*": {
      width: "100%",
      height: "100%",
      backgroundColor: "cornflowerblue",
      willChange: "opacity"
    },
    "& :first-child>*": {
      backgroundColor: "darkorange",
    },
  }
}))

const sounds = lazyObject({
  tick: () => new Howl({ src: Assets.timing_tick }),
  tack: () => new Howl({ src: Assets.timing_tack })
})

function getCurrentTimePoint(t: number) {
  let prev: TimePoint | null = null
  for (const tp of GameMapState.map.timepoints) {
    if (tp.offset > t) break
    prev = tp
  }
  return prev
}

function getBeat(tp: TimePoint, t: number) {
  if (t < tp.offset) return null
  const bt = 60 / tp.bpm
  const bar = bt * tp.bpb
  let off = t - tp.offset
  const barCount = Math.floor(off / bar)
  off -= barCount * bar
  const beatCount = Math.floor(off / bt)
  off -= beatCount * bt
  return {
    bar: barCount + 1,
    beat: beatCount + 1,
    offset: off,
    totalbeat: barCount * tp.bpb + beatCount + 1,
  }
}

export type TimingPadProps = { mute: boolean, selectedTp: null | TimePoint }

export const TimingPad = (props: TimingPadProps) => {
  const cn = useStyles()

  const p = useAsObservableSource(props)
  const s = useLocalStore(() => ({
    get tp() { return p.selectedTp || getCurrentTimePoint(PlayState.position) },
    get beatinfo() { return s.tp && getBeat(s.tp, PlayState.position) },
    get bars() { return (s.tp && s.tp.bpb) || 0 },
    get opacities() {
      if (!s.beatinfo || !s.tp) return []
      const l = []
      for (let i = 1; i <= s.tp.bpb; i++) {
        if (i === s.beatinfo.beat) {
          let opacity = (0.2 - s.beatinfo.offset) * 5
          if (opacity < 0) opacity = 0
          l.push(opacity)
        } else l.push(0)
      }
      return l
    },
    lastinfo: null as ReturnType<typeof getBeat>,
    lastposition: -1
  }))

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => autorun(() => {
    const { tick, tack } = sounds
    if (!p.mute && PlayState.music && PlayState.playing && s.tp && s.beatinfo) {
      const dt = PlayState.position - s.lastposition
      if (dt > 0 && dt < 0.4) {
        if (s.lastinfo)
          if (s.lastinfo.bar !== s.beatinfo.bar || s.lastinfo.beat !== s.beatinfo.beat) {
            if (s.beatinfo.beat === 1) tick.play()
            else tack.play()
          }
      }
      s.lastposition = PlayState.position
      s.lastinfo = s.beatinfo
    }
    const div = ref.current
    if (div)
      s.opacities.forEach((v, i) => {
        const c = div.children[i].firstChild as HTMLDivElement
        if (c) c.style.opacity = v as any
      })
  }), [s, p])

  return useObserver(() => (
    <div className={cn.root} ref={ref}>
      {MakeArray(s.bars).map(v =>
        <div key={v}>
          <div></div>
        </div>)}
    </div>
  ))
}


