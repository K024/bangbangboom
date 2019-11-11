import React from "react"
import { Typography, makeStyles } from "@material-ui/core"
import { FormattedMessage } from "react-intl"

const useStyles = makeStyles(theme => ({
  none: {
    fontStyle: "italic",
    color: "#a0a0a0"
  },
}))

export type CanNoneProps = { value?: string }

export const CanNone = ({ value }: CanNoneProps) => {

  const classes = useStyles()

  return (
    <Typography className={value ? "" : classes.none}>
      {value || <FormattedMessage id="label.none" />}
    </Typography>)
}