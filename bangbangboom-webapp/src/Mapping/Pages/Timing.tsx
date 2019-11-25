import React, { useCallback, useEffect } from "react"
import { makeStyles, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, IconButton, Switch, FormControlLabel, Grid, InputAdornment } from "@material-ui/core"
import { useObserver, useLocalStore } from "mobx-react-lite"
import { FormattedMessage } from "react-intl"
import { TimePoint } from "../core/MapCore"
import { GameMapState, Actions } from "../GameMapState"
import { TimeToString, DebounceFunc } from "../../Global/Utils"
import { TimingPad } from "../Components/TimingPad"
import { PlayState } from "../MappingState"
import { uuid } from "../core/Utils"
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import { reaction } from "mobx"

const useStyles = makeStyles(theme => ({
  timing: {
    width: "100%",
    maxWidth: 1000,
    margin: "16px auto",
  },
  table: {
    maxHeight: "60vh",
    overflow: "auto"
  },
  tablerow: {
    cursor: "pointer"
  }
}))


function calcmeasure(taps: number[]) {
  const d = Math.floor(taps.length / 2)
  let sum = 0
  let i = 0
  for (; i + d < taps.length; i++) {
    sum += taps[i + d] - taps[i]
  }
  const beattime = sum / d / i
  const bpm = 60 / beattime
  sum = 0
  i = 0
  for (; i < taps.length; i++) {
    sum += taps[i] - i * beattime
  }
  const offset = sum / i
  return {
    bpm,
    offset
  }
}


export const TimingPage = () => {
  const cn = useStyles()

  const s = useLocalStore(() => ({
    selectedTp: null as null | TimePoint,
    mute: false,
    measure: {
      measuring: false,
      taps: [] as number[],
    },
    input: {
      bpm: 120,
      bpb: 4,
      offset: 1
    }
  }))

  const removeTp = () => {
    if (!s.selectedTp) return
    Actions.removeTimePoint(s.selectedTp.id)
    s.selectedTp = null
  }

  const set = useCallback(() => {
    const { offset, bpm, bpb } = s.input
    const item = GameMapState.map.timepoints.find(t => t.offset === offset)
    if (item && s.selectedTp !== item) {
      s.selectedTp = item
      return
    }
    if (s.selectedTp) {
      Actions.setTimePoint(s.selectedTp.id, offset, bpm, bpb)
    } else {
      Actions.addTimePoint(uuid(), offset, bpm, bpb)
    }
  }, [s])

  const stopmeasure = useCallback(DebounceFunc(() => {
    s.measure.measuring = false
    set()
  }, 2000), [s, set])


  const measure = useCallback(() => {
    if (!s.selectedTp || !PlayState.playing) return
    if (!s.measure.measuring) s.measure.taps = []
    s.measure.measuring = true
    stopmeasure()
    s.measure.taps.push(PlayState.position)
    if (s.measure.taps.length >= 5) {
      const { bpm, offset } = calcmeasure(s.measure.taps)
      s.input.bpm = bpm
      s.input.offset = offset
    }
    set()
  }, [s, set, stopmeasure])

  const movebeat = function (forward = false) {
    let back = 60 / (s.input.bpm || 120)
    if (forward) back = -back
    s.input.offset = s.input.offset - back
    if (s.selectedTp) set()
  }

  useEffect(() => reaction(() => s.selectedTp, tp => {
    if (tp) {
      s.input.bpb = tp.bpb
      s.input.bpm = tp.bpm
      s.input.offset = tp.offset
    }
  }), [s])

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "t": measure(); break
      }
    }
    window.addEventListener("keydown", listener)
    return () => { window.removeEventListener("keydown", listener) }
  }, [measure])

  return useObserver(() => (
    <Grid container className={cn.timing} spacing={3}>
      <Grid item xs={12} sm container spacing={2} direction="column">
        <Grid item><Typography><FormattedMessage id="label.timepoints" /></Typography></Grid>
        <Grid item>
          <Table className={cn.table}>
            <TableHead>
              <TableRow>
                <TableCell><FormattedMessage id="label.timeoffset" /></TableCell>
                <TableCell>BPM</TableCell>
                <TableCell><FormattedMessage id="label.meter" /></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {GameMapState.map.timepoints.map(tp => (
                <TableRow key={tp.id} selected={tp === s.selectedTp} hover
                  onClick={() => s.selectedTp = s.selectedTp ? null : tp}
                  classes={{ root: cn.tablerow }}>
                  <TableCell>{TimeToString(tp.offset)}</TableCell>
                  <TableCell>{tp.bpm}</TableCell>
                  <TableCell>{tp.bpb}/4</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
        <Grid item>
          <Button color="secondary" disabled={!s.selectedTp} onClick={removeTp}>
            <FormattedMessage id="label.remove" />
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} sm container spacing={2} direction="column">
        <Grid item>
          <TimingPad mute={s.mute} selectedTp={s.selectedTp} />
        </Grid>
        <Grid item>
          <Button fullWidth disableRipple onClick={measure} disabled={!s.selectedTp}>
            <FormattedMessage id={!s.selectedTp ?
              "sentence.selectorcreatetimepoint" : "sentence.tap5timesormoretomeasure"} />
          </Button>
        </Grid>
        <Grid item container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label={<FormattedMessage id="label.offset" />} inputProps={{ type: "number", step: "0.001" }}
              value={s.input.offset.toFixed(5)} onChange={e => s.input.offset = parseFloat(e.target.value) || 1} />
          </Grid>
          <Grid item xs={12} sm={6} container>
            <IconButton onClick={() => movebeat(false)}>
              <NavigateBeforeIcon />
            </IconButton>
            <IconButton onClick={() => movebeat(true)}>
              <NavigateNextIcon />
            </IconButton>
            <Button onClick={() => s.input.offset = PlayState.position}>
              <FormattedMessage id="sentence.settocurrent" />
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="BPM" inputProps={{ type: "number", step: "0.001" }}
              value={s.input.bpm.toFixed(5)} onChange={e => s.input.bpm = parseFloat(e.target.value) || 120} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              InputProps={{ endAdornment: <InputAdornment position="end">/4</InputAdornment> }}
              fullWidth label={<FormattedMessage id="label.meter" />} inputProps={{ type: "number", step: "1" }}
              value={s.input.bpb} onChange={e => s.input.bpb = parseInt(e.target.value) || 4} />
          </Grid>
        </Grid>
        <Grid item container wrap="wrap" spacing={2}>
          <Grid item>
            <Button onClick={set} disabled={!s.selectedTp}>
              <FormattedMessage id="label.modify" />
            </Button></Grid>
          <Grid item>
            <Button onClick={set} disabled={!!s.selectedTp}>
              <FormattedMessage id="label.create" />
            </Button></Grid>
          <Grid item style={{ marginLeft: "auto" }}>
            <FormControlLabel
              control={<Switch checked={s.mute} onChange={(e, v) => s.mute = v} />}
              label={<FormattedMessage id="sentence.muteticker" />} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  ))
}