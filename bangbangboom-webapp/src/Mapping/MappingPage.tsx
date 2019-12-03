import React, { useEffect } from "react"
import { ThemeProvider } from "@material-ui/styles"
import { useObserver } from "mobx-react-lite"
import { Tabs, Tab, Box, createMuiTheme, CssBaseline, IconButton, makeStyles, Fade, CircularProgress } from "@material-ui/core"
import { lightBlue, pink, red } from "@material-ui/core/colors"
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIosOutlined'
import UndoIcon from '@material-ui/icons/Undo'
import RedoIcon from '@material-ui/icons/Redo'
import SaveAltIcon from '@material-ui/icons/SaveAlt'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'
import { useHistory, Switch, Redirect, Route } from "react-router"
import { FormattedMessage } from "react-intl"
import { StartMapping, MetaState, togglePlay } from "./MappingState"
import { ToolBar } from "./Components/ToolBar"
import { MetaPage } from "./Pages/Meta"
import { TimingPage } from "./Pages/Timing"
import { TrackMappingPage } from "./Pages/TrackMapping"
import { undoState, GameMapState } from "./GameMapState"
import { setMessage } from "../Global/Snackbar"
import { ConnectionInfo, ConnectionState } from "./ConnectionState"
import { GameMapToString } from "./core/MapCore"

const darktheme = createMuiTheme({
  palette: {
    primary: { main: lightBlue[500], contrastText: "white" },
    secondary: { main: pink["A200"] },
    error: red,
    type: "dark",
    background: { default: "black", }//paper: "rgba(127,127,127,0.5)" }
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: "inherit",
        transition: "color 0.2s"
      }
    }
  }
})

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    top: 0, bottom: 0, left: 0, right: 0
  },
  bar: {
    display: "flex",
    alignItems: "center",
    height: 50,
    backgroundColor: "rgba(128, 128, 128, 0.4)"
  },
  content: {
    flexGrow: 1,
    position: "relative",
    overflow: "hidden",
  },
  backgroundImage: {
    zIndex: -1,
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    transition: "opacity 0.3s"
  }
}))

export const MappingPage = () => {
  const cn = useStyles()
  const history = useHistory()

  useEffect(StartMapping, [])

  const handleSave = async () => {
    const res = await ConnectionInfo.saveMapContent(GameMapToString(GameMapState.map))
    if (res !== false)
      setMessage("info.success", "success")
    return res
  }

  const handleTestPlay = async () => {
    const res = await handleSave()
    if (res !== false)
      history.push("/play/local")
  }

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case " ": togglePlay(); break
        case "z":
          if (e.ctrlKey) {
            if (e.shiftKey) undoState.Redo()
            else undoState.Undo()
          }; break
        case "s": if (e.ctrlKey) { handleSave(); e.preventDefault(); } break
      }
    }
    window.addEventListener("keydown", listener)
    return () => { window.removeEventListener("keydown", listener) }
  }, [])

  return useObserver(() => (
    <ThemeProvider theme={darktheme}>
      <CssBaseline />
      <Fade in>
        <Box className={cn.root}>
          <div className={cn.backgroundImage} style={{
            backgroundImage: MetaState.backgroundImageSrc ? `url(${MetaState.backgroundImageSrc})` : "",
            opacity: 1 - MetaState.backgroundDim / 100,
            backgroundSize: MetaState.backgroundCover ? "cover" : "contain"
          }}></div>
          <Box className={cn.bar}>
            <Tabs value={history.location.pathname} onChange={(e, v) => history.replace(v)} style={{ flexGrow: 1, height: "100%" }}>
              <Tab label={<FormattedMessage id="menu.meta" />} value="/mapping/meta" />
              <Tab label={<FormattedMessage id="menu.timing" />} value="/mapping/timing" />
              <Tab label={<FormattedMessage id="menu.mapping" />} value="/mapping/mapping" />
            </Tabs>
            <Box>
              <IconButton onClick={() => undoState.Undo()} disabled={!undoState.canUndo}>
                <UndoIcon /></IconButton></Box>
            <Box>
              <IconButton onClick={() => undoState.Redo()} disabled={!undoState.canRedo}>
                <RedoIcon /></IconButton></Box>
            <Box>
              <IconButton onClick={handleSave}
                disabled={ConnectionState.readonly || ConnectionState.loading}>
                {ConnectionState.loading
                  ? <CircularProgress size={24} />
                  : <SaveAltIcon />
                }</IconButton></Box>
            <Box pr={1}>
              <IconButton onClick={handleTestPlay}>
                <PlayCircleFilledIcon /></IconButton></Box>
            <Box pr={1}>
              <IconButton onClick={() => history.goBack()}><ArrowBackIosIcon style={{ fontSize: 16 }} /></IconButton>
            </Box>
          </Box>
          <Fade in key={history.location.pathname}>
            <Box className={cn.content}>
              <Switch>
                <Route path="/mapping/meta"><MetaPage /></Route>
                <Route path="/mapping/timing"><TimingPage /></Route>
                <Route path="/mapping/mapping"><TrackMappingPage /></Route>
                <Redirect path="*" to="/mapping/meta" />
              </Switch>
            </Box>
          </Fade>
          <Box className={cn.bar}>
            <ToolBar />
          </Box>
        </Box>
      </Fade>
    </ThemeProvider>))
}
