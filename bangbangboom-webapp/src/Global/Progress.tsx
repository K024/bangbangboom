import React from "react"
import { observable } from "mobx"
import { makeStyles, LinearProgress } from "@material-ui/core"
import { useObserver } from "mobx-react-lite"

export const Loading = observable({
  loading: false
})

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: 0,
    position: "fixed",
    top: 0,
    width: "100%",
  }
}))

export const ProgressBar = () => {
  const classes = useStyles()
  return useObserver(() => (Loading.loading && <LinearProgress className={classes.root} />) || null)
}
