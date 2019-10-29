import { useLocalStore, useComputed } from "mobx-react-lite"
import { useEffect, useState } from "react"

export type FormDescription<K extends string> = Record<K, {
  value?: string
  required?: boolean,
  validator?: (s: string) => React.ReactNode | true
}>

export type FormProps = {
  value: string,
  onChange: ((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void) | undefined,
  error: boolean,
  helperText: React.ReactNode,
  required?: boolean
}

export function useObservableForm<K extends string>(descriptionFunc: () => FormDescription<K>) {
  const form = useLocalStore(() => {
    const description = descriptionFunc()
    const ret = {} as Record<K, FormProps>
    for (const key in description) {

      const { validator, value, required } = description[key]

      ret[key] = {
        value: value || "",
        error: false,
        required: required,
        helperText: validator ? " " : null,
        onChange: e => {
          const field = form[key]
          const value = e.target.value
          field.value = value
          if (validator) {
            const res = validator(value)
            if (res === true || !value) {
              field.error = false
              field.helperText = " "
            } else {
              field.error = true
              field.helperText = res
            }
          }
        }
      }
    }
    return ret
  })


  const formValid = useComputed(() => {
    for (const key in form) {
      if (form[key].error) return false
      if (form[key].required && !form[key].value) return false
    }
    return true
  })

  return {
    form,
    formValid
  }
}

export function FormValue<K extends string>(form: Record<K, FormProps>) {
  const ret = {} as Record<K, string>
  for (const key in form) {
    ret[key] = form[key].value
  }
  return ret
}

export type checkstate = "notchecking" | "checking" | "valid" | "invalid"

export function useAsyncCheck<T>(
  value: T,
  shoudCheck: (v: T) => boolean,
  check: (v: T, callback: (res: boolean) => void) => void,
  deps?: readonly any[]) {

  const [status, setStatus] = useState("notchecking" as checkstate)

  useEffect(() => {
    let valid = true
    if (!shoudCheck(value)) {
      setStatus("notchecking")
    } else {
      setStatus("checking")
      check(value, v => {
        if (valid) {
          if (v) setStatus("valid")
          else setStatus("invalid")
        }
      })
    }
    return () => { valid = false }
  }, deps)

  return status
}

