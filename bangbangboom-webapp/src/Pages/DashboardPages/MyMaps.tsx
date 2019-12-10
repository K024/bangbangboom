import React, { useEffect } from "react"
import { useObserver, useLocalStore } from "mobx-react-lite"
import { makeStyles, Paper, Table, TableBody, Button, Typography, Box, Dialog, DialogTitle, DialogActions, Grid } from "@material-ui/core"
import { Api, HandleErr, Xform } from "../../Global/Axios"
import { MapInfo, CanPublicViewStatus } from "../../Global/Modals"
import { setMessage } from "../../Global/Snackbar"
import { FormattedMessage } from "react-intl"
import { MapTableHeader, MapTableRow } from "../Components/MapTable"
import { CoverProgress } from "../Components/CoverProgress"
import { ConnectionState } from "../../Mapping/ConnectionState"
import { useHistory } from "react-router"

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
  },
  tools: {
    position: "absolute",
    right: 10,
    bottom: 10,
    zIndex: 2,
    padding: theme.spacing(1, 3)
  }
}))

export const MyMapsPage = () => {

  const classes = useStyles()

  const s = useLocalStore(() => ({
    loading: false,
    maps: [] as MapInfo[],
    dialog: false,
    selected: null as null | MapInfo,

    dialogmessage: "",
    dialogaction: () => { },

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

  useEffect(() => {
    s.load()
  }, [s])

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

  const handleDelete = async () => {
    if (!s.selected) return
    s.loading = true
    try {
      await Api.post("map/delete", Xform({ id: s.selected.id }))
      setMessage("info.success", "success")
      s.maps = s.maps.filter(x => x !== s.selected)
      s.selected = null
    } catch (error) {
      const err = HandleErr(error)
      if (err && err.status === 403)
        setMessage("error.forbidden", "error")
      else
        setMessage("error.neterr", "error")
    }
    s.loading = false
    s.dialog = false
  }

  const handleRecall = async () => {
    if (!s.selected) return
    s.loading = true
    try {
      await Api.post("map/recall", Xform({ id: s.selected.id }))
      setMessage("info.success", "success")
      s.selected.status = "wip"
    } catch (error) {
      const err = HandleErr(error)
      if (err && err.status === 403)
        setMessage("error.forbidden", "error")
      else
        setMessage("error.neterr", "error")
    }
    s.loading = false
    s.dialog = false
  }

  const history = useHistory()
  const handleConnect = () => {
    ConnectionState.source =
      (s.selected && s.selected.id.toString()) || ""
    history.push("/mapping/meta")
  }

  const handlePublish = async () => {
    if (!s.selected) return
    s.loading = true
    try {
      await Api.post("map/publish", Xform({ id: s.selected.id }))
      setMessage("info.success", "success")
      s.selected.status = "reviewing"
    } catch (error) {
      const err = HandleErr(error)
      if (err && err.status === 403)
        setMessage("error.forbidden", "error")
      else
        setMessage("error.neterr", "error")
    }
    s.loading = false
  }

  const openDeleteDialog = () => {
    s.dialogaction = handleDelete
    s.dialogmessage = "sentence.suretodelete"
    s.dialog = true
  }
  const openRecallDialog = () => {
    s.dialogaction = handleRecall
    s.dialogmessage = "sentence.suretorecall"
    s.dialog = true
  }

  return useObserver(() => (
    <Box m={2}>
      <Paper className={classes.tools}>
        <Grid container spacing={2} justify="center">
          <Grid item>
            <Button disabled={s.loading || !s.selected} color="primary"
              onClick={handleConnect} variant="outlined">
              <FormattedMessage id="label.connect" /></Button>
          </Grid>
          <Grid item>
            <Button disabled={s.loading || !s.selected ||
              s.selected.status !== "wip"} color="primary"
              onClick={handlePublish} variant="outlined">
              <FormattedMessage id="label.publish" /></Button>
          </Grid>
          <Grid item>
            <Button disabled={s.loading || !s.selected ||
              CanPublicViewStatus.indexOf(s.selected.status) < 0}
              color="secondary"
              onClick={openRecallDialog} variant="outlined">
              <FormattedMessage id="label.recall" /></Button>
          </Grid>
          <Grid item>
            <Button disabled={s.loading || !s.selected} color="secondary"
              onClick={openDeleteDialog} variant="outlined">
              <FormattedMessage id="label.delete" /></Button>
          </Grid>
        </Grid>
      </Paper>

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
              <MapTableHeader />
              <TableBody>
                {x.rows.map(m => <MapTableRow hover selected={m === s.selected}
                  onClick={() => s.selected = s.selected === m ? null : m} m={m} />)}
              </TableBody>
            </Table>
          </Paper>
        </React.Fragment>)}


      <Dialog open={s.dialog}
        onClose={() => s.dialog = false}>
        <DialogTitle><FormattedMessage id={s.dialogmessage} /></DialogTitle>
        <DialogActions>
          <CoverProgress loading={s.loading}>
            <Button disabled={s.loading} onClick={s.dialogaction} color="primary">
              <FormattedMessage id="label.confirm" />
            </Button>
          </CoverProgress>
        </DialogActions>
      </Dialog>
    </Box>))
}
