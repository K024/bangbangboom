import React from "react"
import { makeStyles, Box, Typography } from "@material-ui/core"
import ExploreOffIcon from '@material-ui/icons/ExploreOff'
import { FormattedMessage } from "react-intl"

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "&>*": {
      margin: theme.spacing(1, 0)
    },
    color: "#a0a0a0"
  },
  icon: {
    fontSize: "calc(160px + 10vw)!important"
  }
}))

export const NotFoundPage = () => {
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      <ExploreOffIcon className={classes.icon} />
      <Typography variant="h3">404</Typography>
      <Typography variant="h6">
        <FormattedMessage id="notice.notfound" />
      </Typography>
    </Box>
  )
}



