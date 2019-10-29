import React, { useState } from "react"
import { Box, Typography, TextField, Button } from "@material-ui/core"
import { useObserver } from "mobx-react-lite"
import { FormattedMessage } from "react-intl"
import { useObservableForm, FormValue, useAsyncCheck, checkstate } from "../../Global/UseObservableForm"
import { UsernameReg, PasswordReg, LoadCurrentUser } from "../UserState"
import { Api, Xform, HandleErr } from "../../Global/Axios"
import { setMessage } from "../../Global/Snackbar"
import { DebounceFunc } from "../../Global/Utils"
import { ButtonProgress as CoverProgress } from "../Components/CoverProgress"

const TestItem = (field: string, path: string) => DebounceFunc(async (value: string, callback: (res: boolean) => void) => {
  try {
    const res = await Api.post<string>(path, Xform({ [field]: value }))
    if (res.data === "acceptable") callback(true)
    else callback(false)
  } catch (error) {
    setMessage("error.neterr", "error")
    callback(false)
  }
}, 300)

const TestEmail = TestItem("email", "account/testemail")
const TestUsername = TestItem("username", "account/testusername")

const emailbtntext = (checkstate: checkstate) => {
  switch (checkstate) {
    case "checking": return null
    case "invalid": return <FormattedMessage id="email.registered" />
    case "notchecking": return null
    case "valid": return <FormattedMessage id="email.sendemail" />
  }
}
const usernametesttext = (checkstate: checkstate) => {
  switch (checkstate) {
    case "checking": return " "
    case "invalid": return <FormattedMessage id="username.registered" />
    case "notchecking": return " "
    case "valid": return <FormattedMessage id="username.available" />
  }
}

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
    username: {
      required: true,
      validator: (s: string) => UsernameReg.test(s) || <FormattedMessage id="error.usernameformat" />,
    },
    password: {
      required: true,
      validator: (s: string) => PasswordReg.test(s) || <FormattedMessage id="error.passwordformat" />
    }
  }))

  const usernamecheck = useAsyncCheck(form.username.value,
    s => !!s && !form.username.error, TestUsername, [form.username.value])
  const emailcheck = useAsyncCheck(form.email.value,
    s => !!s && !form.email.error, TestEmail, [form.email.value])

  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const Register = async () => {
    setLoading(true)
    try {
      await Api.post("account/register", Xform(FormValue(form)))
      await LoadCurrentUser()
      setSuccess(true)
    } catch (error) {
      setMessage("error.neterr", "error")
    }
    setLoading(false)
  }

  const SendEmail = async () => {
    setLoading(true)
    try {
      await Api.post("account/sendregisteremail", Xform({ email: form.email.value }))
    } catch (error) {
      const res = HandleErr(error)
      if (res) setMessage("error.senttoomanyemails", "error")
      else setMessage("error.neterr", "error")
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
          <CoverProgress loading={emailcheck === "checking"}>
            <Button disabled={emailcheck !== "valid" || loading}
              onClick={SendEmail}>
              {emailbtntext(emailcheck)}
            </Button>
          </CoverProgress>
          <TextField label={<FormattedMessage id="label.token" />}  {...form.token} />
          <TextField label={<FormattedMessage id="label.username" />}  {...form.username} />
          <CoverProgress loading={usernamecheck === "checking"}>
            <Typography>{usernametesttext(usernamecheck)}</Typography>
          </CoverProgress>
          <TextField label={<FormattedMessage id="label.password" />} {...form.password} />
          <Button variant="contained"
            disabled={loading || !formValid || usernamecheck !== "valid" || emailcheck !== "valid"}
            onClick={Register}>
            <FormattedMessage id="label.submit" />
          </Button>
        </>}
    </Box>
  ))
}
