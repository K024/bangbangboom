import React, { useEffect } from "react"
import { makeStyles, Box, Typography, Paper, Table, TableBody, Button, Dialog, DialogTitle, DialogActions, Grid } from "@material-ui/core"
import { FormattedMessage } from "react-intl"
import { useLocalStore, useObserver } from "mobx-react-lite"
import { MapInfo, CanPublicViewStatus } from "../../Global/Modals"
import { Api, HandleErr, Xform } from "../../Global/Axios"
import { setMessage } from "../../Global/Snackbar"
import { MapTableHeader, MapTableRow } from "../Components/MapTable"
import { CoverProgress } from "../Components/CoverProgress"
import { findex } from "../../Mapping/core/Utils"
import { ConnectionState } from "../../Mapping/ConnectionState"
import { useHistory } from "react-router"

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

export const AllMapsPage = () => {

  const classes = useStyles()

  const s = useLocalStore(() => ({
    loading: false,
    maps: [] as MapInfo[],
    selected: null as MapInfo | null,
    dialog: false,
    nomore: false,

    async loadmore() {
      const last = findex(s.maps, -1)
      s.loading = true
      try {
        const res = await Api.get<MapInfo[]>("map/all", { params: { end: last && last.id } })
        if (res.data.length === 0) s.nomore = true
        s.maps.push(...res.data)
      } catch (error) {
        const err = HandleErr(error)
        if (err && err.status === 403)
          setMessage("error.forbidden", "error")
        else
          setMessage("error.neterr", "error")
      }
      s.loading = false
    }
  }))

  useEffect(() => {
    s.loadmore()
  }, [s])

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

  const history = useHistory()
  const handleConnect = () => {
    ConnectionState.source =
      (s.selected && s.selected.id.toString()) || ""
    history.push("/mapping/meta")
  }

  return useObserver(() => (
    <Box m={2}>
      <Paper className={classes.tools}>
        <Grid container spacing={2} justify="center">
          <Grid item>
            <Button disabled={!s.selected ||
              CanPublicViewStatus.indexOf(s.selected.status) < 0} color="primary"
              onClick={handleConnect} variant="outlined">
              <FormattedMessage id="label.connect" /></Button>
          </Grid>
          <Grid item>
            <Button disabled={!s.selected} color="secondary"
              onClick={() => s.dialog = true} variant="outlined">
              <FormattedMessage id="label.delete" /></Button>
          </Grid>
        </Grid>
      </Paper>

      <Typography className={classes.header} variant="h5">
        <FormattedMessage id="label.all" />
      </Typography>
      <Paper className={classes.paper}>
        <Table className={classes.table} aria-label="simple table">
          <MapTableHeader />
          <TableBody>
            {s.maps.map(m => {
              return <MapTableRow key={m.id} m={m} hover selected={m === s.selected} onClick={() => s.selected = s.selected === m ? null : m} />
            })}
          </TableBody>
        </Table>
      </Paper>

      {!s.nomore &&
        <Grid container justify="center">
          <Button style={{ margin: 8 }} disabled={s.loading} onClick={s.loadmore}>
            <FormattedMessage id="label.loadmore" />
          </Button>
        </Grid>}

      <Dialog open={s.dialog}
        onClose={() => s.dialog = false}>
        <DialogTitle><FormattedMessage id="sentence.suretodelete" /></DialogTitle>
        <DialogActions>
          <CoverProgress loading={s.loading}>
            <Button disabled={s.loading} onClick={handleDelete} color="primary">
              <FormattedMessage id="label.confirm" />
            </Button>
          </CoverProgress>
        </DialogActions>
      </Dialog>
    </Box>
  ))
}
