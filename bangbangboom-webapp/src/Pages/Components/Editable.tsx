import React, { ReactNode, useState } from "react"
import { TextField, Box, IconButton, Link, Grid } from "@material-ui/core"
import CheckIcon from '@material-ui/icons/Check'
import CloseIcon from '@material-ui/icons/Close'
import { FormattedMessage } from "react-intl"
import { BoxProps } from "@material-ui/core/Box"
import { TextFieldProps } from "@material-ui/core/TextField"


export type EditableProps = { children: ReactNode, value: string, onChange: (s: string) => void, canEdit?: boolean, boxPorps?: BoxProps, textFieldProps?: TextFieldProps }

export const Editable = ({ children, value, onChange, canEdit = true, boxPorps, textFieldProps }: EditableProps) => {

  const [editing, setEditing] = useState(false)
  const [v, setV] = useState(value)

  const submit = () => {
    setEditing(false)
    onChange(v)
  }
  const cancel = () => {
    setEditing(false)
    setV(value)
  }
  const keydown = (e: React.KeyboardEvent) => {
    switch (e.key.toLowerCase()) {
      case "escape": cancel(); break
      case "enter": submit(); break
    }
  }

  if (editing && canEdit) return (
    <Box display="inline-flex" {...boxPorps}>
      <TextField value={v} onChange={e => setV(e.target.value)} onKeyDown={keydown}
        {...textFieldProps} />
      <IconButton size="small" onClick={cancel}>
        <CloseIcon color="secondary" />
      </IconButton>
      <IconButton size="small" onClick={submit}>
        <CheckIcon color="primary" />
      </IconButton>
    </Box>)

  return (
    <Grid container spacing={2} alignItems="baseline">
      <Grid item>{children}</Grid>
      {canEdit &&
        <Grid item><Link onClick={(e: React.SyntheticEvent) => { e.preventDefault(); setEditing(true) }}>
          <FormattedMessage id="label.edit" />
        </Link></Grid>}
    </Grid>)
}




