import React, { ReactNode, useState, Fragment, Dispatch, SetStateAction } from "react"
import { useObserver } from "mobx-react-lite"
import { mediaQuery } from "../Global/Theme"
import { Box, Drawer, makeStyles, Divider, List, ListItem, ListItemText, Fade, IconButton, Typography } from "@material-ui/core"
import { FormattedMessage } from "react-intl"
import { useHistory } from "react-router"
import MenuIcon from "@material-ui/icons/Menu"
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIosOutlined';

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  fullw: {
    width: drawerWidth
  },
  header: {
    height: 60,
    display: "flex",
    alignItems: "center",
    width: "100%",
    "&>*": {
      margin: 5
    }
  },
  ...mediaQuery,
}))

const drawerItems = [
  [
    { path: "/dashboard", text: "menu.profile" },
    { path: "/dashboard/mymaps", text: "menu.mymaps" }
  ],
  [
    { path: "/dashboard/reviewings", text: "menu.reviewings" },
    { path: "/dashboard/users", text: "menu.users" },
    { path: "/dashboard/allmaps", text: "menu.allmaps" }
  ]]

const DrawerContent = ({ close }: { close: () => void }) => {
  const history = useHistory()

  return useObserver(() => (
    <Box>
      <Box mt="50px"></Box>
      <ListItem button onClick={() => history.push("/")}>
        <ListItemText><Typography>bangbangboom</Typography></ListItemText>
      </ListItem>
      {drawerItems.map((x, i) => (
        <Fragment key={i}>
          <Divider />
          <List>
            {x.map(xx => (
              <ListItem button key={xx.path}
                selected={history.location.pathname === xx.path} onClick={() => { history.push(xx.path); close() }}>
                <ListItemText>
                  <Typography><FormattedMessage id={xx.text}></FormattedMessage></Typography>
                </ListItemText>
              </ListItem>)
            )}
          </List>
        </Fragment>))}
    </Box>
  ))
}

const MyDrawer = (props: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) => {
  const classes = useStyles()
  const { open, setOpen } = props

  return useObserver(() => (
    <Box className={classes.drawer}>
      <Drawer variant="temporary" open={open} onClose={() => setOpen(false)}
        ModalProps={{ keepMounted: true }} classes={{ paper: classes.fullw }} className={classes.sm}>
        <DrawerContent close={() => setOpen(false)} />
      </Drawer>
      <Drawer className={classes.lg} variant="permanent" open classes={{ paper: classes.fullw }}>
        <DrawerContent close={() => setOpen(false)} />
      </Drawer>
    </Box>))
}

export const DashboardFrame = ({ children = {} as ReactNode }) => {
  const classes = useStyles()
  const history = useHistory()
  const [open, setOpen] = useState(false)

  return (
    <Fade in>
      <Box className={classes.root}>
        <MyDrawer open={open} setOpen={setOpen}></MyDrawer>
        <Box flexGrow={1}>
          <Box className={classes.header}>
            <Box className={classes.sm}>
              <IconButton onClick={() => setOpen(!open)}><MenuIcon /></IconButton>
            </Box>
            <Box flexGrow={1} pl={1}><Typography>Dashboard</Typography></Box>
            <Box>
              <IconButton onClick={() => history.goBack()}><ArrowBackIosIcon /></IconButton>
            </Box>
          </Box>
          <Fade in key={history.location.pathname}>
            <Box>
              {children}
            </Box>
          </Fade>
        </Box>
      </Box>
    </Fade>
  )
}