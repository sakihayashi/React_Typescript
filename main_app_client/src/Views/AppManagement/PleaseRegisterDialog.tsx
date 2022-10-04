import React from 'react';

import { observer } from 'mobx-react-lite';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import LocaleStore from '@otosense/locale';
import { useRootContext } from '../../RootStore';
import AppState from '../../appState';

import ADIlogo from '../../assets/OtoSense_logo_black.svg';
import { LoginLogo } from '../styles';
import { TextTransformNone } from '../../globalStyles/texts';

const PleaseRegisterDialog = () => {
  const root = useRootContext();
  const appState: AppState = root.appState;
  const locale: LocaleStore = appState.locale;
  return (
    <Dialog open={!appState.isRegistered}>
      <DialogTitle>
        <Box>
          <LoginLogo src={ADIlogo} alt="ADI logo" />
          <TextTransformNone variant="h1" >
            {locale.getString('login.subtitle')}
          </TextTransformNone>
        </Box>
      </DialogTitle>
      <DialogContent>
        <TextTransformNone variant="h3" mb={0.5}>{locale.getString('general.pleaseRegister')}</TextTransformNone>
        <Typography variant="body1">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam commodo sollicitudin condimentum. Aliquam placerat orci metus, et accumsan nisl aliquam a. Pellentesque et ultricies sem. Nulla ultricies cursus augue, ut imperdiet ligula finibus ut.</Typography>
      </DialogContent>
      <DialogActions>{}</DialogActions>
    </Dialog>
  );
};

export default observer(PleaseRegisterDialog);