import React, { ReactNode, useState } from "react"
import { TextField, Box, IconButton, Link } from "@material-ui/core"
import CheckIcon from '@material-ui/icons/Check'
import CloseIcon from '@material-ui/icons/Close'
import { FormattedMessage } from "react-intl"


export type EditableProps = { children: ReactNode, value: string, onChange: (s: string) => void, canEdit: boolean }

export const Editable = ({ children, value, onChange, canEdit }: EditableProps) => {

  const [editing, setEditing] = useState(false)
  const [v, setV] = useState(value)

  return (<>
    {editing ?
      <Box display="inline-flex">
        <TextField value={v} onChange={e => setV(e.target.value)} />
        <IconButton size="small" onClick={() => { setEditing(false), setV(value) }}>
          <CloseIcon color="secondary" />
        </IconButton>
        <IconButton size="small" onClick={() => { setEditing(false), onChange(v) }}>
          <CheckIcon color="primary" />
        </IconButton>
      </Box>
      : <>
        {children}
        {canEdit &&
          <Link onClick={(e: React.SyntheticEvent) => { e.preventDefault(), setEditing(true) }}>
            <FormattedMessage id="label.edit" />
          </Link>}
      </>}
  </>)
}




