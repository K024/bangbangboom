import React from "react"
import { useObserver } from "mobx-react-lite"
import { Box, Slider, Grid, FormControlLabel, Switch } from "@material-ui/core"
import { GameSettings } from "../GamePages/GameSettings"
import { FormattedMessage } from "react-intl"

export const SettingsPage = () => {

  return useObserver(() =>
    <Box p={4}>
      <Grid container spacing={2} direction="column">
        <Grid item>
          <FormattedMessage id="settings.judgeoffset" />
          <Slider valueLabelDisplay="auto"
            value={GameSettings.judgeOffset}
            onChange={(e, v) => GameSettings.judgeOffset = v as number}
            min={-500} max={+500} step={1} />
        </Grid>
        <Grid item>
          <FormattedMessage id="settings.visualoffset" />
          <Slider valueLabelDisplay="auto"
            value={GameSettings.visualOffset}
            onChange={(e, v) => GameSettings.visualOffset = v as number}
            min={-500} max={+500} step={1} />
        </Grid>
        <Grid item>
          <FormattedMessage id="settings.speed" />
          <Slider valueLabelDisplay="auto"
            value={GameSettings.speed}
            onChange={(e, v) => GameSettings.speed = v as number}
            min={1} max={11} step={0.1} />
        </Grid>
        <Grid item>
          <FormattedMessage id="settings.resolution" />
          <Slider valueLabelDisplay="auto"
            value={GameSettings.resolution}
            onChange={(e, v) => GameSettings.resolution = v as number}
            min={0.2} max={5} step={0.1} />
        </Grid>
        <Grid item>
          <FormattedMessage id="settings.notescale" />
          <Slider valueLabelDisplay="auto"
            value={GameSettings.noteScale}
            onChange={(e, v) => GameSettings.noteScale = v as number}
            min={0.1} max={2} step={0.01} />
        </Grid>
        <Grid item>
          <FormattedMessage id="settings.baropacity" />
          <Slider valueLabelDisplay="auto"
            value={GameSettings.barOpacity}
            onChange={(e, v) => GameSettings.barOpacity = v as number}
            min={0.1} max={1} step={0.01} />
        </Grid>
        <Grid item>
          <FormattedMessage id="settings.backgrounddim" />
          <Slider valueLabelDisplay="auto"
            value={GameSettings.backgroundDim}
            onChange={(e, v) => GameSettings.backgroundDim = v as number}
            min={0.1} max={1} step={0.01} />
        </Grid>
        <Grid item>
          <FormattedMessage id="settings.effectvolume" />
          <Slider valueLabelDisplay="auto"
            value={GameSettings.effectVolume}
            onChange={(e, v) => GameSettings.effectVolume = v as number}
            min={0} max={1} step={0.01} />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={<Switch checked={GameSettings.showSimLine}
              onChange={(e, v) => GameSettings.showSimLine = v} />}
            label={<FormattedMessage id="settings.showsimline" />}
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={<Switch checked={GameSettings.laneEffect}
              onChange={(e, v) => GameSettings.laneEffect = v} />}
            label={<FormattedMessage id="settings.laneeffect" />}
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={<Switch checked={GameSettings.mirror}
              onChange={(e, v) => GameSettings.mirror = v} />}
            label={<FormattedMessage id="settings.mirror" />}
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={<Switch checked={GameSettings.beatNote}
              onChange={(e, v) => GameSettings.beatNote = v} />}
            label={<FormattedMessage id="settings.beatnote" />}
          />
        </Grid>
      </Grid>
    </Box>)
}