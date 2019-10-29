import React, { useState } from "react"
import { Box, Typography, TextField, Button } from "@material-ui/core"
import { useObserver } from "mobx-react-lite"
import { FormattedMessage } from "react-intl"
import { useObservableForm, FormValue } from "../../Global/UseObservableForm"
import { PasswordReg } from "../UserState"
import { Api, Xform, HandleErr } from "../../Global/Axios"
import { setMessage } from "../../Global/Snackbar"

export const RegisterPage = () => {

  const { form, formValid } = useObservableForm(() => ({
    email: {
      required: true,
      validator: (s: string) => /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(s) || <FormattedMessage id="error.emailerr" />,
    },
    token: {
      required: true,
      validator: (s: string) => /^[0-9]{6}$/.test(s)
    },
    newpassword: {
      required: true,
      validator: (s: string) => PasswordReg.test(s) || <FormattedMessage id="error.passwordformat" />
    }
  }))

  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const SendEmail = async () => {
    setLoading(true)
    try {
      await Api.post("account/forgotpass", Xform({ email: form.email.value }))
    } catch (error) {
      const res = HandleErr(error)
      if (res) {
        if (res.status === 403)
          setMessage("error.senttoomanyemails", "error")
        else
          setMessage("error.nosuchuser", "error")
      }
      else setMessage("error.neterr", "error")
    }
    setLoading(false)
  }


  const Register = async () => {
    setLoading(true)
    try {
      await Api.post("account/register", Xform(FormValue(form)))
      setSuccess(true)
    } catch (error) {
      setMessage("error.neterr", "error")
    }
    setLoading(false)
  }

  return useObserver(() => (
    <Box>
      {success ?
        <></> :
        <>
          <Typography>
            <FormattedMessage id="notice.emailmaynotsent" />
          </Typography>
          <TextField label={<FormattedMessage id="label.email" />} {...form.email} />
          <Button disabled={form.email.error || loading}
            onClick={SendEmail}>
            <FormattedMessage id="email.sendemail" />
          </Button>
          <TextField label={<FormattedMessage id="label.token" />}  {...form.token} />
          <TextField label={<FormattedMessage id="label.password" />} {...form.newpassword} />
          <Button
            disabled={loading || !formValid}
            onClick={Register}></Button>
        </>}
    </Box>
  ))
}
