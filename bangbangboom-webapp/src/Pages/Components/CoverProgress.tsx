import React, { ReactNode } from "react"
import { makeStyles, Box, CircularProgress } from "@material-ui/core"
import { BoxProps } from "@material-ui/core/Box"

const useStyles = makeStyles(theme => ({
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
}))

export type ButtonProgressProps = { children: ReactNode, loading: boolean } & BoxProps

export const ButtonProgress = ({ children, loading, ...others }: ButtonProgressProps) => {
  const classes = useStyles()
  return (
    <Box position="relative" {...others}>
      {children}
      {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
    </Box>
  )
}
