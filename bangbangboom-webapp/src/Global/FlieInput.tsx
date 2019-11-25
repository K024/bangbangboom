import React, { useState, useMemo, useCallback } from "react"
import AttachFileIcon from '@material-ui/icons/AttachFile'
import { TextField, Grid } from "@material-ui/core"
import { TextFieldProps } from "@material-ui/core/TextField"

export type FileInputProps = { accept?: string, onFileSelected?: (f: File[]) => any } & TextFieldProps

export const FileInput = ({ onFileSelected, inputProps, fullWidth, accept, ...others }: FileInputProps) => {

  const [value, setValue] = useState("")

  const handleChange = useCallback((input: HTMLInputElement, onSelected?: (f: File[]) => any) => {
    if (input.files && input.files.length) {
      const fs: File[] = []
      for (let i = 0; i < input.files.length; i++) {
        const f = input.files.item(i)
        if (f) fs.push(f)
      }
      setValue(fs.map(f => f.name).join(", "))
      if (onSelected) onSelected(fs)
    }
  }, [])

  const input = useMemo(() => {
    const i = document.createElement("input")
    i.type = "file"
    return i
  }, [])

  const handleClick = () => {
    input.accept = accept || "*"
    input.onchange = () => handleChange(input, onFileSelected)
    input.click()
  }

  return (
    <Grid style={{ display: fullWidth ? "flex" : "inline-flex" }} container alignItems="flex-end" spacing={2}>
      <Grid item><AttachFileIcon /></Grid>
      <Grid item xs>
        <TextField
          {...others}
          fullWidth={fullWidth}
          inputProps={{
            ...inputProps,
            onClick: handleClick,
          }}
          value={value} />
      </Grid>
    </Grid>)
}


