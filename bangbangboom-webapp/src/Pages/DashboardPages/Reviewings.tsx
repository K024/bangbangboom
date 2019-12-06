import React, { useEffect } from "react"
import { makeStyles, Box, Typography, Paper, Table, TableBody, Button, Grid, Dialog, DialogTitle, DialogActions } from "@material-ui/core"
import { FormattedMessage } from "react-intl"
import { useLocalStore, useObserver } from "mobx-react-lite"
import { MapInfo } from "../../Global/Modals"
import { Api, Xform } from "../../Global/Axios"
import { setMessage } from "../../Global/Snackbar"
import { findex } from "../../Mapping/core/Utils"
import { useHistory } from "react-router"
import { ConnectionState } from "../../Mapping/ConnectionState"
import { MapTableHeader, MapTableRow } from "../Components/MapTable"
import { CoverProgress } from "../Components/CoverProgress"

const useStyles = makeStyles(theme => ({
  paper: {
    width: "100%",
    overflowX: "auto"
  },
  table: {
    minWidth: 650,
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

export const ReviewingsPage = () => {

  const classes = useStyles()

  const s = useLocalStore(() => ({
    loading: false,
    maps: [] as MapInfo[],
    nomore: false,
    dialog: false,
    dialogmessage: "",
    selected: null as null | MapInfo,
    dialogaction: () => { },

    async loadMore() {
      s.loading = true
      try {
        const end = findex(s.maps, -1)
        const res = await Api.get<MapInfo[]>("map/reviewings",
          { params: { end: end && end.lastmodified } })
        s.maps.push(...res.data)
        if (res.data.length === 0) s.nomore = true
      } catch (error) {
        setMessage("error.neterr", "error")
      }
      s.loading = false
    }
  }))

  useEffect(() => {
    s.loadMore()
  }, [s])

  const history = useHistory()
  const handleConnect = () => {
    ConnectionState.source =
      (s.selected && s.selected.id.toString()) || ""
    history.push("/mapping/meta")
  }

  const handleReject = async () => {
    if (!s.selected) return
    s.loading = true
    try {
      await Api.post("map/review", Xform({ id: s.selected.id, pass: false }))
      s.maps = s.maps.filter(m => m !== s.selected)
      setMessage("info.success", "success")
    } catch (error) {
      setMessage("error.neterr", "error")
    }
    s.loading = false
    s.dialog = false
  }
  const openRejectDialog = () => {
    s.dialogaction = handleReject
    s.dialogmessage = "sentence.suretoreject"
    s.dialog = true
  }

  const handleAccept = async () => {
    if (!s.selected) return
    s.loading = true
    try {
      await Api.post("map/review", Xform({ id: s.selected.id, pass: true }))
      s.maps = s.maps.filter(m => m !== s.selected)
      setMessage("info.success", "success")
    } catch (error) {
      setMessage("error.neterr", "error")
    }
    s.loading = false
    s.dialog = false
  }
  const openAcceptDialog = () => {
    s.dialogaction = handleAccept
    s.dialogmessage = "sentence.suretoaccept"
    s.dialog = true
  }

  const handleProve = async () => {
    if (!s.selected) return
    s.loading = true
    try {
      await Api.post("map/review", Xform({ id: s.selected.id, pass: true, proved: true }))
      s.maps = s.maps.filter(m => m !== s.selected)
      setMessage("info.success", "success")
    } catch (error) {
      setMessage("error.neterr", "error")
    }
    s.loading = false
    s.dialog = false
  }
  const openProveDialog = () => {
    s.dialogaction = handleProve
    s.dialogmessage = "sentence.suretoprove"
    s.dialog = true
  }

  return useObserver(() => (
    <Box m={2}>
      <Paper className={classes.tools}>
        <Grid container spacing={2} justify="center">
          <Grid item>
            <Button disabled={!s.selected} color="primary"
              onClick={handleConnect} variant="outlined">
              <FormattedMessage id="label.connect" /></Button>
          </Grid>
          <Grid item>
            <Button disabled={!s.selected} color="secondary"
              onClick={openRejectDialog} variant="outlined">
              <FormattedMessage id="label.reject" /></Button>
          </Grid>
          <Grid item>
            <Button disabled={!s.selected} color="primary"
              onClick={openAcceptDialog} variant="outlined">
              <FormattedMessage id="label.accept" /></Button>
          </Grid>
          <Grid item>
            <Button disabled={!s.selected} color="primary"
              onClick={openProveDialog} variant="outlined">
              <FormattedMessage id="label.prove" /></Button>
          </Grid>
        </Grid>
      </Paper>

      <Typography className={classes.header} variant="h5">
        <FormattedMessage id="mapstatus.reviewing" />
      </Typography>
      <Paper className={classes.paper}>
        <Table className={classes.table} aria-label="simple table">
          <MapTableHeader />
          <TableBody>
            {s.maps.map(m =>
              <MapTableRow hover selected={s.selected === m}
                onClick={() => s.selected = s.selected === m ? null : m}
                key={m.id} m={m} />)}
          </TableBody>
        </Table>
      </Paper>


      {!s.nomore &&
        <Grid container justify="center">
          <Button style={{ margin: 8 }} disabled={s.loading} onClick={s.loadMore}>
            <FormattedMessage id="label.loadmore" />
          </Button>
        </Grid>}

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
    </Box>
  ))

}
