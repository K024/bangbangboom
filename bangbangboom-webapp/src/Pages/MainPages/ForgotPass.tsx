import React from "react"
import { Box, Typography, TextField, Button, makeStyles } from "@material-ui/core"
import { useObserver, useLocalStore } from "mobx-react-lite"
import { FormattedMessage } from "react-intl"
import { useObservableForm, FormValue } from "../../Global/UseObservableForm"
import { PasswordReg, LoadCurrentUser, UserState } from "../UserState"
import { Api, Xform, HandleErr } from "../../Global/Axios"
import { setMessage } from "../../Global/Snackbar"
import { Redirect } from "react-router"

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

export const ForgotPassPage = () => {

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
    newpassword: {
      required: true,
      validator: (s: string) => PasswordReg.test(s) || <FormattedMessage id="error.passwordformat" />
    }
  }))

  const s = useLocalStore(() => ({
    loading: false,
    success: false
  }))

  const SendEmail = async () => {
    s.loading = true
    try {
      await Api.post("account/forgotpassword", Xform({ email: form.email.value }))
      setMessage("notice.emailmaynotsent", "success")
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
    s.loading = false
  }


  const ResetPass = async () => {
    s.loading = true
    try {
      await Api.post("account/resetpassword", Xform(FormValue(form)))
      await LoadCurrentUser()
      s.success = true
    } catch (error) {
      setMessage("error.neterr", "error")
    }
    s.loading = false
  }

  return useObserver(() => (
    <Box>
      {s.success || UserState.user ?
        <Redirect to="/" /> :
        <>
          <Box m={1} className={classes.mid}>
            <Typography variant="h5">
              **&nbsp;<FormattedMessage id="notice.emailmaynotsent" />&nbsp;**
          </Typography>
          </Box>
          <Box p={2} className={classes.form}>
            <TextField label={<FormattedMessage id="label.email" />} {...form.email} />
            <Button disabled={form.email.error || s.loading}
              onClick={SendEmail}>
              <FormattedMessage id="label.sendemail" />
            </Button>
            <TextField label={<FormattedMessage id="label.token" />}  {...form.token} />
            <TextField label={<FormattedMessage id="label.newpassword" />} {...form.newpassword} />
            <Button
              disabled={s.loading || !formValid}
              onClick={ResetPass} variant="contained">
              <FormattedMessage id="label.submit" />
            </Button>
          </Box>
        </>}
    </Box>
  ))
}
