import React, { useEffect } from "react"
import { useObserver } from "mobx-react-lite"
import { makeStyles, RadioGroup, FormControlLabel, Radio, Select, MenuItem, IconButton, Switch, Tooltip, Grid, FormControl, InputLabel } from "@material-ui/core"
import { TracksState, ToolTypes, zoomin, zoomout, StartTrackMapping } from "./Tracks.State"
import { Tracks } from "../Components/Tracks"
import { ScrollBar } from "../Components/ScrollBar"
import { FormattedMessage, useIntl } from "react-intl"
import { Assets } from "../Assets"
import ZoomInIcon from '@material-ui/icons/ZoomIn'
import ZoomOutIcon from '@material-ui/icons/ZoomOut'
import clsx from "clsx"

const useStyles = makeStyles(theme => ({
  mapping: {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "stretch"
  },
  tools: {
    position: "relative",
    flexGrow: 0.5,
    padding: 40,
    maxWidth: "calc(40% - 100px)",
    "&>*": {
      maxWidth: 300,
      position: "absolute",
      right: 10,
    }
  },
  track: {
    position: "relative",
    flexGrow: 1,
    maxWidth: 600,
  },
  scrollbar: {
    position: "relative",
    width: 100
  },
  toolimg: {
    width: 80
  }
}))


export const TrackMappingPage = ({ className = "" }) => {

  const cn = useStyles()

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "a": TracksState.tool = "none"; break
        case "s": TracksState.tool = "normal"; break
        case "d": TracksState.tool = "flick"; break
        case "f": TracksState.tool = "slide"; break
        case "r": TracksState.tool = "delete"; break
        case "=": case "+": zoomin(); break
        case "_": case "-": zoomout(); break
        case "c": TracksState.tracking = !TracksState.tracking; break
        case "v": TracksState.mirror = !TracksState.mirror; break
      }
    }
    window.addEventListener("keydown", listener)
    return () => { window.removeEventListener("keydown", listener) }
  }, [])

  useEffect(StartTrackMapping, [])

  const intl = useIntl()
  const shortcut = intl.formatMessage({ id: "label.shortcut" }) + ": "
  const shortcutmessage = (s: string) => shortcut + s

  return useObserver(() => (
    <div className={clsx(cn.mapping, className)} onContextMenu={e => { e.preventDefault(); e.stopPropagation() }}>
      <div className={cn.tools}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <RadioGroup value={TracksState.tool}
              onChange={(e, v) => TracksState.tool = v as ToolTypes}>
              <Tooltip enterDelay={300} title={shortcutmessage("a")}>
                <FormControlLabel value="none" control={<Radio />}
                  label={<FormattedMessage id="tools.none" />} />
              </Tooltip>
              <Tooltip enterDelay={300} title={shortcutmessage("s")}>
                <FormControlLabel value="normal" control={<Radio />}
                  label={<img className={cn.toolimg} src={Assets.note_normal} alt="" />} />
              </Tooltip>
              <Tooltip enterDelay={300} title={shortcutmessage("d")}>
                <FormControlLabel value="flick" control={<Radio />}
                  label={<img className={cn.toolimg} src={Assets.note_flick} alt="" />} />
              </Tooltip>
              <Tooltip enterDelay={300} title={shortcutmessage("f")}>
                <FormControlLabel value="slide" control={<Radio />}
                  label={<img className={cn.toolimg} src={Assets.note_long} alt="" />} />
              </Tooltip>
              <Tooltip enterDelay={300} title={shortcutmessage("r")}>
                <FormControlLabel value="delete" control={<Radio />}
                  label={<FormattedMessage id="tools.delete" />} />
              </Tooltip>
            </RadioGroup>
          </Grid>
          <Grid item>
            <FormControl fullWidth>
              <InputLabel><FormattedMessage id="label.division" /></InputLabel>
              <Select fullWidth value={TracksState.division}
                onChange={e => TracksState.division = e.target.value as number} >
                <MenuItem value={1}>1/1</MenuItem>
                <MenuItem value={2}>1/2</MenuItem>
                <MenuItem value={3}>1/3&nbsp;!</MenuItem>
                <MenuItem value={4}>1/4</MenuItem>
                <MenuItem value={6}>1/6&nbsp;!</MenuItem>
                <MenuItem value={8}>1/8</MenuItem>
                <MenuItem value={24}>1/24&nbsp;!</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item container spacing={2}>
            <Grid item>
              <Tooltip enterDelay={300} title={shortcutmessage("+ / ctrl+wheel")}>
                <IconButton onClick={zoomin} disabled={TracksState.timeHeightFactor > 1580}><ZoomInIcon /></IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip enterDelay={300} title={shortcutmessage("-")}>
                <IconButton onClick={zoomout} disabled={TracksState.timeHeightFactor < 120}><ZoomOutIcon /></IconButton>
              </Tooltip>
            </Grid>
          </Grid>
          <Grid item container spacing={2}>
            <Grid item>
              <Tooltip enterDelay={300} title={shortcutmessage("c")}>
                <FormControlLabel
                  control={<Switch checked={TracksState.tracking}
                    onChange={(e, v) => TracksState.tracking = v} />}
                  label={<FormattedMessage id="label.follow" />}
                />
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip enterDelay={300} title={shortcutmessage("v")}>
                <FormControlLabel
                  control={<Switch checked={TracksState.mirror}
                    onChange={(e, v) => TracksState.mirror = v} />}
                  label={<FormattedMessage id="label.mirror" />}
                />
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <Tracks className={cn.track} />
      <ScrollBar className={cn.scrollbar} />
    </div>
  ))
}