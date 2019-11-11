import React, { useEffect } from "react"
import { useObserver, useLocalStore } from "mobx-react-lite"
import { Box, makeStyles, CircularProgress, Typography } from "@material-ui/core"
import { useParams, useHistory } from "react-router"
import { NotFoundPage } from "./NotFound"
import { MapInfo } from "../../Global/Modals"
import { Api, HandleErr } from "../../Global/Axios"
import { setMessage } from "../../Global/Snackbar"
import LazyLoad from "react-lazyload"
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'
import clsx from "clsx"
import { UserProfile, UserName } from "../Components/UserProfile"


const useStyles = makeStyles(theme => ({
  root: {

  },
  imageBox: {
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
    fontSize: "48px!important",
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

  const state = useLocalStore(() => ({
    map: null as null | MapInfo,
    notfound: false
  }))

  useEffect(() => {
    (async function () {
      if (!params.id) return
      try {
        const res = await Api.get<MapInfo>("map/info", { params: { id: params.id } })
        state.map = res.data
      } catch (error) {
        const res = HandleErr(error)
        if (res && res.status === 404)
          state.notfound = true
        else setMessage("error.neterr", "error")
      }
    })()
  }, [params.id, state])


  return useObserver(() => {

    if (!params.id) return <NotFoundPage />
    if (state.notfound) return <NotFoundPage />
    const map = state.map
    if (!map) return <Box m={3}><CircularProgress style={{ margin: "auto" }} /></Box>

    return (
      <Box>
        <Box className={classes.imageBox}>
          <LazyLoad>
            {map.hasimage && <img className={classes.image} src={`/api/image/${map.id}`} alt="" />}
          </LazyLoad>
          <Box className={clsx(classes.center, classes.playcover)}>
            <PlayCircleFilledIcon className={classes.playicon} />
          </Box>
        </Box>
        <Box display="flex">
          <Typography>{map.musicname}</Typography>
        </Box>
        <Typography>{map.artist}</Typography>
        <Box display="flex">
          <UserProfile user={map.uploader} />
          <UserName user={map.uploader} />
          <Typography>{map.mapname}</Typography>
        </Box>
        <Typography>{map.description}</Typography>
      </Box>
    )
  })
}


