import { AlertColor } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import LocaleStore from '@otosense/locale';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useRootContext } from "../../App";
import { ToastStore } from ".";

const Toast = () => {
  const root = useRootContext();
  const toastStore: ToastStore = root.toastStore;
  const locale: LocaleStore = root.appState.locale;
  const dismiss = locale.getString('util.dismiss');
  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
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
      <Alert
        onClose={handleClose}
        color={toastStore.toast.severity as AlertColor}
        severity={toastStore.toast.severity as AlertColor}
        // sx={{ width: '100%' }}
        action={action}
        elevation={4}
        variant="filled"
      >
        {toastStore.toast.message}
      </Alert>
    </Snackbar>
  );
};

export default observer(Toast);
