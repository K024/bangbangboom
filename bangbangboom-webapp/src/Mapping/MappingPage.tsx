import React from "react"
import { ThemeProvider } from "@material-ui/styles"
import { useObserver } from "mobx-react-lite"
import { Tabs, Tab, Box, createMuiTheme, CssBaseline, IconButton, Paper, makeStyles, Fade } from "@material-ui/core"
import { lightBlue, pink, red } from "@material-ui/core/colors"
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIosOutlined';
import { useHistory, Switch, Redirect, Route } from "react-router"
import { FormattedMessage } from "react-intl"

const darktheme = createMuiTheme({
  palette: {
    primary: { main: lightBlue[500], contrastText: "white" },
    secondary: { main: pink["A200"] },
    error: red,
    type: "dark",
    background: { default: "black", paper: "rgba(127,127,127,0.5)" }
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: "inherit"
      }
    }
  }
})

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    top: 0, bottom: 0, left: 0, right: 0
  },
  bar: {
    display: "flex",
    alignItems: "center",
    height: 50
  },
  content: {
    flexGrow: 1,
    position: "relative",
    overflow: "hidden"
  },
}))

export const MappingPage = () => {
  const classes = useStyles()
  const history = useHistory()

  return useObserver(() => (
    <ThemeProvider theme={darktheme}>
      <CssBaseline />
      <Fade in>
        <Box className={classes.root}>
          <Paper className={classes.bar} square elevation={0}>
            <Tabs value={history.location.pathname} onChange={(e, v) => history.replace(v)} style={{ flexGrow: 1, height: "100%" }}>
              <Tab label={<FormattedMessage id="menu.meta" />} value="/mapping/meta" />
              <Tab label={<FormattedMessage id="menu.timing" />} value="/mapping/timing" />
              <Tab label={<FormattedMessage id="menu.mapping" />} value="/mapping/mapping" />
            </Tabs>
            <Box pr={1}>
              <IconButton onClick={() => history.goBack()}><ArrowBackIosIcon style={{ fontSize: 16 }} /></IconButton>
            </Box>
          </Paper>
          <Fade in key={history.location.pathname}>
            <Box className={classes.content}>
              <Switch>
                <Route path="/mapping/meta">Meta</Route>
                <Route path="/mapping/timing">Timing</Route>
                <Route path="/mapping/mapping">Mapping</Route>
                <Redirect path="*" to="/mapping/meta" />
              </Switch>
            </Box>
          </Fade>
          <Paper square elevation={0} className={classes.bar}>

          </Paper>
        </Box>
      </Fade>
    </ThemeProvider>))
}
