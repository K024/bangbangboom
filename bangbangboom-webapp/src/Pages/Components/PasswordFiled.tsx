import React, { useState, forwardRef } from "react"
import { InputAdornment, IconButton } from "@material-ui/core"
import TextField, { TextFieldProps } from "@material-ui/core/TextField"
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

export const PasswordField = forwardRef<HTMLDivElement, TextFieldProps>((props, ref) => {

  const [showpass, setShowpass] = useState(false)

  const handleClickShowPassword = () => {
    setShowpass(!showpass)
  }

  const InputProps = Object.assign({}, props.InputProps || {}, {
    endAdornment:
      <InputAdornment position="end" >
        <IconButton
          onClick={handleClickShowPassword}
          size="small"
        >
          {showpass ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      </InputAdornment >
  })

  return (
    <TextField ref={ref} {...props} InputProps={InputProps} type={showpass ? "text" : "password"}></TextField>
  )
})
