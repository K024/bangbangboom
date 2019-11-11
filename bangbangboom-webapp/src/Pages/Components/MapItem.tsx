import React from "react"
import { MapInfo } from "../../Global/Modals"
import { useObserver } from "mobx-react-lite"
import LazyLoad from "react-lazyload"
import { Card, CardActionArea, Box, makeStyles, Typography, Grid } from "@material-ui/core"
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'
import FavoriteIcon from '@material-ui/icons/Favorite'
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import { UserProfile, UserName } from "./UserProfile"
import { useHistory } from "react-router"

const useStyles = makeStyles(theme => ({
  root: {
    transition: "all 0.3s",
    "&:hover": {
      transform: "scale(1.05) rotate(2deg)",
      boxShadow: "0 6px 2px -4px rgba(0, 0, 0, 0.4), 0 4px 4px 0 rgba(0, 0, 0, 0.28), 0 2px 10px 0 rgba(0, 0, 0, 0.24)"
    },
  },
  media: {
    position: "relative",
    "&:before": {
      width: "100%",
      paddingTop: "60%",
      display: "block",
      content: " ",
    }
  },
  image: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    transform: "translateY(-50%)",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    background: `linear-gradient(
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.2),
      rgba(0, 0, 0, 0.5)
      )`,
  },
  left: {
    display: "flex",
    position: "absolute",
    left: theme.spacing(2),
    top: theme.spacing(2),
    color: "white",
  },
  right: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    right: theme.spacing(2),
    top: theme.spacing(2),
    color: "white",
    textShadow: "1px 1px 1px #000",
    alignItems: "flex-end",
  },
  bottom: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    left: theme.spacing(2),
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    color: "white",
  },
  proved: {
    borderRadius: 100,
    background: "rgba(0,0,0,0.5)",
    padding: theme.spacing(2, 5),
  },
  content: {
    display: "flex",
    alignItems: "center",
    "&>*": {
      margin: theme.spacing(0, 1)
    }
  },
  end: {
    justifySelf: "flex-end"
  }
}))


export type MapItemProps = {
  mapInfo: MapInfo
}

export const MapItem = ({ mapInfo }: MapItemProps) => {

  const classes = useStyles()
  const history = useHistory()

  return useObserver(() => (
    <Card>
      <CardActionArea onClick={() => history.push("/map/" + mapInfo.id)}>
        <Box className={classes.media}>
          <LazyLoad>
            {mapInfo.hasimage && <img className={classes.image} src={`/api/image/${mapInfo.id}`} alt="" />}
          </LazyLoad>
          <Box className={classes.gradient} />
          <Box className={classes.left}>
            {mapInfo.status === "proved" && <Typography className={classes.proved}>Proved</Typography>}
          </Box>
          <Box className={classes.right}>
            <Box className={classes.content}>
              {mapInfo.plays || 0}
              <PlayCircleFilledIcon />
            </Box>
            <Box className={classes.content}>
              {mapInfo.favorites || 0}
              <FavoriteIcon />
            </Box>
          </Box>
          <Box className={classes.bottom}>
            <Typography variant="h5">{mapInfo.musicname}</Typography>
            <Typography variant="subtitle1">{mapInfo.artist}</Typography>
          </Box>
        </Box>
        <Box className={classes.content}>
          <UserProfile user={mapInfo.uploader} />
          <UserName user={mapInfo.uploader} />
          <Typography className={classes.end}>{mapInfo.mapname}</Typography>
          <MusicNoteIcon className={classes.end} />
          <Box className={classes.end}>{mapInfo.difficulty || 0}</Box>
        </Box>
      </CardActionArea>
    </Card>
  ))
}

export type MapPreviewListProps = { maps: MapInfo[] }

export const MapPreviewList = ({ maps }: MapPreviewListProps) => {

  return (
    <Grid container spacing={1}>
      {maps.map(x => (
        <Grid item xs={12} sm={6} key={x.id}>
          <MapItem mapInfo={x} />
        </Grid>))}
    </Grid>)
}
