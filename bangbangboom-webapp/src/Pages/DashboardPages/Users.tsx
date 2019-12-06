import React, { useEffect } from "react"
import { TableHead, TableRow, TableCell, makeStyles, Box, Typography, Paper, Table, TableBody, Button, Grid, Dialog, DialogTitle, DialogActions } from "@material-ui/core"
import { FormattedMessage } from "react-intl"
import { useLocalStore, useObserver } from "mobx-react-lite"
import { AppUserInfo } from "../../Global/Modals"
import { Api, Xform } from "../../Global/Axios"
import { setMessage } from "../../Global/Snackbar"
import { CanNone } from "../Components/CanNone"
import { CoverProgress } from "../Components/CoverProgress"

const useStyles = makeStyles(theme => ({
  tools: {
    position: "absolute",
    right: 10,
    bottom: 10,
    zIndex: 2,
    padding: theme.spacing(1, 3)
  },
  paper: {
    width: "100%",
    overflowX: "auto"
  },
  table: {
    minWidth: 650,
  },
  header: {
    margin: theme.spacing(3, 1, 1)
  }
}))

const HeaderPart = () => (
  <TableHead>
    <TableRow>
      <TableCell><FormattedMessage id="label.username" /></TableCell>
      <TableCell><FormattedMessage id="label.nickname" /></TableCell>
      <TableCell><FormattedMessage id="label.role" /></TableCell>
    </TableRow>
  </TableHead>)

const getRole = (arr?: string[]) => {
  if (!arr) return
  if (arr.indexOf("admin") >= 0) return "Admin"
  if (arr.indexOf("reviewer") >= 0) return "Reviewer"
  return
}


export const UsersPage = () => {

  const classes = useStyles()

  const s = useLocalStore(() => ({
    loading: false,
    users: [] as AppUserInfo[],
    end: "",
    nomore: false,

    dialog: false,
    dialogmessage: "",
    dialogaction: () => { },
    selected: null as null | AppUserInfo,

    async loadMore() {
      s.loading = true
      try {
        const res = await Api.get<{ data: AppUserInfo[], end: string }>("user/all", { params: { end: s.end || undefined } })
        if (res.data.data.length === 0) s.nomore = true
        s.users.push(...res.data.data)
        s.end = res.data.end
      } catch (error) {
        setMessage("error.neterr", "error")
      }
      s.loading = false
    }
  }))

  useEffect(() => {
    s.loadMore()
  }, [s])

  const handleSetAdmin = async () => {
    if (!s.selected) return
    s.loading = true
    try {
      await Api.post("user/setadmin", Xform({ username: s.selected.username }))
      s.selected.roles = ["admin", "reviewer"]
      setMessage("info.success", "success")
    } catch (error) {
      setMessage("error.neterr", "error")
    }
    s.loading = false
    s.dialog = false
  }
  const openSetAdminDialog = () => {
    s.dialogmessage = "sentence.suretosetadmin"
    s.dialogaction = handleSetAdmin
    s.dialog = true
  }
  const handleSetReviewer = async () => {
    if (!s.selected) return
    s.loading = true
    try {
      await Api.post("user/setreviewer", Xform({ username: s.selected.username }))
      s.selected.roles = ["reviewer"]
      setMessage("info.success", "success")
    } catch (error) {
      setMessage("error.neterr", "error")
    }
    s.loading = false
    s.dialog = false
  }
  const openSetReviewerDialog = () => {
    s.dialogmessage = "sentence.suretosetreviewer"
    s.dialogaction = handleSetReviewer
    s.dialog = true
  }
  const handleUneetReviewer = async () => {
    if (!s.selected) return
    s.loading = true
    try {
      await Api.post("user/unsetreviewer", Xform({ username: s.selected.username }))
      s.selected.roles = []
      setMessage("info.success", "success")
    } catch (error) {
      setMessage("error.neterr", "error")
    }
    s.loading = false
    s.dialog = false
  }
  const openUnsetReviewerDialog = () => {
    s.dialogmessage = "sentence.suretounsetreviewer"
    s.dialogaction = handleUneetReviewer
    s.dialog = true
  }

  return useObserver(() => (
    <Box m={2}>
      <Paper className={classes.tools}>
        <Grid container spacing={2} justify="center">
          <Grid item>
            <Button disabled={!s.selected ||
              (s.selected.roles && s.selected.roles.indexOf("reviewer") >= 0)}
              color="primary"
              onClick={openSetReviewerDialog} variant="outlined">
              <FormattedMessage id="label.setreviewer" /></Button>
          </Grid>
          <Grid item>
            <Button disabled={!s.selected ||
              !(s.selected.roles && s.selected.roles.length === 1)}
              color="secondary"
              onClick={openUnsetReviewerDialog} variant="outlined">
              <FormattedMessage id="label.unsetreviewer" /></Button>
          </Grid>
          <Grid item>
            <Button disabled={!s.selected ||
              (s.selected.roles && s.selected.roles.indexOf("admin") >= 0)}
              color="secondary"
              onClick={openSetAdminDialog} variant="outlined">
              <FormattedMessage id="label.setadmin" /></Button>
          </Grid>
        </Grid>
      </Paper>

      <Typography className={classes.header} variant="h5">
        <FormattedMessage id="menu.users" />
      </Typography>
      <Paper className={classes.paper}>
        <Table className={classes.table} aria-label="simple table">
          <HeaderPart />
          <TableBody>
            {s.users.map(m => (
              <TableRow key={m.username} hover selected={s.selected === m}
                onClick={() => s.selected = s.selected === m ? null : m}>
                <TableCell><CanNone value={m.username} /></TableCell>
                <TableCell><CanNone value={m.nickname} /></TableCell>
                <TableCell><CanNone value={getRole(m.roles)} /></TableCell>
              </TableRow>
            ))}
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
