import React from "react"
import { useObserver } from "mobx-react-lite"
import { Box, makeStyles, IconButton, Switch, FormControlLabel } from "@material-ui/core"
import { ProgressBar } from "./ToolBar.ProgressBar"
import StopIcon from '@material-ui/icons/Stop'
import PauseIcon from '@material-ui/icons/Pause'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import { PlayState, togglePlay, seekPercent } from "../MappingState"
import { FormattedMessage } from "react-intl"

const useStyles = makeStyles(theme => ({
  player: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  switchs: {
    marginLeft: theme.spacing(1)
  }
}))

function stop() {
  if (PlayState.music) PlayState.music.pause()
  seekPercent(0)
}

export const ToolBar = () => {
  const cn = useStyles()
  return useObserver(() => (
    <Box className={cn.player}>
      <ProgressBar />
      <IconButton onClick={togglePlay}>
        {PlayState.playing ?
          <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
      <IconButton onClick={stop}>
        <StopIcon />
      </IconButton>
      <FormControlLabel
        className={cn.switchs}
        control={<Switch checked={PlayState.half}
          onChange={(e, c) => PlayState.half = c} />}
        label={<FormattedMessage id="label.halfspeed" />}
      />
    </Box>
  ))
}
