import React, { useEffect } from "react"
import { useObserver, useLocalStore } from "mobx-react-lite"
import { makeStyles, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Typography, Box } from "@material-ui/core"
import { Api, HandleErr } from "../../Global/Axios"
import { MapInfo } from "../../Global/Modals"
import { setMessage } from "../../Global/Snackbar"
import { FormattedMessage } from "react-intl"
import { CanNone } from "../Components/CanNone"
import { DateTime } from "../Components/DateTime"

const useStyles = makeStyles(theme => ({
  paper: {
    width: "100%",
    maxWidth: "100%",
    overflow: "auto"
  },
  table: {
    minWidth: 800,
  },
  header: {
    margin: theme.spacing(3, 1, 1)
  }
}))

const HeaderPart = () => (
  <TableHead>
    <TableRow>
      <TableCell>Id</TableCell>
      <TableCell><FormattedMessage id="label.music" /></TableCell>
      <TableCell><FormattedMessage id="label.artist" /></TableCell>
      <TableCell><FormattedMessage id="label.mapname" /></TableCell>
      <TableCell><FormattedMessage id="label.difficulty" /></TableCell>
      <TableCell><FormattedMessage id="label.lastmodified" /></TableCell>
      <TableCell><FormattedMessage id="label.status" /></TableCell>
      <TableCell></TableCell>
    </TableRow>
  </TableHead>)

const mapRow = (m: MapInfo) => (
  <TableRow key={m.id}>
    <TableCell component="th" scope="row">{m.id}</TableCell>
    <TableCell><CanNone value={m.musicname} /></TableCell>
    <TableCell><CanNone value={m.artist} /></TableCell>
    <TableCell><CanNone value={m.mapname} /></TableCell>
    <TableCell>{m.difficulty || "-"}</TableCell>
    <TableCell><DateTime date={m.lastmodified} /></TableCell>
    <TableCell><FormattedMessage id={"mapstatus." + m.status} /></TableCell>
    <TableCell><Button><FormattedMessage id="label.delete" /></Button></TableCell>
  </TableRow>)

export const MyMapsPage = () => {

  const classes = useStyles()

  const s = useLocalStore(() => ({
    loading: false,
    maps: [] as MapInfo[],
    get wips() { return s.maps.filter(x => x.status === "wip" || x.status === "notpass") },
    get reviewing() { return s.maps.filter(x => x.status === "reviewing") },
    get reviewed() { return s.maps.filter(x => x.status === "reviewed" || x.status === "proved") },
    async load() {
      s.loading = true
      try {
        const res = await Api.get<MapInfo[]>("map/mymaps")
        s.maps = res.data
      } catch (error) {
        setMessage("error.neterr", "error")
      }
      s.loading = false
    }
  }))


  const handleCreate = async () => {
    s.loading = true
    try {
      await Api.post("map/add")
      await s.load()
      setMessage("info.success", "success")
    } catch (error) {
      const err = HandleErr<string>(error)
      if (err && err.status === 403 && err.data.substr(0, 7) === "To many")
        setMessage("notice.tomanyunreviewed", "error")
      else
        setMessage("error.neterr", "error")
    }
    s.loading = false
  }

  useEffect(() => {
    s.load()
  }, [s])

  return useObserver(() => (
    <Box m={2}>
      <Button disabled={s.loading} onClick={handleCreate}>
        <FormattedMessage id="label.create" />
      </Button>
      {[{ id: "mapstatus.wip", rows: s.wips },
      { id: "mapstatus.reviewing", rows: s.reviewing },
      { id: "mapstatus.reviewed", rows: s.reviewed },].map(x =>
        <React.Fragment key={x.id}>
          <Typography className={classes.header} variant="h5">
            <FormattedMessage id={x.id} />
          </Typography>
          <Paper className={classes.paper}>
            <Table className={classes.table}>
              <HeaderPart />
              <TableBody>
                {x.rows.map(mapRow)}
              </TableBody>
            </Table>
          </Paper>
        </React.Fragment>)}
    </Box>))
}
