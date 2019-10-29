import React from 'react';
import clsx from 'clsx';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { orange, lightGreen } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core/styles';
import { observable } from 'mobx';
import { useObserver } from 'mobx-react-lite';
import { FormattedMessage } from 'react-intl';


const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
}

const Message = observable({
  message: "",
  open: false,
  type: "info" as keyof typeof variantIcon,
})

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: lightGreen[500],
  },
  error: {
    backgroundColor: theme.palette.error.main,
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  warning: {
    backgroundColor: orange[500],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}))

export function setMessage(message: string, type = "info" as keyof typeof variantIcon) {
  Message.message = message
  Message.type = type
  Message.open = true
}

const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
  if (reason === 'clickaway') return
  Message.open = false
};

export const GlobalSnackbar = () => {

  const classes = useStyles();
  const Icon = variantIcon[Message.type]

  return useObserver(() => (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={Message.open}
      autoHideDuration={5000}
      onClose={handleClose}
      key={Message.message + Message.type}
    >

      <SnackbarContent
        className={classes[Message.type]}
        message={
          <span className={classes.message}>
            <Icon className={clsx(classes.icon, classes.iconVariant)} />
            <FormattedMessage id={Message.message}></FormattedMessage>
          </span>
        }
        action={[
          <IconButton key="close" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon className={classes.icon} />
          </IconButton>,
        ]}
      />
    </Snackbar>
  ))
}
