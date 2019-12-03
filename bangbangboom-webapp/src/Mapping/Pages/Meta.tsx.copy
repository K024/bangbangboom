import React from "react"
import { makeStyles, Radio, RadioGroup, TextField, Button, Slider, Switch, Grid, Typography, FormControlLabel, Fade } from "@material-ui/core"
import { useObserver, useLocalStore } from "mobx-react-lite"
import { FormattedMessage } from "react-intl"
import { MetaState } from "../MappingState"
import { FileInput } from "../../Global/FlieInput"
import { GameMapState, ResetMap } from "../GameMapState"
import { GameMapToString } from "../core/MapCore"
import { setMessage } from "../../Global/Snackbar"

const useStyles = makeStyles(theme => ({
  panel: {
    maxWidth: 500,
    margin: "20px auto",
  },
  root: {
    width: "100%",
    height: "100%"
  }
}))

export const MetaPage = () => {
  const cn = useStyles()

  const s = useLocalStore(() => ({
    musicSource: "local" as "local" | "online",
    musicid: ""
  }))

  const handleFileLoad = (fs: File[]) => {
    const f = fs[0]
    MetaState.musicSrc = URL.createObjectURL(f)
  }

  const handleBackgroudLoad = (fs: File[]) => {
    const f = fs[0]
    MetaState.backgroundImageSrc = URL.createObjectURL(f)
  }

  const handleLoadMusicid = () => {
    MetaState.musicSrc = "/api/map/music/" + s.musicid
  }

  const handleDownloadCurrentMap = () => {
    const str = GameMapToString(GameMapState.map)
    const blob = new Blob([str], { type: "text/plain" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = "map.txt"
    a.style.display = "none"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleLoadFromFile = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "text/plain"
    input.click()
    input.addEventListener("change", () => {
      if (input.files && input.files.length) {
        const file = input.files.item(0)
        if (!file) return
        const reader = new FileReader()
        reader.readAsText(file, "UTF-8")
        reader.onload = e => {
          if (e && e.target) {
            const content = (e.target as any).result as string
            ResetMap(content)
            setMessage("info.success", "success")
          }
        }
      }
    })
  }

  const handleClearCurrentMap = () => {
    ResetMap()
    setMessage("info.success", "success")
  }

  return useObserver(() => (
    <div className={cn.root}>
      <Grid container direction="column" alignItems="stretch" spacing={2} className={cn.panel}>
        <Grid item container alignItems="center" spacing={2}>
          <Grid item>
            <Typography><FormattedMessage id="label.musicsource" /></Typography>
          </Grid>
          <Grid item xs>
            <RadioGroup value={s.musicSource} onChange={(e, v) => s.musicSource = v as "local" | "online"}>
              <Grid item container spacing={1}>
                <Grid item>
                  <FormControlLabel value="online" control={<Radio />} label={<FormattedMessage id="label.online" />} />
                </Grid>
                <Grid item>
                  <FormControlLabel value="local" control={<Radio />} label={<FormattedMessage id="label.local" />} />
                </Grid>
              </Grid>
            </RadioGroup>
          </Grid>
        </Grid>
        <Grid item>
          <Fade in key={s.musicSource}>
            {s.musicSource === "local" ?
              <Grid>
                <FileInput fullWidth label={<FormattedMessage id="label.loadfile" />}
                  onFileSelected={handleFileLoad} accept="audio/mpeg" />
              </Grid>
              :
              <Grid container spacing={1} alignItems="flex-end">
                <Grid item xs>
                  <TextField fullWidth label={<FormattedMessage id="label.musicid" />}
                    value={s.musicid} onChange={e => s.musicid = e.target.value} />
                </Grid>
                <Grid item>
                  <Button onClick={handleLoadMusicid}>
                    <FormattedMessage id="label.load" />
                  </Button>
                </Grid>
              </Grid>}
          </Fade>
        </Grid>
        <Grid item>
          <FileInput fullWidth label={<FormattedMessage id="label.backgroundimage" />}
            onFileSelected={handleBackgroudLoad} accept="image/*" />
        </Grid>
        <Grid item container spacing={2} alignItems="center">
          <Grid item>
            <Typography><FormattedMessage id="label.backgrounddim" /></Typography></Grid>
          <Grid item xs>
            <Slider value={MetaState.backgroundDim} min={0} max={100}
              onChange={(e, v) => MetaState.backgroundDim = v as number} />
          </Grid>
        </Grid>
        <Grid item container spacing={2}>
          <Grid item>
            <FormControlLabel label={<FormattedMessage id="label.lowerperformance" />}
              control={<Switch value={MetaState.lowPerformance}
                onChange={(e, v) => MetaState.lowPerformance = v} />} />
          </Grid>
          {/* <Grid item>
            <FormControlLabel label={<FormattedMessage id="label.backgroundcover" />}
              control={<Switch value={MetaState.backgroundCover}
                onChange={(e, v) => MetaState.backgroundCover = v} />} />
          </Grid> */}
        </Grid>
        <Grid item container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button fullWidth onClick={handleDownloadCurrentMap}>
              <FormattedMessage id="label.downloadcurretmap" />
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button fullWidth onClick={handleLoadFromFile}>
              <FormattedMessage id="label.loadmapfile" />
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button fullWidth onClick={handleClearCurrentMap}>
              <FormattedMessage id="label.clearcurrentmap" />
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  ))
}
