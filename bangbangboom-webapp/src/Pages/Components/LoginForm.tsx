import React, { useState } from "react"
import { useObserver } from "mobx-react-lite"
import { makeStyles } from "@material-ui/core"
import { TextField, Box, Button } from "@material-ui/core"
import { FormattedMessage } from "react-intl"
import { PasswordField } from "./PasswordFiled"
import { useObservableForm, FormValue } from "../../Global/UseObservableForm"
import { useHistory } from "react-router"
import { ButtonProgress } from "./CoverProgress"
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

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const history = useHistory()

  const handleForward = (to: string) => {
    history.push(to)
    onClose()
  }

  const login = async () => {
    setLoading(true)
    try {
      await Api.post("account/login", Xform(FormValue(form)))
      await LoadCurrentUser()
      setSuccess(true)
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
          setMessage("user.usernamepasswrong", "error")
      }
    }
    setLoading(false)
  }

  return useObserver(() => (
    <Box className={classes.root} display="flex" flexDirection="column" alignItems="stretch">
      <TextField
        label={<FormattedMessage id="label.usernameemail" />}
        {...form.username}>
      </TextField>
      <PasswordField
        label={<FormattedMessage id="label.password" />}
        {...form.password}>
      </PasswordField>
      <ButtonProgress position="relative" loading={loading}>
        <Button variant="contained" color="primary" disabled={!formValid || loading || success}
          onClick={login} fullWidth>
          <FormattedMessage id="label.login" />
        </Button>
      </ButtonProgress>
      <Box display="flex" justifyContent="space-around">
        <Button onClick={() => handleForward("/register")}><FormattedMessage id="label.register" /></Button>
        <Button onClick={() => handleForward("/forgotpass")}><FormattedMessage id="label.forgotpass" /></Button>
      </Box>
    </Box>))
}