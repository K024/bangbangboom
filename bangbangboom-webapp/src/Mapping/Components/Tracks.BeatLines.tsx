import React from "react"
import { makeStyles } from "@material-ui/core"
import { useObserver, useLocalStore } from "mobx-react-lite"
import { getBeatlines1, getbBeatlines2 as getBeatlines2, getBeatlines3, getBeatlines4 } from "./Utils"
import clsx from "clsx"
import { TracksState } from "../Pages/Tracks.State"

const useStyles = makeStyles(theme => ({
  beatline1: {
    position: "absolute",
    textAlign: "right",
    width: "80%",
    right: "5%",
    borderBottom: "1px lightgray solid",
  },
  subline: {
    position: "absolute",
    width: "70%",
    left: "15%",
  },
  beatline2: {
    borderBottom: "1px solid gray"
  },
  beatline3: {
    borderBottom: "1px solid firebrick"
  },
  beatline4: {
    borderBottom: "1px solid darkslateblue"
  },
}))

export const BeatLines = () => {

  const cn = useStyles()

  const s = useLocalStore(() => ({
    get bottompx() { return (t: number) => TracksState.timeHeightFactor * t + "px" },
    get beatlines1() { return getBeatlines1() },
    get beatlines2() { return getBeatlines2() },
    get beatlines3() { return getBeatlines3() },
    get beatlines4() { return getBeatlines4() },
  }))

  return useObserver(() => (
    <>
      {s.beatlines1.map(({ time, name }) =>
        <div className={cn.beatline1} key={time} style={{ bottom: s.bottompx(time) }}>{name}</div>)}
      {TracksState.division % 2 === 0 &&
        s.beatlines2.map((time =>
          <div className={clsx(cn.subline, cn.beatline2)} key={time} style={{ bottom: s.bottompx(time) }}></div>))}
      {TracksState.division % 3 === 0 &&
        s.beatlines3.map((time =>
          <div className={clsx(cn.subline, cn.beatline3)} key={time} style={{ bottom: s.bottompx(time) }}></div>))}
      {TracksState.division % 4 === 0 &&
        s.beatlines4.map((time =>
          <div className={clsx(cn.subline, cn.beatline4)} key={time} style={{ bottom: s.bottompx(time) }}></div>))}
    </>
  ))
}
