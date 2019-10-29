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
      margin: theme.spacing(3, 0)
    }
  },
  icon: {
    fontSize: "160px!important"
  }
}))

export const NotFoundPage = () => {
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      <ExploreOffIcon className={classes.icon} />
      <Typography variant="h1">404</Typography>
      <Typography variant="h2">
        <FormattedMessage id="notice.notfound" />
      </Typography>
    </Box>
  )
}



