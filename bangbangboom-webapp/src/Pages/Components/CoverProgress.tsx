import React, { ReactNode } from "react"
import { makeStyles, Box, CircularProgress } from "@material-ui/core"
import { BoxProps } from "@material-ui/core/Box"

const useStyles = makeStyles(theme => ({
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
}))

export type ButtonProgressProps = { children: ReactNode, loading: boolean, size?: number } & BoxProps

export const ButtonProgress = ({ children, loading, size = 24, ...others }: ButtonProgressProps) => {
  const classes = useStyles()
  return (
    <Box position="relative" {...others}>
      {children}
      {loading &&
        <CircularProgress size={size}
          style={{ marginTop: -size / 2, marginLeft: -size / 2 }}
          className={classes.buttonProgress} />}
    </Box>
  )
}
