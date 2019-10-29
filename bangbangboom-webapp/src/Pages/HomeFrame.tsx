import React, { ReactNode, useRef, useState } from "react"
import { Box, makeStyles, Menu, MenuItem, Typography, ButtonBase, IconButton, Avatar, Fade, Popover } from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIosOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import clsx from "clsx"
import { FormattedMessage } from "react-intl"
import { useHistory } from "react-router"
import { Locale } from "../Global/Locale"
import { mediaQuery } from "../Global/Theme"
import { LoginForm } from "./Components/LoginForm";

const useStyles = makeStyles(theme => ({
  header: {
    top: 0,
    height: 50,
    width: "100%",
    position: "fixed",
    background: "rgba(0,0,0,0.3)",
    color: "#ffffff",
    backdropFilter: "blur(10px)",
    boxShadow: "0 5px 5px rgba(0,0,0,0.2)",
    "&:hover": {
      color: "#e0e0e0"
    },
    "&+*": {
      paddingTop: 50
    },
    zIndex: 100,
  },
  menuItem: {
    width: "auto",
    height: "100%",
    display: "flex",
    alignItems: "center",
    transition: "color 0.3s",
    margin: "0 5px",
    cursor: "pointer",
    "&>*": {
      padding: "0 5px"
    },
    "&:hover": {
      color: "#ffffff"
    },
  },
  content: {
    maxWidth: 800,
    margin: "auto",
    width: "100%",
    position: "relative",
  },
  main: {
    minHeight: "85vh",
    transition: "height 0.3s",
  },
  footer: {
    margin: theme.spacing(),
    borderTop: "solid #e0e0e0 1px",
  },
  ...mediaQuery,
  iconbtn: {
    padding: 0
  },
  loginMenu: {
    width: 280,
    padding: theme.spacing(1)
  }
}))

const menuList = [
  { text: "menu.search", to: "/search" },
  { text: "menu.ranking", to: "/ranking" },
  { text: "menu.favorites", to: "/favorites" },
  { text: "menu.mapping", to: "/mapping" },
  { text: "menu.settings", to: "/settings" },
]

const langList: Array<typeof Locale['locale']> = [
  "en", "zh"
]

const SmallMenu = (prop: { direct: (to: string) => void }) => {
  const classes = useStyles()
  const menuBtn = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  return (<>
    <ButtonBase className={clsx(classes.menuItem, classes.sm)} onClick={() => setOpen(!open)} color="inherit" ref={menuBtn}>
      <MenuIcon style={{ width: 32, height: 32 }} />
    </ButtonBase>
    <Menu open={open} anchorEl={menuBtn.current} onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }} getContentAnchorEl={null}>
      {menuList.map(x => (
        <MenuItem key={x.to} onClick={() => { prop.direct(x.to); setOpen(false) }} style={{ height: 50, width: 200 }}>
          <ArrowForwardIosIcon style={{ marginRight: 10, color: "#d0d0d0", width: 18, height: 18 }} />
          <Typography><FormattedMessage id={x.text} /></Typography>
        </MenuItem>
      ))}
    </Menu></>)
}

const LangMenu = () => {
  const classes = useStyles()
  const langBtn = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const setLocale = (locale: typeof Locale['locale']) => {
    Locale.locale = locale
    setOpen(false)
  }
  return (<>
    <ButtonBase className={classes.menuItem} onClick={() => setOpen(!open)} color="inherit" ref={langBtn}>
      {Locale.locale}
      <ExpandMoreIcon />
    </ButtonBase>
    <Menu open={open} anchorEl={langBtn.current} onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }} getContentAnchorEl={null}>
      {langList.map(x => (
        <MenuItem key={x} onClick={() => setLocale(x)} style={{ height: 50, width: 120 }} disabled={Locale.locale === x}>
          <Typography>{x}</Typography>
        </MenuItem>
      ))}
    </Menu></>)
}

const LoginMenu = () => {
  const classes = useStyles()
  const loginBtn = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  return (<>
    <ButtonBase className={clsx(classes.menuItem, classes.lg)} onClick={() => setOpen(!open)} color="inherit" ref={loginBtn}>
      <FormattedMessage id="label.login" />
    </ButtonBase>
    <Popover open={open} anchorEl={loginBtn.current} onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }} getContentAnchorEl={null}
      transformOrigin={{ vertical: "top", horizontal: "right" }}>
      <Box className={classes.loginMenu}>
        <LoginForm onClose={() => setOpen(false)} />
      </Box>
    </Popover></>)
}

export const HomeFrame = ({ children = {} as ReactNode }) => {
  const classes = useStyles()
  const history = useHistory()

  const direct = (path: string) => {
    history.push(path)
  }

  return (
    <Fade in>
      <Box>
        <Box className={classes.header}>
          <Box className={classes.content} height="100%">
            <Box display="flex" left="0" height="100%" position="absolute">
              <SmallMenu direct={direct} />
              <ButtonBase className={classes.menuItem} onClick={() => direct("/")} color="inherit">
                <Typography>bangbangboom</Typography>
              </ButtonBase>
              {menuList.map(x => (
                <ButtonBase key={x.to} className={clsx(classes.menuItem, classes.lg)} onClick={() => direct(x.to)} color="inherit">
                  <Typography><FormattedMessage id={x.text} /></Typography>
                </ButtonBase>
              ))}
            </Box>
            <Box display="flex" right="0" height="100%" position="absolute">
              <LangMenu />
              <LoginMenu />
              <Box className={classes.menuItem}>
                <IconButton classes={{ root: classes.iconbtn }} onClick={() => direct("/dashboard")}>
                  <Avatar style={{ background: "#808080" }}>C</Avatar>
                </IconButton>
              </Box>
              <ButtonBase className={classes.menuItem} onClick={() => history.goBack()} color="inherit">
                <ArrowBackIosIcon />
              </ButtonBase>
            </Box>
          </Box>
        </Box>
        <Box className={classes.content}>
          <Fade key={history.location.pathname} in>
            <Box className={classes.main}>
              {children}
            </Box>
          </Fade>
          <Box className={classes.footer}>
            Footer
        </Box>
        </Box>
      </Box>
    </Fade>
  )
}



