import React from "react"
import { makeStyles, TextField, Button, Slider, Switch, Grid, Typography, FormControlLabel } from "@material-ui/core"
import { useObserver, useLocalStore } from "mobx-react-lite"
import { FormattedMessage } from "react-intl"
import { MetaState } from "../MappingState"
import { GameMapState, ResetMap } from "../GameMapState"
import { GameMapToString } from "../core/MapCore"
import { setMessage } from "../../Global/Snackbar"
import { CanNone } from "../../Pages/Components/CanNone"
import { ConnectionState, ConnectionInfo } from "../ConnectionState"
import { CoverProgress } from "../../Pages/Components/CoverProgress"
import { Editable } from "../../Pages/Components/Editable"
import { selectFile, readFile } from "../../Global/Utils"

const useStyles = makeStyles(theme => ({
  panel: {
    maxWidth: 600,
    margin: "20px auto",
  },
  root: {
    width: "100%",
    height: "100%",
    overflow: "auto"
  }
}))

export const MetaPage = () => {
  const cn = useStyles()

  const s = useLocalStore(() => ({
    musicid: 0
  }))

  const handleUploadMusic = async () => {
    const fs = await selectFile("audio/mpeg")
    ConnectionInfo.uploadMusic(fs[0])
  }

  const handleUploadImage = async () => {
    const fs = await selectFile("image/*")
    ConnectionInfo.uploadImage(fs[0])
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

  const handleLoadFromFile = async () => {
    const files = await selectFile("text/plain")
    const content = await readFile(files[0])
    ResetMap(content)
    setMessage("info.success", "success")
  }


  const handleClearCurrentMap = () => {
    ResetMap()
    setMessage("info.success", "success")
  }

  const ConnectionPart = () => (
    <>
      <Grid item container alignItems="flex-end" spacing={2}>
        <Grid item>
          <TextField value={s.musicid || ""}
            label={<FormattedMessage id="label.musicid" />}
            onChange={e => s.musicid = parseInt(e.target.value) || 0} />
        </Grid>
        <Grid item><Button disabled={ConnectionState.loading}
          onClick={() => ConnectionState.source = s.musicid.toString()}
        ><FormattedMessage id="label.connect" /></Button></Grid>
        <Grid item><Button disabled={ConnectionState.loading}
          onClick={() => ConnectionState.source = "local"}
        ><FormattedMessage id="sentence.connecttolocal" /></Button></Grid>
      </Grid>
      {(ConnectionState.connected || ConnectionState.loading) &&
        <Grid item container alignItems="center" spacing={2}>
          <Grid item xs={5} sm={4}><FormattedMessage id="sentence.connectedto" /></Grid>
          <Grid item><CoverProgress loading={ConnectionState.loading}>
            <CanNone value={ConnectionState.source &&
              (ConnectionState.source === "local" ? "local" : "ID: " + ConnectionState.source)} />
          </CoverProgress></Grid>
          <Grid item>
            {ConnectionState.readonly && <FormattedMessage id="label.readonly" />}
          </Grid>
        </Grid>}
      {ConnectionState.connected &&
        <>
          {[{
            id: "label.musicname", value: ConnectionInfo.musicname || "",
            change: (s: string) => ConnectionInfo.setMusicname(s)
          }, {
            id: "label.artist", value: ConnectionInfo.artist || "",
            change: (s: string) => ConnectionInfo.setArtist(s)
          }, {
            id: "label.mapname", value: ConnectionInfo.mapname || "",
            change: (s: string) => ConnectionInfo.setMapname(s)
          }, {
            id: "label.difficulty", value: (ConnectionInfo.difficulty || 0).toString(),
            change: (s: string) => ConnectionInfo.setDifficulty(parseInt(s) || 0)
          }, {
            id: "label.description", value: ConnectionInfo.description || "",
            change: (s: string) => ConnectionInfo.setDescription(s)
          },].map(x =>
            <Grid item container alignItems="center" spacing={2} key={x.id}>
              <Grid item xs={1}></Grid>
              <Grid item xs={4} sm={3}><Typography>
                <FormattedMessage id={x.id} />
              </Typography></Grid>
              <Grid item container xs spacing={1}>
                <Editable value={x.value}
                  onChange={x.change}
                  canEdit={!ConnectionState.readonly}>
                  <CanNone value={x.value} />
                </Editable>
              </Grid>
            </Grid>)}
          {[{
            display: !ConnectionInfo.musicSrc
              ? <FormattedMessage id="info.nomusic" />
              : <FormattedMessage id="info.hasmusic" />,
            onclick: handleUploadMusic
          }, {
            display: !ConnectionInfo.imageSrc
              ? <FormattedMessage id="info.noimage" />
              : <FormattedMessage id="info.hasimage" />,
            onclick: handleUploadImage
          }].map((x, i) =>
            <Grid key={i} item container alignItems="center" spacing={2}>
              <Grid item xs={1}></Grid>
              <Grid item xs={4} sm={3}><Typography>{x.display
              }</Typography></Grid>
              <Grid item><Button variant="outlined" size="small" onClick={x.onclick}>
                <FormattedMessage id="label.upload" />
              </Button></Grid>
            </Grid>)}
        </>}
    </>)

  return useObserver(() => (
    <div className={cn.root} onKeyDown={e => e.stopPropagation()}>
      <Grid container direction="column" alignItems="stretch" spacing={2} className={cn.panel}>
        {ConnectionPart()}
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
          {[{ click: handleDownloadCurrentMap, id: "label.downloadcurretmap" },
          { click: handleLoadFromFile, id: "label.loadmapfile" },
          { click: handleClearCurrentMap, id: "label.clearcurrentmap" },].map(x =>
            <Grid item xs={12} sm={6} key={x.id}>
              <Button fullWidth variant="outlined" onClick={x.click}>
                <FormattedMessage id={x.id} />
              </Button>
            </Grid>)}
        </Grid>
      </Grid>
    </div>
  ))
}
