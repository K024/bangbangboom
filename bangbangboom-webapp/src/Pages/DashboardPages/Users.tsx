import React, { useEffect, useMemo } from "react"
import { TableHead, TableRow, TableCell, makeStyles, Box, Typography, Paper, Table, TableBody, Button } from "@material-ui/core"
import { FormattedMessage } from "react-intl"
import { useLocalStore, useObserver } from "mobx-react-lite"
import { AppUserInfo } from "../../Global/Modals"
import { Api } from "../../Global/Axios"
import { setMessage } from "../../Global/Snackbar"
import { CanNone } from "../Components/CanNone"

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
    margin: theme.spacing(3, 1, 1)
  }
}))

const HeaderPart = () => (
  <TableHead>
    <TableRow>
      <TableCell align="right"><FormattedMessage id="label.username" /></TableCell>
      <TableCell align="right"><FormattedMessage id="label.nickname" /></TableCell>
      <TableCell align="right"></TableCell>
    </TableRow>
  </TableHead>)


export const UsersPage = () => {

  const classes = useStyles()

  const s = useLocalStore(() => ({
    loading: false,
    users: [] as AppUserInfo[],
    page: 1
  }))

  const loadMore = useMemo(() => async () => {
    s.loading = true
    try {
      const res = await Api.get<AppUserInfo[]>("map/reviewings", { params: { page: s.page } })
      s.users.push(...res.data)
      s.page++
    } catch (error) {
      setMessage("error.neterr", "error")
    }
    s.loading = false
  }, [s])

  useEffect(() => {
    loadMore()
  }, [s, loadMore])

  return useObserver(() => (
    <Box className={classes.root}>
      <Typography className={classes.header} variant="h5">
        <FormattedMessage id="mapstatus.reviewing" />
      </Typography>
      <Paper className={classes.paper}>
        <Table className={classes.table} aria-label="simple table">
          <HeaderPart />
          <TableBody>
            {s.users.map(m => (
              <TableRow key={m.username}>
                <TableCell align="right"><CanNone value={m.username} /></TableCell>
                <TableCell align="right"><CanNone value={m.nickname} /></TableCell>
                <TableCell align="right"><Button><FormattedMessage id="label.delete" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Button onClick={loadMore} disabled={s.loading} fullWidth>
        <FormattedMessage id="label.loadmore" />
      </Button>
    </Box>
  ))

}
