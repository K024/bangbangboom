import React, { useState, forwardRef } from "react"
import { FormControl, InputLabel, Input, InputAdornment, IconButton, FormHelperText } from "@material-ui/core"
import { TextFieldProps } from "@material-ui/core/TextField"
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

export const PasswordField = forwardRef<HTMLDivElement, TextFieldProps>((props, ref) => {

  const {
    autoComplete,
    autoFocus,
    children,
    classes,
    className: classNameProp,
    defaultValue,
    error,
    FormHelperTextProps,
    fullWidth,
    helperText,
    hiddenLabel,
    id,
    InputLabelProps,
    inputProps,
    InputProps,
    inputRef,
    label,
    multiline,
    name,
    onBlur,
    onChange,
    onFocus,
    placeholder,
    required = false,
    rows,
    rowsMax,
    select,
    SelectProps,
    type,
    value,
    variant = 'standard',
    ...other
  } = props

  const [showpass, setShowpass] = useState(false)

  const handleClickShowPassword = () => {
    setShowpass(!showpass)
  }

  return (
    <FormControl
      className={classNameProp}
      error={error}
      fullWidth={fullWidth}
      hiddenLabel={hiddenLabel}
      ref={ref}
      required={required}
      variant={variant}
      {...other}
    >
      {label && (
        <InputLabel htmlFor={id} {...InputLabelProps}>
          {label}
        </InputLabel>
      )}
      <Input
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        defaultValue={defaultValue}
        fullWidth={fullWidth}
        multiline={multiline}
        name={name}
        rows={rows}
        rowsMax={rowsMax}
        type={showpass ? 'text' : 'password'}
        value={value}
        id={id}
        inputRef={inputRef}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        placeholder={placeholder}
        inputProps={inputProps}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowPassword}
              size="small"
            >
              {showpass ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
        {...InputProps}
      />
      {helperText && (
        <FormHelperText {...FormHelperTextProps}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  )
})
