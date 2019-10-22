import React, { useState } from "react"
import { useObserver } from "mobx-react-lite"
import { makeStyles } from "@material-ui/core"
import { TextField, Box, Button, CircularProgress } from "@material-ui/core"
import { FormattedMessage } from "react-intl"
import { PasswordField } from "./PasswordFiled"
import { useObservableForm } from "../../Global/UseObservableForm"
import { useHistory } from "react-router"

const useStyles = makeStyles(theme => ({
  root: {
    "&>*": {
      margin: theme.spacing(0.5)
    }
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
}))

export const LoginForm = ({ onClose = () => { } }) => {

  const classes = useStyles()

  const { form, formValid } = useObservableForm({
    username: {
      required: true,
    },
    password: {
      required: true,
    },
  })

  const [loading, setLoading] = useState(false)

  const history = useHistory()

  const handleForward = (to: string) => {
    history.push(to)
    onClose()
  }

  const login = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onClose()
    }, 2000)
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
      <Box position="relative">
        <Button variant="contained" color="primary" disabled={!formValid || loading}
          onClick={login} fullWidth>
          <FormattedMessage id="label.login" />
        </Button>
        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </Box>
      <Box display="flex" justifyContent="space-around">
        <Button onClick={() => handleForward("/register")}><FormattedMessage id="label.register" /></Button>
        <Button onClick={() => handleForward("/forgotpass")}><FormattedMessage id="label.forgotpass" /></Button>
      </Box>
    </Box>))
}