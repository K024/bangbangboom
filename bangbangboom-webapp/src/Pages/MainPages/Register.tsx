import React from "react"
import { Box, Typography, TextField, Button, makeStyles } from "@material-ui/core"
import { useObserver, useLocalStore } from "mobx-react-lite"
import { FormattedMessage } from "react-intl"
// eslint-disable-next-line
import { useObservableForm, FormValue, useAsyncCheck, checkstate } from "../../Global/UseObservableForm"
import { UsernameReg, PasswordReg, LoadCurrentUser, UserState } from "../UserState"
import { Api, Xform, HandleErr } from "../../Global/Axios"
import { setMessage } from "../../Global/Snackbar"
import { DebounceFunc } from "../../Global/Utils"
import { CoverProgress } from "../Components/CoverProgress"
import { Redirect } from "react-router"
import { PasswordField } from "../Components/PasswordFiled"

const useStyles = makeStyles(theme => ({
  form: {
    display: "flex",
    flexDirection: "column",
    maxWidth: 400,
    margin: "auto",
    "&>*": {
      margin: theme.spacing(1, 0)
    }
  },
  mid: {
    textAlign: "center"
  }
}))

const TestItem = (field: string, path: string) => DebounceFunc(async (value: string, callback: (res: boolean) => void) => {
  try {
    const res = await Api.post<string>(path, Xform({ [field]: value }))
    if (res.data === "acceptable") callback(true)
    else callback(false)
  } catch (error) {
    setMessage("error.neterr", "error")
    callback(false)
  }
}, 800)

const TestEmail = TestItem("email", "account/testemail")
const TestUsername = TestItem("username", "account/testusername")

const emailbtntext = (checkstate: checkstate) => {
  switch (checkstate) {
    case "checking": return " "
    case "invalid": return <FormattedMessage id="info.emailregisterd" />
    case "notchecking": return " "
    case "valid": return <FormattedMessage id="label.sendemail" />
  }
}
const usernametesttext = (checkstate: checkstate) => {
  switch (checkstate) {
    case "checking": return " "
    case "invalid": return <FormattedMessage id="info.usernameregistered" />
    case "notchecking": return " "
    case "valid": return <FormattedMessage id="info.usernameavailable" />
  }
}

export const RegisterPage = () => {

  const classes = useStyles()

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

  const s = useLocalStore(() => ({
    loading: false,
    success: false
  }))

  const Register = async () => {
    s.loading = true
    try {
      await Api.post("account/register", Xform(FormValue(form)))
      await LoadCurrentUser()
      s.success = true
      return
    } catch (error) {
      setMessage("error.neterr", "error")
    }
    s.loading = false
  }

  const SendEmail = async () => {
    s.loading = true
    try {
      await Api.post("account/sendregisteremail", Xform({ email: form.email.value }))
      setMessage("notice.emailmaynotsent", "success")
    } catch (error) {
      const res = HandleErr(error)
      if (res) setMessage("error.senttoomanyemails", "error")
      else setMessage("error.neterr", "error")
    }
    s.loading = false
  }

  return useObserver(() => (
    <Box>
      {s.success || UserState.user ?
        <Redirect to="/"></Redirect> :
        <>
          <Box m={1} className={classes.mid}>
            <Typography variant="h5">
              **&nbsp;<FormattedMessage id="notice.emailmaynotsent" />&nbsp;**
            </Typography>
          </Box>
          <Box p={2} className={classes.form}>
            <TextField label={<FormattedMessage id="label.email" />} {...form.email} />
            <CoverProgress loading={emailcheck === "checking"}>
              <Button disabled={emailcheck !== "valid" || s.loading}
                onClick={SendEmail} fullWidth>
                {emailbtntext(emailcheck)}
              </Button>
            </CoverProgress>
            <TextField label={<FormattedMessage id="label.token" />}  {...form.token} />
            <TextField label={<FormattedMessage id="label.username" />}  {...form.username} />
            <CoverProgress loading={usernamecheck === "checking"}>
              <Typography variant="body2">{usernametesttext(usernamecheck)}</Typography>
            </CoverProgress>
            <PasswordField label={<FormattedMessage id="label.password" />} {...form.password} />
            <Button variant="contained"
              disabled={s.loading || !formValid || usernamecheck !== "valid" || emailcheck !== "valid"}
              onClick={Register}>
              <FormattedMessage id="label.submit" />
            </Button>
          </Box>
        </>}
    </Box>
  ))
}
