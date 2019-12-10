import React, { useCallback } from "react"
import { useObserver, useLocalStore } from "mobx-react-lite"
import { makeStyles } from "@material-ui/core"
import { TextField, Box, Button } from "@material-ui/core"
import { FormattedMessage } from "react-intl"
import { PasswordField } from "./PasswordFiled"
import { useObservableForm, FormValue } from "../../Global/UseObservableForm"
import { useHistory } from "react-router"
import { CoverProgress } from "./CoverProgress"
import { LoadCurrentUser } from "../UserState"
import { setMessage } from "../../Global/Snackbar"
import { Api, HandleErr, Xform } from "../../Global/Axios"

const useStyles = makeStyles(theme => ({
  root: {
    "&>*": {
      margin: theme.spacing(0.5)
    }
  },
}))

export const LoginForm = ({ onClose = () => { } }) => {

  const classes = useStyles()

  const { form, formValid } = useObservableForm(() => ({
    username: {
      required: true,
    },
    password: {
      required: true,
    },
  }))

  const s = useLocalStore(() => ({
    loading: false,
    success: false
  }))

  const history = useHistory()

  const handleForward = (to: string) => {
    history.push(to)
    onClose()
  }

  const login = useCallback(async () => {
    s.loading = true
    try {
      await Api.post("account/login", Xform(FormValue(form)))
      await LoadCurrentUser()
      s.success = true
      onClose()
    } catch (error) {
      const res = HandleErr<string>(error)
      if (!res)
        setMessage("error.neterr", "error")
      else {
        const s = res.data.toLowerCase()
        if (s.startsWith("locked out"))
          setMessage("user.lockedout", "error")
        else if (s.startsWith("username or password wrong"))
          setMessage("info.usernamepasswrong", "error")
      }
    }
    s.loading = false
  }, [s, onClose, form])

  const keydown = (e: React.KeyboardEvent) => {
    switch (e.key.toLowerCase()) {
      case "enter":
        if (formValid)
          login()
        break
    }
  }

  return useObserver(() => (
    <Box className={classes.root} display="flex" flexDirection="column" alignItems="stretch">
      <TextField onKeyDown={keydown}
        label={<FormattedMessage id="label.usernameemail" />}
        {...form.username}>
      </TextField>
      <PasswordField onKeyDown={keydown}
        label={<FormattedMessage id="label.password" />}
        {...form.password}>
      </PasswordField>
      <CoverProgress position="relative" loading={s.loading}>
        <Button variant="contained" color="primary" disabled={!formValid || s.loading || s.success}
          onClick={login} fullWidth>
          <FormattedMessage id="label.login" />
        </Button>
      </CoverProgress>
      <Box display="flex" justifyContent="space-around">
        <Button onClick={() => handleForward("/register")}><FormattedMessage id="label.register" /></Button>
        <Button onClick={() => handleForward("/forgotpass")}><FormattedMessage id="label.forgotpass" /></Button>
      </Box>
    </Box>))
}