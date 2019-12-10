import React, { useState, forwardRef } from "react"
import TextField, { TextFieldProps } from "@material-ui/core/TextField"

export type NumberInputProps = TextFieldProps & {
  number?: number,
  validator?: (s: string) => number | boolean,
  numberDisplay?: (v: any) => string,
  onNumberChange?: (e: React.ChangeEvent, v: number) => void
}

export const NumberInput = forwardRef<HTMLDivElement, NumberInputProps>((props, ref) => {

  const {
    number = 0,
    validator = (s: string) => /^-?([0-9]+(\.[0-9]+)?)$/.test(s) && parseFloat(s),
    numberDisplay = (v: number) => v.toString(),
    onNumberChange,
    ...others
  } = props

  const display = numberDisplay(number)

  const [value, setValue] = useState(display)
  const [valid, setValid] = useState(true)

  if (valid && validator(display) !== validator(value))
    setValue(display)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = validator(e.target.value)
    if (typeof v === "number" && !isNaN(v)) {
      setValid(true)
      if (typeof onNumberChange === "function")
        onNumberChange(e, v)
    } else {
      setValid(false)
    }
    setValue(e.target.value)
  }

  const onBlur = () => {
    if (!valid) {
      setValue(numberDisplay(number))
      setValid(true)
    }
  }

  return (
    <TextField ref={ref} {...others}
      value={value} onChange={onChange}
      onBlur={onBlur}
      color={valid ? "primary" : "secondary"}>
    </TextField>
  )
})
