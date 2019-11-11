import React, { ReactNode, useState } from "react"
import { TextField, Box, IconButton, Link } from "@material-ui/core"
import CheckIcon from '@material-ui/icons/Check'
import CloseIcon from '@material-ui/icons/Close'
import { FormattedMessage } from "react-intl"
import { BoxProps } from "@material-ui/core/Box"
import { TextFieldProps } from "@material-ui/core/TextField"


export type EditableProps = { children: ReactNode, value: string, onChange: (s: string) => void, canEdit?: boolean, boxPorps?: BoxProps, textFieldProps?: TextFieldProps }

export const Editable = ({ children, value, onChange, canEdit = true, boxPorps, textFieldProps }: EditableProps) => {

  const [editing, setEditing] = useState(false)
  const [v, setV] = useState(value)

  if (editing && canEdit) return (
    <Box display="inline-flex" {...boxPorps}>
      <TextField value={v} onChange={e => setV(e.target.value)} {...textFieldProps} />
      <IconButton size="small" onClick={() => { setEditing(false); setV(value) }}>
        <CloseIcon color="secondary" />
      </IconButton>
      <IconButton size="small" onClick={() => { setEditing(false); onChange(v) }}>
        <CheckIcon color="primary" />
      </IconButton>
    </Box>)

  return (
    <>
      {children}
      {canEdit &&
        <Link onClick={(e: React.SyntheticEvent) => { e.preventDefault(); setEditing(true) }}>
          <FormattedMessage id="label.edit" />
        </Link>}
    </>)
}




