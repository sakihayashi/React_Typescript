import React from 'react';

import { observer } from 'mobx-react-lite';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import LocaleStore from '@otosense/locale';
import ErrorIcon from '@mui/icons-material/Error';

import { useRootContext } from '../../RootStore';

const BackendFailedDialog = () => {
  const root = useRootContext();

  const locale: LocaleStore = root.appState.locale;

  return (
    <Dialog open={true} maxWidth="lg">
      <DialogTitle sx={{display: 'flex', alignItems: 'center'}}>
        <ErrorIcon color="error" sx={{fontSize: 32, '@media (min-width:1280px)': {
          fontSize: 36,
        },}}/>
        <Box sx={{fontSize: 24, '@media (min-width:1280px)': {
          fontSize: 32,
        },}} ml={0.5}>
          {locale.getString('general.backendFailed')}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h3" sx={{marginLeft: '5px'}}>
          {locale.getString('general.restartBackend')}
        </Typography>
      </DialogContent>
      <DialogActions />
    </Dialog>
  );
};

export default observer(BackendFailedDialog);
