import React from "react"
import { useObserver, useLocalStore } from "mobx-react-lite"
import { Box, Button, Typography, makeStyles } from "@material-ui/core"
import { UserState, LoadCurrentUser } from "../UserState"
import { LoginForm } from "../Components/LoginForm"
import { setMessage } from "../../Global/Snackbar"
import { Api, Xform, Form } from "../../Global/Axios"
import { FormattedMessage } from "react-intl"
import { Editable } from "../Components/Editable"
import { UserProfile } from "../Components/UserProfile"
import { CanNone } from "../Components/CanNone"

const useStyles = makeStyles(theme => ({
  root: {
    margin: "auto",
    maxWidth: 600,
    padding: theme.spacing(2),
    "&>*": {
      margin: theme.spacing(1, 0)
    },
    "&>h6": {
      marginTop: theme.spacing(2)
    }
  },
  line: {
    display: "flex",
    alignItems: "center",
    "&>*": {
      marginRight: theme.spacing(1)
    },
    margin: theme.spacing(1)
  },
  avatar: {
    width: "calc(50px + 10vw)",
    height: "calc(50px + 10vw)",
    maxWidth: "100px",
    maxHeight: "100px",
    fontSize: 50
  },
  avatarbox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
}))

export const ProfilePage = () => {

  const classes = useStyles()

  const s = useLocalStore(() => ({
    loading: false
  }))

  const handleLogout = async () => {
    s.loading = true
    try {
      await Api.post("account/logout")
      UserState.user = null
      await LoadCurrentUser()
    } catch (error) {
      setMessage("error.neterr", "error")
    }
    s.loading = false
  }

  const changeNickname = async (nickname: string) => {
    s.loading = true
    try {
      await Api.post("user/setnickname", Xform({ nickname }))
      await LoadCurrentUser()
      setMessage("info.success", "success")
    } catch (error) {
      setMessage("error.neterr", "error")
    }
    s.loading = false
  }
  const changeWhatsup = async (whatsup: string) => {
    s.loading = true
    try {
      await Api.post("user/setwhatsup", Xform({ whatsup }))
      await LoadCurrentUser()
      setMessage("info.success", "success")
    } catch (error) {
      setMessage("error.neterr", "error")
    }
    s.loading = false
  }
  const handleUploadProfile = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.click()
    input.addEventListener("change", async () => {
      if (input.files && input.files.length) {
        const file = input.files.item(0)
        if (!file) return
        s.loading = true
        try {
          await Api.post("user/uploadprofile", Form({ file }))
          await LoadCurrentUser()
          setMessage("info.success", "success")
        } catch (error) {
          setMessage("error.neterr", "error")
        }
        s.loading = false
      }
    })
  }
  const handleDeleteProfile = async () => {
    s.loading = true
    try {
      await Api.post("user/uploadprofile")
      await LoadCurrentUser()
      setMessage("info.success", "success")
    } catch (error) {
      setMessage("error.neterr", "error")
    }
    s.loading = false
  }

  return useObserver(() => {

    if (!UserState.user) return (
      <Box m="auto" p={2} maxWidth="400px">
        <LoginForm />
      </Box>)

    return (
      <Box className={classes.root}>
        <Box className={classes.avatarbox}>
          <UserProfile user={UserState.user} classes={{ root: classes.avatar }} />
          <Box className={classes.line}>
            <Button color="secondary" onClick={handleDeleteProfile} disabled={s.loading}>
              <FormattedMessage id="label.delete" />
            </Button>
            <Button color="primary" onClick={handleUploadProfile} disabled={s.loading}>
              <FormattedMessage id="label.upload" />
            </Button>
          </Box>
        </Box>
        <Typography variant="h6">
          <FormattedMessage id="label.nickname" />:
        </Typography>
        <Box className={classes.line}>
          <Editable value={UserState.user.nickname || ""} onChange={changeNickname} canEdit={!s.loading}>
            <CanNone value={UserState.user.nickname} />
          </Editable>
        </Box>
        <Typography variant="h6">
          <FormattedMessage id="label.whatsup" />:
        </Typography>
        <Box className={classes.line}>
          <Editable value={UserState.user.whatsup || ""} onChange={changeWhatsup} canEdit={!s.loading}
            textFieldProps={{ multiline: true }}>
            <CanNone value={UserState.user.whatsup} />
          </Editable>
        </Box>
        <Button color="secondary" variant="outlined" fullWidth onClick={handleLogout}>
          <FormattedMessage id="label.logout" />
        </Button>
      </Box>
    )
  })
}
