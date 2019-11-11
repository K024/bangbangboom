import React, { useEffect } from "react"
import { useObserver, useLocalStore, useComputed } from "mobx-react-lite"
import { makeStyles, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Typography, Box } from "@material-ui/core"
import { Api } from "../../Global/Axios"
import { MapInfo } from "../../Global/Modals"
import { setMessage } from "../../Global/Snackbar"
import { FormattedMessage } from "react-intl"
import { CanNone } from "../Components/CanNone"
import { DateTime } from "../Components/DateTime"

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2),
  },
  paper: {
    width: "100%",
    overflowX: "auto"
  },
  table: {
    minWidth: 650,
  },
  header: {
    display: "inline-block",
    margin: theme.spacing(1),
    position: "relative",
    left: 10,
    top: -20
  }
}))

const HeaderPart = () => (
  <TableHead>
    <TableRow>
      <TableCell>Id</TableCell>
      <TableCell align="right"><FormattedMessage id="label.music" /></TableCell>
      <TableCell align="right"><FormattedMessage id="label.artist" /></TableCell>
      <TableCell align="right"><FormattedMessage id="label.mapname" /></TableCell>
      <TableCell align="right"><FormattedMessage id="label.difficulty" /></TableCell>
      <TableCell align="right"><FormattedMessage id="label.lastmodified" /></TableCell>
      <TableCell align="right"><FormattedMessage id="label.status" /></TableCell>
      <TableCell align="right"></TableCell>
    </TableRow>
  </TableHead>)

export const MyMapsPage = () => {

  const classes = useStyles()

  const s = useLocalStore(() => ({
    loading: false,
    maps: [] as MapInfo[]
  }))

  useEffect(() => {
    (async () => {
      s.loading = true
      try {
        const res = await Api.get<MapInfo[]>("map/mymaps")
        s.maps = res.data
      } catch (error) {
        setMessage("error.neterr", "error")
      }
      s.loading = false
    })()
  }, [s])

  const wips = useComputed(() => s.maps.filter(x => x.status === "wip" || x.status === "notpass"))
  const reviewing = useComputed(() => s.maps.filter(x => x.status === "reviewing"))
  const reviewed = useComputed(() => s.maps.filter(x => x.status === "reviewed" || x.status === "proved"))

  return useObserver(() => (
    <Box className={classes.root}>
      <Paper className={classes.paper}>
        <Paper className={classes.header}>
          <Typography variant="h4">
            <FormattedMessage id="mapstatus.wip" />
          </Typography>
        </Paper>
        <Table className={classes.table} aria-label="simple table">
          <HeaderPart />
          <TableBody>
            {wips.map(m => (
              <TableRow key={m.id}>
                <TableCell component="th" scope="row">{m.id}</TableCell>
                <TableCell align="right"><CanNone value={m.musicname} /></TableCell>
                <TableCell align="right"><CanNone value={m.artist} /></TableCell>
                <TableCell align="right"><CanNone value={m.mapname} /></TableCell>
                <TableCell align="right">{m.difficulty || "-"}</TableCell>
                <TableCell align="right"><DateTime date={m.lastmodified} /></TableCell>
                <TableCell align="right"><FormattedMessage id={"mapstatus." + m.status} /></TableCell>
                <TableCell align="right"><Button><FormattedMessage id="label.delete" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Paper className={classes.paper}>
        <Typography className={classes.header} variant="h4">
          <FormattedMessage id="mapstatus.reviewing" />
        </Typography>
        <Table className={classes.table} aria-label="simple table">
          <HeaderPart />
          <TableBody>
            {reviewing.map(m => (
              <TableRow key={m.id}>
                <TableCell component="th" scope="row">{m.id}</TableCell>
                <TableCell align="right"><CanNone value={m.musicname} /></TableCell>
                <TableCell align="right"><CanNone value={m.artist} /></TableCell>
                <TableCell align="right"><CanNone value={m.mapname} /></TableCell>
                <TableCell align="right">{m.difficulty || "-"}</TableCell>
                <TableCell align="right"><DateTime date={m.lastmodified} /></TableCell>
                <TableCell align="right"><FormattedMessage id={"mapstatus." + m.status} /></TableCell>
                <TableCell align="right"><Button><FormattedMessage id="label.delete" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Paper className={classes.paper}>
        <Typography className={classes.header} variant="h4">
          <FormattedMessage id="mapstatus.reviewed" />
        </Typography>
        <Table className={classes.table} aria-label="simple table">
          <HeaderPart />
          <TableBody>
            {reviewed.map(m => (
              <TableRow key={m.id}>
                <TableCell component="th" scope="row">{m.id}</TableCell>
                <TableCell align="right"><CanNone value={m.musicname} /></TableCell>
                <TableCell align="right"><CanNone value={m.artist} /></TableCell>
                <TableCell align="right"><CanNone value={m.mapname} /></TableCell>
                <TableCell align="right">{m.difficulty || "-"}</TableCell>
                <TableCell align="right"><DateTime date={m.lastmodified} /></TableCell>
                <TableCell align="right"><FormattedMessage id={"mapstatus." + m.status} /></TableCell>
                <TableCell align="right"><Button><FormattedMessage id="label.delete" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>))
}
