import React from 'react';

import { AlertColor, Button, Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
// import Snackbar from '@mui/material/Snackbar';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';

import { ToastStore } from '.';
import { useRootContext } from '../../RootStore';

const Toast = () => {
  const root = useRootContext();
  const toastStore: ToastStore = root.toastStore;
  const locale: LocaleStore = root.appState.locale;
  const dismiss = locale.getString('util.dismiss');
  const AlertStyled = React.forwardRef<HTMLDivElement, AlertProps>(
    (props, ref) => {
      return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    }
  );
  AlertStyled.displayName = 'AlertStyled';
  const handleClose = (e: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    toastStore.setOpenToast(false);
  };
  const action = (
    <React.Fragment>
      <Button
        onClick={handleClose}
        sx={{ ml: 1, filter: 'brightness(120%)', textTransform: 'capitalize' }}
        variant="contained"
        color={toastStore.toast.severity as AlertColor}
      >
        {dismiss}
      </Button>
    </React.Fragment>
  );
  return (
    <Snackbar
      open={toastStore.openToast}
      autoHideDuration={toastStore.toast.duration}
      onClose={handleClose}
      action={action}
    >
      <AlertStyled
        onClose={handleClose}
        color={toastStore.toast.severity as AlertColor}
        severity={toastStore.toast.severity as AlertColor}
        action={action}
        elevation={4}
        variant="filled"
      >
        {toastStore.toast.message}
      </AlertStyled>
    </Snackbar>
  );
};

export default observer(Toast);
