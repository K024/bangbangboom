import React, { useEffect } from "react"
import { useObserver, useLocalStore } from "mobx-react-lite"
import { Box, makeStyles, CircularProgress, Typography, Grid, IconButton } from "@material-ui/core"
import { useParams, useHistory } from "react-router"
import { NotFoundPage } from "./NotFound"
import { MapInfo } from "../../Global/Modals"
import { Api, HandleErr, Xform } from "../../Global/Axios"
import { setMessage } from "../../Global/Snackbar"
import LazyLoad from "react-lazyload"
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import clsx from "clsx"
import { UserProfile, UserName } from "../Components/UserProfile"
import { UserState } from "../UserState"
import { CoverProgress } from "../Components/CoverProgress"
import { DateTime } from "../Components/DateTime"
import { Comments } from "../Components/Comments"


const useStyles = makeStyles(theme => ({
  root: {

  },
  imageBox: {
    position: "relative",
    "&:before": {
      width: "100%",
      paddingTop: "54%",
      display: "block",
      content: '" "',
    },
    overflow: "hidden",
  },
  image: {
    position: "absolute",
    width: "100%",
    top: "50%",
    left: 0,
    right: 0,
    transform: "translateY(-50%)",
  },
  center: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  playcover: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0,
    background: "rgba(0,0,0,0.4)",
    transition: "opacity 0.4s",
    "&:hover": {
      opacity: 1
    }
  },
  playicon: {
    fontSize: "60px!important",
    color: "white",
  },
  margininner: {
    "&>*": {
      margin: theme.spacing(0, 3)
    }
  }
}))

export const MapDetailPage = () => {

  const classes = useStyles()

  const params = useParams<{ id?: string }>()

  // eslint-disable-next-line
  const history = useHistory()

  const s = useLocalStore(() => ({
    map: null as null | MapInfo,
    notfound: false,
    isfavorite: undefined as undefined | boolean,
    loading: false,
  }))

  useEffect(() => {
    (async function () {
      if (!params.id) return
      try {
        const res = await Api.get<MapInfo>("map/info", { params: { id: params.id } })
        s.map = res.data
        if (UserState.user) {
          const fav = await Api.get<boolean>("favorite/isfavorite", { params: { mapid: params.id } })
          s.isfavorite = fav.data
        }
      } catch (error) {
        const res = HandleErr(error)
        if (res && res.status === 404)
          s.notfound = true
        else setMessage("error.neterr", "error")
      }
    })()
  }, [params.id, s])

  const handlePlay = () => {
    history.push("/play/" + params.id)
  }

  const toggleFavorite = async () => {
    if (!UserState.user) return
    s.loading = true
    try {
      if (s.isfavorite)
        await Api.post<MapInfo>("favorite/remove", Xform({ mapid: params.id }))
      else
        await Api.post<MapInfo>("favorite/add", Xform({ mapid: params.id }))
      s.isfavorite = !s.isfavorite
      if (s.map) s.map.favorites = (s.map.favorites || 0) + (s.isfavorite ? 1 : -1)
      setMessage("info.success", "success")
    } catch (error) {
      setMessage("error.neterr", "error")
    }
    s.loading = false
  }

  return useObserver(() => {

    if (!params.id) return <NotFoundPage />
    if (s.notfound) return <NotFoundPage />
    const map = s.map
    if (!map) return <Box m={3} className={classes.center}><CircularProgress style={{ margin: "auto" }} /></Box>

    return (
      <Box>
        <Box className={classes.imageBox}>
          <LazyLoad>
            {map.hasimage && <img className={classes.image} src={`/api/map/image/${map.id}`} alt="" />}
          </LazyLoad>
          <Box className={clsx(classes.center, classes.playcover)}
            onClick={handlePlay}>
            <PlayCircleFilledIcon className={classes.playicon} />
          </Box>
        </Box>
        <Box p={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8} container direction="column" spacing={1}>
              <Grid item>
                <Typography variant="h4">{map.musicname}</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5">{map.artist}</Typography>
              </Grid>
              <Grid item>
                <DateTime date={map.reviewed as string} />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={4} container spacing={1} alignItems="center">
              <Grid item>
                <UserProfile user={map.uploader} />
              </Grid>
              <Grid item>
                <UserName user={map.uploader} />
              </Grid>
              <Grid item xs></Grid>
              <Grid item>
                <Grid container alignItems="center">
                  <PlayCircleFilledIcon />
                  {map.plays || 0}
                </Grid>
              </Grid>
              <Grid item>
                <Grid container alignItems="center">
                  <CoverProgress loading={s.loading} size={12}>
                    <IconButton size="small" disabled={!UserState.user || s.loading} onClick={toggleFavorite}>
                      {s.isfavorite
                        ? <FavoriteIcon />
                        : <FavoriteBorderIcon />}
                    </IconButton>
                  </CoverProgress>
                  {map.favorites || 0}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography>{map.mapname}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>{map.description}</Typography>
            </Grid>
          </Grid>
        </Box>
        <Comments id={params.id} />
      </Box>
    )
  })
}


