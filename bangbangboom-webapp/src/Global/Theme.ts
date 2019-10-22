import { createMuiTheme } from "@material-ui/core"
import { pink, lightBlue, red } from "@material-ui/core/colors"

export const theme = createMuiTheme({
  palette: {
    primary: { main: lightBlue[500], contrastText: "white" },
    secondary: { main: pink["A200"] },
    error: red
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: "inherit"
      }
    }
  }
})

export const mediaQuery = {
  sm: {
    [theme.breakpoints.up("sm")]: {
      display: "none !important",
      margin: "0 !important"
    }
  },
  lg: {
    [theme.breakpoints.down("xs")]: {
      display: "none !important"
    }
  },
}
