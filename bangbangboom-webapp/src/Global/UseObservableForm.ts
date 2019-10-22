import { useLocalStore, useComputed } from "mobx-react-lite"

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

export function useObservableForm<K extends string>(description: FormDescription<K>) {
  const form = useLocalStore(() => {
    const ret = {} as Record<K, FormProps>
    for (const key in description) {

      const validator = description[key].validator

      ret[key] = {
        value: description[key].value || "",
        error: false,
        required: description[key].required,
        helperText: validator ? " " : null,
        onChange: e => {
          const field = form[key]
          field.value = e.target.value
          if (validator) {
            const res = validator(e.target.value)
            if (res === true || !e.target.value) {
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
      if (description[key].required && !form[key].value) return false
    }
    return true
  })

  return {
    form,
    formValid
  }
}

